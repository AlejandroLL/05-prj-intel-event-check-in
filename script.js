const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//visual progress bar and attendee count
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

//welcome message elements
const welcomeContainer = document.getElementById("welcomeContainer");
const welcomeMessage = document.getElementById("welcomeMessage");

//celebration message elements
const celebrationWrapper = document.getElementById("celebrationWrapper");
const celebrationContainer = document.getElementById("celebrationContainer");
const celebrationMessage = document.getElementById("celebrationMessage");

//team colors
const teamColors = {
  water: "#e8f7fc",
  zero: "#ecfdf3",
  power: "#fff7ed",
};

//attendee names containers
const attendeeNames = {
  water: document.getElementById("waterNames"),
  zero: document.getElementById("zeroNames"),
  power: document.getElementById("powerNames"),
};

//track attendees
let count = 0;
const maxCount = 50;
let celebrationShown = false;
//WELCOME MESSAGE: Store timeout ID so we can clear it if a new user checks in
let welcomeTimeoutId = null;

//LOCALSTORAGE: Function to save attendance data to browser storage
function saveToLocalStorage() {
  localStorage.setItem("totalAttendance", count);
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent,
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent,
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent,
  );
  localStorage.setItem("celebrationShown", celebrationShown);
  //LOCALSTORAGE: Save celebration message text and background color
  localStorage.setItem("celebrationMessage", celebrationMessage.textContent);
  localStorage.setItem(
    "celebrationBgColor",
    celebrationContainer.style.backgroundColor,
  );
}

//LOCALSTORAGE: Function to load attendance data from browser storage
function loadFromLocalStorage() {
  const savedTotal = localStorage.getItem("totalAttendance");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");
  const savedCelebration = localStorage.getItem("celebrationShown");
  //LOCALSTORAGE: Load celebration message text and background color
  const savedCelebrationMsg = localStorage.getItem("celebrationMessage");
  const savedCelebrationBg = localStorage.getItem("celebrationBgColor");

  //If data exists in localStorage, restore it
  if (savedTotal !== null) {
    count = parseInt(savedTotal);
    document.getElementById("waterCount").textContent = savedWater || "0";
    document.getElementById("zeroCount").textContent = savedZero || "0";
    document.getElementById("powerCount").textContent = savedPower || "0";
    celebrationShown = savedCelebration === "true";
    attendeeCount.textContent = count;
    let percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;

    //If celebration was already shown, display it again with its saved content
    if (celebrationShown) {
      celebrationMessage.textContent = savedCelebrationMsg || "";
      celebrationContainer.style.backgroundColor = savedCelebrationBg || "";
      celebrationWrapper.style.display = "block";
    }
  } else {
    /**/
    //If no saved data, use testing defaults
    attendeeCount.textContent = "48";
    count = 48;
    let percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;
  }
}

//LOCALSTORAGE: Load data when page loads
loadFromLocalStorage();

//CONFETTI: Function to trigger confetti with subtle settings
function triggerConfetti() {
  //CONFETTI: Trigger subtle confetti - not too much to avoid distraction
  confetti({
    particleCount: 50, //moderate number of particles
    spread: 70, //moderate spread angle
    origin: {
      x: 0.5,
      y: 0.3, //starts from celebration area
    },
    gravity: 0.8, //normal gravity so confetti falls
    ticks: 100, //moderate duration
  });
}

//CONFETTI: Function to trigger celebration confetti with much larger effect
function triggerCelebrationConfetti() {
  //CONFETTI: Big burst for initial goal celebration -  more visual impact
  confetti({
    particleCount: 250, // more particles than hover effect
    spread: 100, //wider spread
    origin: {
      x: 0.5,
      y: 0.3,
    },
    gravity: 1, //slightly slower gravity for longer effect
    ticks: 300, //longer duration
  });

  //CONFETTI: Add another burst for extra excitement
  setTimeout(function () {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: {
        x: 0.5,
        y: 0.3,
      },
      gravity: 0.8,
      ticks: 120,
    });
  }, 300); //stagger the bursts
}

//CONFETTI: Add hover event to celebration container for extra confetti
celebrationWrapper.addEventListener("mouseenter", function () {
  triggerConfetti();
});

//handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); //prevent default form submission

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  count++;

  //update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Attendee: ${name}, Team: ${teamName}, Progress: ${percentage}`);

  //team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //add attendee name to team card
  const nameDiv = document.createElement("div");
  nameDiv.className = "attendee-name";
  nameDiv.textContent = name;
  attendeeNames[team].appendChild(nameDiv);

  //show welcome message
  const message = `welcome ${name}, from ${teamName}!`;
  welcomeMessage.textContent = message;
  welcomeContainer.style.backgroundColor = teamColors[team];
  welcomeContainer.style.display = "block";

  //WELCOME MESSAGE: Clear any existing welcome timeout before starting a new one
  if (welcomeTimeoutId !== null) {
    clearTimeout(welcomeTimeoutId);
  }

  //hide welcome message after 5 seconds
  welcomeTimeoutId = setTimeout(function () {
    welcomeContainer.style.display = "none";
  }, 5000);

  //check if check-in goal is reached
  if (count >= maxCount && !celebrationShown) {
    const celebrationMsg = `🎉 ${teamName} reached the check-in goal! 🎉`;
    celebrationMessage.textContent = celebrationMsg;
    celebrationContainer.style.backgroundColor = teamColors[team];
    celebrationWrapper.style.display = "block";
    celebrationShown = true;
    //CONFETTI: Trigger big celebration confetti when goal is reached
    triggerCelebrationConfetti();
  }

  //update progress bar visually
  progressBar.style.width = percentage;
  attendeeCount.textContent = parseInt(attendeeCount.textContent) + 1;

  //LOCALSTORAGE: Save all counts to browser storage after check-in
  saveToLocalStorage();

  //reset form
  form.reset();
});
