document.addEventListener("DOMContentLoaded", function () {
  // Stage setup with initial values
  let stage = {
    major: true,
    paperTargets: 6,
    steelTargets: 4,
    alpha: 5,
    charlie: 4,
    delta: 1,
    mike: -10,
    steel: 5,
  };

  // Function to calculate total points based on targets and scoring
  function calculateTotalPoints() {
    let totalPaperPoints = stage.paperTargets * 10; // assuming each paper target is worth 10 points initially
    let totalSteelPoints = stage.steelTargets * stage.steel;

    let totalPoints = totalPaperPoints + totalSteelPoints;

    // Update the total points display dynamically
    document.getElementById("totalPoints").textContent = totalPoints;
    return totalPoints;
  }

  // Function to calculate and display total points based on hits and time
  window.calculateScore = function () {
    let alphaHits = parseInt(document.getElementById("alphaHits").value) || 0;
    let charlieHits =
      parseInt(document.getElementById("charlieHits").value) || 0;
    let deltaHits = parseInt(document.getElementById("deltaHits").value) || 0;
    let mikeHits = parseInt(document.getElementById("mikeHits").value) || 0;
    let steelHits = parseInt(document.getElementById("steelHits").value) || 0;
    let totalTime = parseInt(document.getElementById("totalTime").value) || 0;

    // Calculate total paper and steel score
    let paperScore =
      alphaHits * stage.alpha +
      charlieHits * stage.charlie +
      deltaHits * stage.delta +
      mikeHits * stage.mike;
    let steelScore = steelHits * stage.steel;

    let totalScore = paperScore + steelScore;

    // Get total stage points
    let totalPoints = calculateTotalPoints();

    // Calculate final result
    let finalResult = totalScore / totalTime;

    // Update the total points display
    document.getElementById("totalPoints").textContent = totalPoints;

    let shooterName =
      document.getElementById("shooterName").value || "Unknown Shooter";
    addScoreToTable(
      shooterName,
      totalPoints,
      totalScore,
      totalTime,
      finalResult
    );
  };

  function addScoreToTable(
    shooterName,
    totalPoints,
    totalScore,
    totalTime,
    finalResult
  ) {
    const tableBody = document
      .getElementById("scoreTable")
      .getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow();

    const nameCell = newRow.insertCell(0);
    const totalPointsCell = newRow.insertCell(1);
    const scoredPointsCell = newRow.insertCell(2);
    const timeCell = newRow.insertCell(3);
    const finalResultCell = newRow.insertCell(4);

    nameCell.textContent = shooterName;
    totalPointsCell.textContent = totalPoints;
    scoredPointsCell.textContent = totalScore;
    timeCell.textContent = totalTime;
    finalResultCell.textContent = finalResult.toFixed(2);
  }

  window.addPaperTarget = function () {
    stage.paperTargets++;
    document.getElementById("paperCount").textContent = stage.paperTargets;
    calculateTotalPoints();
  };

  window.removePaperTarget = function () {
    if (stage.paperTargets > 0) {
      stage.paperTargets--;
      document.getElementById("paperCount").textContent = stage.paperTargets;
      calculateTotalPoints();
    }
  };

  window.addSteelTarget = function () {
    stage.steelTargets++;
    document.getElementById("steelCount").textContent = stage.steelTargets;
    calculateTotalPoints();
  };

  window.removeSteelTarget = function () {
    if (stage.steelTargets > 0) {
      stage.steelTargets--;
      document.getElementById("steelCount").textContent = stage.steelTargets;
      calculateTotalPoints();
    }
  };

  window.toggleMajor = function () {
    stage.major = !stage.major;
    document.getElementById("majorStatus").textContent = stage.major
      ? "True"
      : "False";
    stage.delta = stage.major ? 1 : 0.5;
    stage.charlie = stage.major ? 4 : 3;
    calculateTotalPoints();
  };

  // Initialize total points at the start
  calculateTotalPoints();
});
