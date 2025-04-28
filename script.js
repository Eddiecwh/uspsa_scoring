document.addEventListener("DOMContentLoaded", function () {
  const stage = {
    major: true,
    paperTargets: 6,
    steelTargets: 0,
    alpha: 5,
    charlie: 3,
    delta: 1,
    mike: -10,
    steel: 5,
  };

  // Utility to update total points
  const updateTotalPoints = () => {
    const totalPaperPoints = stage.paperTargets * 10;
    const totalSteelPoints = stage.steelTargets * stage.steel;
    const totalPoints = totalPaperPoints + totalSteelPoints;
    document.getElementById("totalPoints").textContent = totalPoints;
    return totalPoints;
  };

  // Function to update paper and steel targets
  const updateTargetCount = (targetType, operation) => {
    if (targetType === "paper") {
      stage.paperTargets += operation;
      document.getElementById("paperCount").textContent = stage.paperTargets;
    } else if (targetType === "steel") {
      stage.steelTargets += operation;
      document.getElementById("steelCount").textContent = stage.steelTargets;
    }
    updateTotalPoints();
  };

  // Event listeners for adding/removing targets
  window.addPaperTarget = () => updateTargetCount("paper", 1);
  window.removePaperTarget = () => updateTargetCount("paper", -1);
  window.addSteelTarget = () => updateTargetCount("steel", 1);
  window.removeSteelTarget = () => updateTargetCount("steel", -1);

  // Helper to set up increment/decrement buttons
  const setupIncrementDecrement = (minusBtnId, plusBtnId, inputId) => {
    const minusBtn = document.getElementById(minusBtnId);
    const plusBtn = document.getElementById(plusBtnId);
    const input = document.getElementById(inputId);

    if (!minusBtn || !plusBtn || !input) {
      console.error(`Element not found:`, { minusBtnId, plusBtnId, inputId });
      return;
    }

    input.value = input.value || 0;

    minusBtn.addEventListener("click", () => {
      input.value = Math.max(0, parseInt(input.value) - 1);
    });

    plusBtn.addEventListener("click", () => {
      input.value = parseInt(input.value) + 1;
    });
  };

  // Setup increment/decrement for each hit type
  ["alpha", "charlie", "delta", "mike", "steel"].forEach((hitType) =>
    setupIncrementDecrement(
      `${hitType}Minus`,
      `${hitType}Plus`,
      `${hitType}Hits`
    )
  );

  // Function to create buttons
  const createButton = (text, onClick) => {
    const button = document.createElement("button");
    button.classList.add("action-button");
    button.textContent = text;
    button.onclick = onClick;
    return button;
  };

  const addScoreToTable = (shooterName, totalTime, finalResult) => {
    const tableBody = document
      .getElementById("scoreTable")
      .getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow();

    // Inserting cells at the correct indices
    const nameCell = newRow.insertCell(0); // Shooter Name
    const timeCell = newRow.insertCell(1); // Time (seconds)
    const finalResultCell = newRow.insertCell(2); // Final Result
    const statsCell = newRow.insertCell(3); // Show Stats
    const deleteCell = newRow.insertCell(4); // Delete button

    // Store hits as data attributes
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

    // Show Stats button
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

    // Delete button
    const deleteButton = createButton("🗑️ Delete", function () {
      tableBody.removeChild(newRow);
    });
    deleteCell.appendChild(deleteButton);

    // Setting the text content for each cell
    nameCell.textContent = shooterName;
    timeCell.textContent = totalTime;
    finalResultCell.textContent = finalResult.toFixed(2);
  };

  // Function to handle score calculation and validation
  window.calculateScore = () => {
    const alphaHits = parseInt(document.getElementById("alphaHits").value) || 0;
    const charlieHits =
      parseInt(document.getElementById("charlieHits").value) || 0;
    const deltaHits = parseInt(document.getElementById("deltaHits").value) || 0;
    const mikeHits = parseInt(document.getElementById("mikeHits").value) || 0;
    const steelHits = parseInt(document.getElementById("steelHits").value) || 0;
    const totalTime =
      parseFloat(document.getElementById("totalTime").value) || 0;

    // Validation for paper hits
    const maxPaperHits = stage.paperTargets * 2;
    const totalPaperHits = alphaHits + charlieHits + deltaHits;
    if (totalPaperHits > maxPaperHits) {
      alert(
        `Total paper hits (Alpha + Charlie + Delta) cannot exceed ${maxPaperHits}.`
      );
      return;
    }

    // Validation for steel hits
    const maxSteelHits = stage.steelTargets;
    if (steelHits > maxSteelHits) {
      alert(`Total steel hits cannot exceed ${maxSteelHits}.`);
      return;
    }

    // Calculate scores
    const paperScore =
      alphaHits * stage.alpha +
      charlieHits * stage.charlie +
      deltaHits * stage.delta +
      mikeHits * stage.mike;
    const steelScore = steelHits * stage.steel;
    const totalScore = paperScore + steelScore;
    const totalPoints = updateTotalPoints();
    const finalResult = totalScore / totalTime;

    console.log("totalTime: " + totalTime);

    const shooterName =
      document.getElementById("shooterName").value || "Unknown Shooter";
    addScoreToTable(shooterName, totalTime, finalResult);
  };

  // Initialize total points
  updateTotalPoints();
});

// Function to clear current score inputs
window.clearScores = function () {
  // Clear the current score input fields
  const inputFields = document.querySelectorAll("input[type='number']");
  inputFields.forEach((input) => (input.value = 0));

  // Optionally, reset any other fields, like the shooter name
  document.getElementById("shooterName").value = "";

  // If you have any other fields to reset, add them here
};
