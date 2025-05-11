const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.classList.add("action-button");
  button.textContent = text;
  button.onclick = onClick;
  return button;
};

document.addEventListener("DOMContentLoaded", function () {
  const stage = {
    major: false,
    paperTargets: 0,
    steelTargets: 0,
    alpha: 5,
    charlie: 3,
    delta: 1,
    mike: -10,
    steel: 5,
    noshoot: -10,
  };

  const updateTotalPoints = () => {
    const totalPaperPoints = stage.paperTargets * 10;
    const totalSteelPoints = stage.steelTargets * stage.steel;
    const totalPoints = totalPaperPoints + totalSteelPoints;
    document.getElementById("totalPoints").textContent = totalPoints;
    return totalPoints;
  };

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

  window.addPaperTarget = () => updateTargetCount("paper", 1);
  window.removePaperTarget = () => updateTargetCount("paper", -1);
  window.addSteelTarget = () => updateTargetCount("steel", 1);
  window.removeSteelTarget = () => updateTargetCount("steel", -1);

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

  ["alpha", "charlie", "delta", "mike", "steel", "noshoot"].forEach((hitType) =>
    setupIncrementDecrement(
      `${hitType}Minus`,
      `${hitType}Plus`,
      `${hitType}Hits`
    )
  );

  const addScoreToTable = (shooterName, totalTime, finalResult) => {
    const savedData = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

    // Create a unique ID for each entry using the current timestamp
    let uniqueID = Date.now();

    const tableBody = document
      .getElementById("scoreTable")
      .getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow();

    const nameCell = newRow.insertCell(0); // Shooter Name
    const timeCell = newRow.insertCell(1); // Time (seconds)
    const finalResultCell = newRow.insertCell(2); // Final Result
    const statsCell = newRow.insertCell(3); // Show Stats
    const deleteCell = newRow.insertCell(4); // Delete button

    // Set additional attributes like hits
    newRow.setAttribute("data-id", uniqueID); // Set unique ID here
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
    newRow.setAttribute(
      "data-noshoot",
      document.getElementById("noshootHits").value || 0
    );

    // Create the "Show Stats" button
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
        )}, Steel: ${newRow.getAttribute(
          "data-steel"
        )}, Noshoot: ${newRow.getAttribute("data-noshoot")}`
      );
    });
    statsCell.appendChild(statsButton);

    // Create the "Delete" button
    const deleteButton = createButton("🗑️ Delete", function () {
      deleteEntry(this);
    });
    deleteCell.appendChild(deleteButton);

    // Set the cells with shooter information
    nameCell.textContent = shooterName;
    timeCell.textContent = totalTime;
    finalResultCell.textContent = finalResult.toFixed(2);

    // Save this new entry to localStorage with the unique ID
    const newEntry = {
      id: uniqueID, // Include unique ID in the saved entry
      name: shooterName,
      time: totalTime,
      hf: finalResult.toFixed(2),
      alpha: newRow.getAttribute("data-alpha"),
      charlie: newRow.getAttribute("data-charlie"),
      delta: newRow.getAttribute("data-delta"),
      steel: newRow.getAttribute("data-steel"),
      mike: newRow.getAttribute("data-mike"),
      noshoot: newRow.getAttribute("data-noshoot"),
    };

    savedData.push(newEntry);
    localStorage.setItem("scoreHistory", JSON.stringify(savedData));
  };

  window.calculateScore = () => {
    const alphaHits = parseInt(document.getElementById("alphaHits").value) || 0;
    const charlieHits =
      parseInt(document.getElementById("charlieHits").value) || 0;
    const deltaHits = parseInt(document.getElementById("deltaHits").value) || 0;
    const mikeHits = parseInt(document.getElementById("mikeHits").value) || 0;
    const steelHits = parseInt(document.getElementById("steelHits").value) || 0;
    const noshootHits =
      parseInt(document.getElementById("noshootHits").value) || 0;
    const totalTime =
      parseFloat(document.getElementById("totalTime").value) || 0;

    const maxPaperHits = stage.paperTargets * 2;
    const totalPaperHits = alphaHits + charlieHits + deltaHits;
    if (totalPaperHits > maxPaperHits) {
      alert(
        `Total paper hits (Alpha + Charlie + Delta) cannot exceed ${maxPaperHits}.`
      );
      return;
    }

    const maxSteelHits = stage.steelTargets;
    if (steelHits > maxSteelHits) {
      alert(`Total steel hits cannot exceed ${maxSteelHits}.`);
      return;
    }

    const paperScore =
      alphaHits * stage.alpha +
      charlieHits * stage.charlie +
      deltaHits * stage.delta +
      mikeHits * stage.mike +
      noshootHits * stage.noshoot;
    const steelScore = steelHits * stage.steel;
    const totalScore = paperScore + steelScore;
    const finalResult = totalScore / totalTime;

    console.log("totalTime: " + totalTime);

    const shooterName =
      document.getElementById("shooterName").value || "Unknown Shooter";
    addScoreToTable(shooterName, totalTime, finalResult);

    saveTableToLocalStorage();
  };

  updateTotalPoints();
});

window.clearScores = function () {
  const inputFields = document.querySelectorAll("input[type='number']");
  inputFields.forEach((input) => (input.value = 0));

  document.getElementById("shooterName").value = "";
};

function addRow(
  shooterName,
  time,
  alpha,
  charlie,
  delta,
  mike,
  steel,
  noshoot,
  hf
) {
  const table = document
    .getElementById("scoreTable")
    .getElementsByTagName("tbody")[0];

  const newRow = table.insertRow();
  const uniqueID = Date.now(); // Generate a unique ID for this row
  newRow.setAttribute("data-id", uniqueID); // Assign the unique ID to the row
  newRow.setAttribute("data-alpha", alpha);
  newRow.setAttribute("data-charlie", charlie);
  newRow.setAttribute("data-delta", delta);
  newRow.setAttribute("data-mike", mike);
  newRow.setAttribute("data-steel", steel);
  newRow.setAttribute("data-noshoot", noshoot);

  const shooterNameCell = newRow.insertCell(0);
  shooterNameCell.textContent = shooterName;

  const timeCell = newRow.insertCell(1);
  timeCell.textContent = time;

  const hfCell = newRow.insertCell(2);
  hfCell.textContent = hf;

  const statsCell = newRow.insertCell(3);
  const statsButton = createButton("Show Stats", function () {
    alert(
      `Alpha: ${alpha}, Charlie: ${charlie}, Delta: ${delta}, Mike: ${mike}, Steel: ${steel}, Noshoot: ${noshoot}`
    );
  });
  statsCell.appendChild(statsButton);

  const deleteCell = newRow.insertCell(4);
  const deleteButton = createButton("Delete", function () {
    deleteEntry(this);
  });
  deleteCell.appendChild(deleteButton);

  saveTableToLocalStorage();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const table = document.getElementById("scoreTable");
  const rows = table.getElementsByTagName("tr");

  doc.setFontSize(10);

  doc.setFont("Arial", "bold");
  doc.text(
    "USPSA HF Stage Score(s) - " + new Date(Date.now()).toString(),
    14,
    20
  );
  doc.setFont("Arial", "normal");

  const headers = [
    "Name",
    "Time",
    "HF",
    "Alpha",
    "Charlie",
    "Delta",
    "Steel",
    "Mikes",
    "Noshoots",
  ];
  let yPos = 30;
  const cellWidth = 20;

  doc.setFont("Arial", "bold");
  headers.forEach((header, index) => {
    const xPos =
      14 + index * cellWidth + cellWidth / 2 - doc.getTextWidth(header) / 2;
    doc.text(header, xPos - 1, yPos - 0.5);
    doc.rect(14 + index * cellWidth - 1, yPos - 5, cellWidth, 6);
  });
  doc.setFont("Arial", "normal");

  yPos += 6;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let rowData = [];

    rowData.push(cells[0].innerText); // Shooter Name
    rowData.push(cells[1].innerText); // Time (seconds)
    rowData.push(cells[2].innerText); // HF
    rowData.push(rows[i].getAttribute("data-alpha")); // Alpha
    rowData.push(rows[i].getAttribute("data-charlie")); // Charlie
    rowData.push(rows[i].getAttribute("data-delta")); // Delta
    rowData.push(rows[i].getAttribute("data-steel")); // Steel
    rowData.push(rows[i].getAttribute("data-mike")); // Mikes
    rowData.push(rows[i].getAttribute("data-noshoot")); // Noshoots

    rowData.forEach((text, index) => {
      const xPos =
        14 + index * cellWidth + cellWidth / 2 - doc.getTextWidth(text) / 2;
      doc.text(text, xPos - 1, yPos - 0.5);
      doc.rect(14 + index * cellWidth - 1, yPos - 5, cellWidth, 6);
    });

    yPos += 6;
  }

  doc.save("USPSA_Scores" + Date.now() + ".pdf");
}

document.getElementById("downloadPDF").addEventListener("click", generatePDF);

function saveTableToLocalStorage() {
  const table = document.getElementById("scoreTable");
  const rows = table.querySelectorAll("tbody tr");
  const data = [];

  rows.forEach((row) => {
    data.push({
      id: row.getAttribute("data-id"),
      name: row.cells[0].innerText,
      time: row.cells[1].innerText,
      hf: row.cells[2].innerText,
      alpha: row.getAttribute("data-alpha"),
      charlie: row.getAttribute("data-charlie"),
      delta: row.getAttribute("data-delta"),
      steel: row.getAttribute("data-steel"),
      mike: row.getAttribute("data-mike"),
      noshoot: row.getAttribute("data-noshoot"),
    });
  });

  localStorage.setItem("scoreHistory", JSON.stringify(data));
}

function loadTableFromLocalStorage() {
  const savedData = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

  const tableBody = document.querySelector("#scoreTable tbody");
  tableBody.innerHTML = "";

  savedData.forEach((entry) => {
    const newRow = document.createElement("tr");

    newRow.setAttribute("data-id", entry.id);
    newRow.setAttribute("data-alpha", entry.alpha);
    newRow.setAttribute("data-charlie", entry.charlie);
    newRow.setAttribute("data-delta", entry.delta);
    newRow.setAttribute("data-steel", entry.steel);
    newRow.setAttribute("data-mike", entry.mike);
    newRow.setAttribute("data-noshoot", entry.noshoot);

    const nameCell = newRow.insertCell(0);
    nameCell.textContent = entry.name;

    const timeCell = newRow.insertCell(1);
    timeCell.textContent = entry.time;

    const hfCell = newRow.insertCell(2);
    hfCell.textContent = entry.hf;

    const statsCell = newRow.insertCell(3);
    statsCell.appendChild(
      createButton("Show", function () {
        showStats(this);
      })
    );

    const deleteCell = newRow.insertCell(4);
    deleteCell.appendChild(
      createButton("Delete", function () {
        deleteEntry(this);
      })
    );

    tableBody.appendChild(newRow);
  });
}

function deleteEntry(button) {
  const row = button.closest("tr");
  const rowId = row.getAttribute("data-id");

  row.remove();

  const savedData = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  const updatedData = savedData.filter(
    (entry) => entry.id.toString() !== rowId
  );
  localStorage.setItem("scoreHistory", JSON.stringify(updatedData));
}

function showStats(button) {
  const row = button.closest("tr");
  alert(
    `Alpha: ${row.getAttribute("data-alpha")}, Charlie: ${row.getAttribute(
      "data-charlie"
    )}, Delta: ${row.getAttribute("data-delta")}, Mike: ${row.getAttribute(
      "data-mike"
    )}, Steel: ${row.getAttribute("data-steel")}, Noshoot: ${row.getAttribute(
      "data-noshoot"
    )}`
  );
}

let sortDirection = {
  1: "asc", // Time
  2: "asc", // HF
};

function sortTable(colIndex) {
  const table = document.getElementById("scoreTable");
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // Determine sort direction
  const direction = sortDirection[colIndex] === "asc" ? 1 : -1;

  // Sort the rows
  rows.sort((a, b) => {
    const aValue = parseFloat(a.cells[colIndex].textContent) || 0;
    const bValue = parseFloat(b.cells[colIndex].textContent) || 0;
    return direction * (aValue - bValue);
  });

  // Replace rows
  tbody.replaceChildren(...rows);

  // Toggle the direction
  sortDirection[colIndex] = sortDirection[colIndex] === "asc" ? "desc" : "asc";

  // Update arrows for all sortable columns
  updateSortArrows();
}

function updateSortArrows() {
  const timeArrow = document.getElementById("timeArrow");
  const hfArrow = document.getElementById("hfArrow");

  timeArrow.textContent = sortDirection[1] === "asc" ? "▲" : "▼";
  hfArrow.textContent = sortDirection[2] === "asc" ? "▲" : "▼";
}

window.addEventListener("DOMContentLoaded", loadTableFromLocalStorage);
