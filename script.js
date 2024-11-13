document.addEventListener("DOMContentLoaded", function () {
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

  // Function to calculate total points
  function calculateTotalPoints() {
    let totalPaperPoints = stage.paperTargets * 10;
    let totalSteelPoints = stage.steelTargets * stage.steel;
    let totalPoints = totalPaperPoints + totalSteelPoints;
    document.getElementById("totalPoints").textContent = totalPoints;
    return totalPoints;
  }

  // Function to add a paper target
  window.addPaperTarget = function () {
    stage.paperTargets++;
    document.getElementById("paperCount").textContent = stage.paperTargets;
    calculateTotalPoints();
  };

  // Function to remove a paper target
  window.removePaperTarget = function () {
    if (stage.paperTargets > 0) {
      stage.paperTargets--;
      document.getElementById("paperCount").textContent = stage.paperTargets;
      calculateTotalPoints();
    }
  };

  // Function to add a steel target
  window.addSteelTarget = function () {
    stage.steelTargets++;
    document.getElementById("steelCount").textContent = stage.steelTargets;
    calculateTotalPoints();
  };

  // Function to remove a steel target
  window.removeSteelTarget = function () {
    if (stage.steelTargets > 0) {
      stage.steelTargets--;
      document.getElementById("steelCount").textContent = stage.steelTargets;
      calculateTotalPoints();
    }
  };

  // Function to handle the "Show Stats" button click
  function showStats(row) {
    const alphaHits = row.getAttribute("data-alpha");
    const charlieHits = row.getAttribute("data-charlie");
    const deltaHits = row.getAttribute("data-delta");
    const mikeHits = row.getAttribute("data-mike");
    const steelHits = row.getAttribute("data-steel");

    const stats = `Alpha: ${alphaHits}, Charlie: ${charlieHits}, Delta: ${deltaHits}, Mike: ${mikeHits}, Steel: ${steelHits}`;
    row.cells[5].textContent = stats; // Add stats to the "Show Stats" column
  }

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
    const statsCell = newRow.insertCell(5); // Column for Show Stats button
    const deleteCell = newRow.insertCell(6); // Column for Delete button

    // Store hits as data attributes for stats button to use
    newRow.setAttribute(
      "data-alpha",
      document.getElementById("alphaHits").value || 0
    );
    newRow.setAttribute(
      "data-charlie",
      document.getElementById("charlieHits").value || 0
    );
    newRow.setAttribute(
      "data-delta",
      document.getElementById("deltaHits").value || 0
    );
    newRow.setAttribute(
      "data-mike",
      document.getElementById("mikeHits").value || 0
    );
    newRow.setAttribute(
      "data-steel",
      document.getElementById("steelHits").value || 0
    );

    // Create a common button style for both actions
    function createButton(text, onClick) {
      const button = document.createElement("button");
      button.classList.add("action-button");
      button.textContent = text;
      button.onclick = onClick;
      return button;
    }

    // Add a Show Stats button
    const statsButton = createButton("Show Stats", function () {
      alert(
        `Alpha: ${newRow.getAttribute(
          "data-alpha"
        )}, Charlie: ${newRow.getAttribute(
          "data-charlie"
        )}, Delta: ${newRow.getAttribute(
          "data-delta"
        )}, Mike: ${newRow.getAttribute(
          "data-mike"
        )}, Steel: ${newRow.getAttribute("data-steel")}`
      );
    });
    statsCell.appendChild(statsButton);

    // Add a Delete button with trash can icon
    const deleteButton = createButton("🗑️ Delete", function () {
      tableBody.removeChild(newRow); // Removes the row from the table
    });
    deleteCell.appendChild(deleteButton);

    nameCell.textContent = shooterName;
    totalPointsCell.textContent = totalPoints;
    scoredPointsCell.textContent = totalScore;
    timeCell.textContent = totalTime;
    finalResultCell.textContent = finalResult.toFixed(2);
  }

  // Function to delete a row
  function deleteRow(row) {
    const tableBody = document
      .getElementById("scoreTable")
      .getElementsByTagName("tbody")[0];
    tableBody.removeChild(row);
  }

  window.calculateScore = function () {
    let alphaHits = parseInt(document.getElementById("alphaHits").value) || 0;
    let charlieHits =
      parseInt(document.getElementById("charlieHits").value) || 0;
    let deltaHits = parseInt(document.getElementById("deltaHits").value) || 0;
    let mikeHits = parseInt(document.getElementById("mikeHits").value) || 0;
    let steelHits = parseInt(document.getElementById("steelHits").value) || 0;
    let totalTime = parseInt(document.getElementById("totalTime").value) || 0;

    // Validation for paper targets hits
    const maxPaperHits = stage.paperTargets * 2;
    const totalPaperHits = alphaHits + charlieHits + deltaHits;

    if (totalPaperHits > maxPaperHits) {
      alert(
        `Total paper hits (Alpha + Charlie + Delta) cannot exceed ${maxPaperHits} hits.`
      );
      return; // Stop the calculation
    }

    // Validation for steel hits
    const maxSteelHits = stage.steelTargets;

    if (steelHits > maxSteelHits) {
      alert(`Total steel hits cannot exceed ${maxSteelHits}.`);
      return; // Stop the calculation
    }

    // Calculate total score
    let paperScore =
      alphaHits * stage.alpha +
      charlieHits * stage.charlie +
      deltaHits * stage.delta +
      mikeHits * stage.mike;

    let steelScore = steelHits * stage.steel;
    let totalScore = paperScore + steelScore;
    let totalPoints = calculateTotalPoints();
    let finalResult = totalScore / totalTime;

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

  // Initialize total points
  calculateTotalPoints();
});
