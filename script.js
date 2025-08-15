let currentStage = null;
let timerRunning = false;
let timerStart = 0;
let timerInterval = null;
let currentScore = {
  shooter: "",
  time: 0,
  targets: [],
  steel: [],
};

let longPressTimer = null;
let isLongPress = false;

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");

  if (screenId === "stage-library") {
    loadStages();
  } else if (screenId === "results") {
    loadResults();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadStages();
  updateMaxPoints();

  document.addEventListener("input", function (e) {
    if (e.target.id === "shooterTime") {
      updateScorePreview();
    }
  });
});

function adjustCounter(counterId, delta) {
  const element = document.getElementById(counterId);
  let value = parseInt(element.textContent) + delta;
  value = Math.max(0, value);
  element.textContent = value;
  updateMaxPoints();
}

function updateMaxPoints() {
  const paperTargets = parseInt(
    document.getElementById("paperTargets").textContent
  );
  const steelTargets = parseInt(
    document.getElementById("steelTargets").textContent
  );
  const maxPoints = paperTargets * 10 + steelTargets * 5;
  document.getElementById("maxPoints").value = maxPoints;
}

function saveStage() {
  const stage = {
    id: Date.now(),
    name: document.getElementById("stageName").value || "Unnamed Stage",
    paperTargets: parseInt(document.getElementById("paperTargets").textContent),
    steelTargets: parseInt(document.getElementById("steelTargets").textContent),
    notes: document.getElementById("stageNotes").value,
    maxPoints: parseInt(document.getElementById("maxPoints").value),
    created: new Date().toLocaleDateString(),
  };

  let stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  stages.push(stage);
  localStorage.setItem("uspsa_stages", JSON.stringify(stages));

  alert("Stage saved successfully!");
  loadStages();
}

function loadStages() {
  const stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  const stageList = document.getElementById("stageList");

  if (stages.length === 0) {
    stageList.innerHTML =
      "<p>No stages created yet. Create your first stage!</p>";
    return;
  }

  stageList.innerHTML = stages
    .map(
      (stage) => `
        <div class="stage-item">
            <div onclick="selectStage(${stage.id})" style="cursor: pointer; flex-grow: 1;">
                <h4>${stage.name}</h4>
                <p>${stage.paperTargets} Paper, ${stage.steelTargets} Steel | Max: ${stage.maxPoints} pts</p>
                <p>Created: ${stage.created}</p>
            </div>
            <div class="stage-actions">
                <button class="btn" style="min-width: auto; padding: 8px 12px; font-size: 0.8rem;" onclick="selectStage(${stage.id})">
                    <i class="fas fa-play"></i> Score
                </button>
                <button class="btn btn-secondary" style="min-width: auto; padding: 8px 12px; font-size: 0.8rem;" onclick="editStage(${stage.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-secondary" style="min-width: auto; padding: 8px 12px; font-size: 0.8rem;" onclick="duplicateStage(${stage.id})">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn btn-danger" style="min-width: auto; padding: 8px 12px; font-size: 0.8rem;" onclick="deleteStage(${stage.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function selectStage(stageId) {
  const stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  currentStage = stages.find((s) => s.id === stageId);

  if (currentStage) {
    setupScoringScreen();
    showScreen("scoring");
  }
}

function startScoring() {
  currentStage = {
    id: "temp",
    name: document.getElementById("stageName").value || "Unnamed Stage",
    paperTargets: parseInt(document.getElementById("paperTargets").textContent),
    steelTargets: parseInt(document.getElementById("steelTargets").textContent),
    maxPoints: parseInt(document.getElementById("maxPoints").value),
  };

  setupScoringScreen();
  showScreen("scoring");
}

function setupScoringScreen() {
  if (!currentStage) return;

  document.getElementById("currentStageName").textContent = currentStage.name;

  const steelGrid = document.getElementById("steelGrid");
  steelGrid.innerHTML = "";
  currentScore.steel = [];

  for (let i = 0; i < currentStage.steelTargets; i++) {
    const steelBtn = document.createElement("div");
    steelBtn.className = "steel-btn";
    steelBtn.textContent = `S${i + 1}`;
    steelBtn.onclick = () => toggleSteel(i);

    steelBtn.addEventListener("mousedown", (e) =>
      handleLongPressStart(e, () => resetSteel(i))
    );
    steelBtn.addEventListener("touchstart", (e) =>
      handleLongPressStart(e, () => resetSteel(i))
    );
    steelBtn.addEventListener("mouseup", handleLongPressEnd);
    steelBtn.addEventListener("mouseleave", handleLongPressEnd);
    steelBtn.addEventListener("touchend", handleLongPressEnd);
    steelBtn.addEventListener("touchcancel", handleLongPressEnd);

    steelGrid.appendChild(steelBtn);
    currentScore.steel.push(false);
  }

  const targetGrid = document.getElementById("targetGrid");
  targetGrid.innerHTML = "";
  currentScore.targets = [];

  for (let i = 0; i < currentStage.paperTargets; i++) {
    const targetRow = document.createElement("div");
    targetRow.className = "target-row";
    targetRow.innerHTML = `
            <div class="target-header">
                <span class="target-title">Target ${i + 1}</span>
            </div>
            <div class="scoring-buttons">
                <div class="score-column">
                    <button class="score-btn alpha" data-target="${i}" data-score="alpha">
                        <span class="score-label">A</span>
                        <span class="score-count" id="alpha-${i}">0</span>
                    </button>
                </div>
                <div class="score-column">
                    <button class="score-btn charlie" data-target="${i}" data-score="charlie">
                        <span class="score-label">C</span>
                        <span class="score-count" id="charlie-${i}">0</span>
                    </button>
                </div>
                <div class="score-column">
                    <button class="score-btn delta" data-target="${i}" data-score="delta">
                        <span class="score-label">D</span>
                        <span class="score-count" id="delta-${i}">0</span>
                    </button>
                </div>
                <div class="score-column">
                    <button class="score-btn mike" data-target="${i}" data-score="mike">
                        <span class="score-label">M</span>
                        <span class="score-count" id="mike-${i}">0</span>
                    </button>
                </div>
                <div class="score-column">
                    <button class="score-btn noshoot" data-target="${i}" data-score="noshoot">
                        <span class="score-label">NS</span>
                        <span class="score-count" id="noshoot-${i}">0</span>
                    </button>
                </div>
                <div class="score-column">
                    <button class="score-btn npm" data-target="${i}" data-score="npm">
                        <span class="score-label">NPM</span>
                        <span class="score-count" id="npm-${i}">0</span>
                    </button>
                </div>
            </div>
        `;
    targetGrid.appendChild(targetRow);
    currentScore.targets.push({
      alpha: 0,
      charlie: 0,
      delta: 0,
      mike: 0,
      noshoot: 0,
      npm: 0,
    });

    const scoreButtons = targetRow.querySelectorAll(".score-btn");
    scoreButtons.forEach((button) => {
      const targetIndex = parseInt(button.dataset.target);
      const scoreType = button.dataset.score;

      button.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isLongPress) {
          selectScore(targetIndex, scoreType);
        }
      });

      button.addEventListener("mousedown", (e) =>
        handleLongPressStart(e, () => resetScoreButton(targetIndex, scoreType))
      );
      button.addEventListener("touchstart", (e) =>
        handleLongPressStart(e, () => resetScoreButton(targetIndex, scoreType))
      );
      button.addEventListener("mouseup", handleLongPressEnd);
      button.addEventListener("mouseleave", handleLongPressEnd);
      button.addEventListener("touchend", handleLongPressEnd);
      button.addEventListener("touchcancel", handleLongPressEnd);
    });
  }

  resetAllScores();
}

function handleLongPressStart(event, callback) {
  event.preventDefault();
  isLongPress = false;

  longPressTimer = setTimeout(() => {
    isLongPress = true;
    callback();
    event.target.style.transform = "scale(0.9)";
    setTimeout(() => {
      event.target.style.transform = "";
    }, 200);
  }, 500);
}

function handleLongPressEnd(event) {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  setTimeout(() => {
    isLongPress = false;
  }, 50);
}

function resetScoreButton(targetIndex, scoreType) {
  const target = currentScore.targets[targetIndex];
  target[scoreType] = 0;

  const countElement = document.getElementById(`${scoreType}-${targetIndex}`);
  const buttonElement = countElement.closest(".score-btn");

  countElement.textContent = "0";
  buttonElement.classList.remove(
    "hit",
    "penalty",
    "score-btn-hit",
    "minus-score-btn-hit"
  );

  updateScorePreview();
}

function resetSteel(index) {
  currentScore.steel[index] = false;
  const steelBtn = document.querySelectorAll(".steel-btn")[index];
  steelBtn.classList.remove("hit");
  updateScorePreview();
}

function selectScore(targetIndex, scoreType) {
  const target = currentScore.targets[targetIndex];
  const countElement = document.getElementById(`${scoreType}-${targetIndex}`);
  const buttonElement = countElement.closest(".score-btn");

  if (target[scoreType] < 2) {
    target[scoreType]++;

    if (
      scoreType === "alpha" ||
      scoreType === "charlie" ||
      scoreType === "delta"
    ) {
      buttonElement.classList.add("score-btn-hit");
      buttonElement.classList.remove("minus-score-btn-hit");
    } else {
      buttonElement.classList.add("minus-score-btn-hit");
      buttonElement.classList.remove("score-btn-hit");
    }
  } else {
    target[scoreType] = 0;

    buttonElement.classList.remove("score-btn-hit");
    buttonElement.classList.remove("minus-score-btn-hit");
  }

  const { bestHits, totalHits } = calculateBestHits(target);

  const scoringHits =
    target.alpha + target.charlie + target.delta + target.mike;
  if (
    scoringHits > 2 &&
    ["alpha", "charlie", "delta", "mike"].includes(scoreType)
  ) {
    target[scoreType]--;
    alert("Maximum 2 scoring hits per target (A, C, D, M)!");
    return;
  }

  countElement.textContent = target[scoreType];

  updateScorePreview();
}

function calculateBestHits(target) {
  const scoringHits = [];
  for (let i = 0; i < target.alpha; i++)
    scoringHits.push({ type: "alpha", value: 5 });
  for (let i = 0; i < target.charlie; i++)
    scoringHits.push({ type: "charlie", value: 3 });
  for (let i = 0; i < target.delta; i++)
    scoringHits.push({ type: "delta", value: 1 });

  scoringHits.sort((a, b) => b.value - a.value);

  const bestScoringHits = scoringHits.slice(0, 2);

  const penalties = [];

  const totalMikes = target.mike;
  const totalNoShoots = target.noshoot;
  const totalNPMs = target.npm;

  const effectiveNoShoots = Math.min(totalNoShoots, 2 - bestScoringHits.length);
  const effectiveMikes = Math.min(
    totalMikes,
    Math.max(0, 2 - bestScoringHits.length - effectiveNoShoots)
  );

  for (let i = 0; i < effectiveNoShoots; i++)
    penalties.push({ type: "noshoot", value: -10 });
  for (let i = 0; i < effectiveMikes; i++)
    penalties.push({ type: "mike", value: -10 });

  for (let i = 0; i < totalNPMs; i++) penalties.push({ type: "npm", value: 0 });

  return {
    bestHits: [...bestScoringHits, ...penalties],
    totalHits: scoringHits.length + totalMikes + totalNoShoots + totalNPMs,
  };
}

function updateButtonStyling(buttonElement, count, scoreType) {
  buttonElement.classList.remove("hit", "penalty");

  if (count > 0) {
    if (["alpha", "charlie", "delta"].includes(scoreType)) {
      buttonElement.classList.add("hit");
    } else if (["mike", "noshoot", "npm"].includes(scoreType)) {
      buttonElement.classList.add("penalty");
    }
  }
}

function toggleSteel(index) {
  currentScore.steel[index] = !currentScore.steel[index];
  const steelBtn = document.querySelectorAll(".steel-btn")[index];
  steelBtn.classList.toggle("hit");
  updateScorePreview();
}

function updateScorePreview() {
  let totalPoints = 0;

  currentScore.targets.forEach((target) => {
    const { bestHits } = calculateBestHits(target);
    bestHits.forEach((hit) => {
      totalPoints += hit.value;
    });
  });

  currentScore.steel.forEach((hit) => {
    if (hit) totalPoints += 5;
  });

  const timeInput = document.getElementById("shooterTime");
  const time = parseFloat(timeInput.value) || 0;
  currentScore.time = time;

  const hitFactor = time > 0 ? totalPoints / time : 0;

  document.getElementById("pointsPreview").textContent = totalPoints;
  document.getElementById("timePreview").textContent = time.toFixed(2);
  document.getElementById("hitFactorPreview").textContent =
    hitFactor.toFixed(4);
  document.getElementById("resultsPreview").style.display = "block";
}

function clearScore() {
  if (confirm("Clear all scoring data?")) {
    resetAllScores();
    document.getElementById("shooterName").value = "";
    document.getElementById("shooterTime").value = "";

    currentScore.targets.forEach((target, targetIndex) => {
      ["alpha", "charlie", "delta", "mike", "noshoot", "npm"].forEach(
        (scoreType) => {
          const countElement = document.getElementById(
            `${scoreType}-${targetIndex}`
          );
          const buttonElement = countElement.closest(".score-btn");
          countElement.textContent = "0";
          buttonElement.classList.remove(
            "hit",
            "penalty",
            "score-btn-hit",
            "minus-score-btn-hit"
          );
        }
      );
    });

    document.querySelectorAll(".steel-btn.hit").forEach((btn) => {
      btn.classList.remove("hit");
    });

    document.getElementById("resultsPreview").style.display = "none";
  }
}

function resetAllScores() {
  currentScore = {
    shooter: "",
    time: 0,
    targets: [],
    steel: [],
  };

  for (let i = 0; i < currentStage.paperTargets; i++) {
    currentScore.targets.push({
      alpha: 0,
      charlie: 0,
      delta: 0,
      mike: 0,
      noshoot: 0,
      npm: 0,
    });
  }

  for (let i = 0; i < currentStage.steelTargets; i++) {
    currentScore.steel.push(false);
  }
}

function reviewScore() {
  const shooterName = document.getElementById("shooterName").value.trim();
  const timeInput = document.getElementById("shooterTime").value.trim();

  if (!shooterName) {
    alert("Please enter shooter name");
    return;
  }

  if (!timeInput || parseFloat(timeInput) <= 0) {
    alert("Please enter a valid time");
    return;
  }

  let totalAlpha = 0;
  let totalCharlie = 0;
  let totalDelta = 0;
  let totalMike = 0;
  let totalNoshoot = 0;
  let totalNpm = 0;
  let totalPoints = 0;

  currentScore.targets.forEach((target) => {
    totalAlpha += target.alpha;
    totalCharlie += target.charlie;
    totalDelta += target.delta;
    totalMike += target.mike;
    totalNoshoot += target.noshoot;
    totalNpm += target.npm;

    const { bestHits } = calculateBestHits(target);
    bestHits.forEach((hit) => {
      totalPoints += hit.value;
    });
  });

  currentScore.steel.forEach((hit) => {
    if (hit) {
      totalAlpha++;
      totalPoints += 5;
    }
  });

  const time = parseFloat(timeInput);
  const hitFactor = totalPoints / time;

  document.getElementById("reviewStageName").textContent = currentStage.name;
  document.getElementById("reviewShooterName").textContent = shooterName;

  const reviewTableBody = document.getElementById("reviewTableBody");
  reviewTableBody.innerHTML = `
        <tr>
            <td>A Hits</td>
            <td>${totalAlpha}</td>
        </tr>
        <tr>
            <td>C Hits</td>
            <td>${totalCharlie}</td>
        </tr>
        <tr>
            <td>D Hits</td>
            <td>${totalDelta}</td>
        </tr>
        <tr>
            <td>M Hits</td>
            <td>${totalMike}</td>
        </tr>
        <tr>
            <td>NS Hits</td>
            <td>${totalNoshoot}</td>
        </tr>
        <tr>
            <td>NPM</td>
            <td>${totalNpm}</td>
        </tr>
        <tr>
            <td>Time</td>
            <td>${time.toFixed(2)}s</td>
        </tr>
        <tr class="total-row">
            <td>Total Points</td>
            <td>${totalPoints}</td>
        </tr>
        <tr class="hit-factor-row">
            <td>Hit Factor</td>
            <td>${hitFactor.toFixed(4)}</td>
        </tr>
    `;

  showScreen("score-review");
}

function finalSaveScore() {
  const shooterName = document.getElementById("shooterName").value.trim();
  const timeInput = document.getElementById("shooterTime").value.trim();
  const time = parseFloat(timeInput);

  currentScore.time = time;

  let totalPoints = 0;
  let shotsFired = 0;

  currentScore.targets.forEach((target) => {
    const { bestHits, totalHits } = calculateBestHits(target);

    bestHits.forEach((hit) => {
      totalPoints += hit.value;
    });

    shotsFired += totalHits;
  });

  currentScore.steel.forEach((hit) => {
    if (hit) {
      totalPoints += 5;
      shotsFired++;
    }
  });

  const hitFactor = totalPoints / time;

  const scoreRecord = {
    id: Date.now(),
    shooter: shooterName,
    stage: currentStage.name,
    stageId: currentStage.id,
    time: time,
    points: totalPoints,
    hitFactor: hitFactor,
    targets: [...currentScore.targets],
    steel: [...currentScore.steel],
    shotsFired: shotsFired,
    date: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString(),
  };

  let scores = JSON.parse(localStorage.getItem("uspsa_scores") || "[]");
  scores.push(scoreRecord);
  localStorage.setItem("uspsa_scores", JSON.stringify(scores));

  alert(`Score saved! Hit Factor: ${hitFactor.toFixed(4)}`);

  clearScore();
  showScreen("scoring");
}

function exportResults() {
  const scores = JSON.parse(localStorage.getItem("uspsa_scores") || "[]");

  if (scores.length === 0) {
    alert("No scores to export");
    return;
  }

  const headers = [
    "Date",
    "Shooter",
    "Stage",
    "Time",
    "Points",
    "Hit Factor",
    "Shots Fired",
  ];
  const csvContent = [
    headers.join(","),
    ...scores.map((score) =>
      [
        score.date,
        score.shooter,
        score.stage,
        score.time.toFixed(2),
        score.points,
        score.hitFactor.toFixed(4),
        score.shotsFired,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `uspsa_scores_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function loadResults() {
  const scores = JSON.parse(localStorage.getItem("uspsa_scores") || "[]");
  const resultsContent = document.getElementById("resultsContent");

  populateStageFilter(scores);

  if (scores.length === 0) {
    resultsContent.innerHTML =
      "<p>No scores recorded yet. Start scoring to see results here!</p>";
    return;
  }

  const selectedStage = document.getElementById("stageFilter").value;
  let filteredScores = scores;

  if (selectedStage) {
    filteredScores = scores.filter((score) => score.stage === selectedStage);
  }

  if (filteredScores.length === 0) {
    resultsContent.innerHTML = "<p>No scores found for the selected stage.</p>";
    return;
  }

  filteredScores.sort((a, b) => b.hitFactor - a.hitFactor);

  const bestHF = filteredScores[0].hitFactor;
  const avgHF =
    filteredScores.reduce((sum, score) => sum + score.hitFactor, 0) /
    filteredScores.length;
  const bestTime = Math.min(...filteredScores.map((score) => score.time));
  const avgTime =
    filteredScores.reduce((sum, score) => sum + score.time, 0) /
    filteredScores.length;

  const stageTitle = selectedStage
    ? `Results for: ${selectedStage}`
    : "All Stages";

  const resultsHtml = `
        <div class="results-summary">
            <h3>${stageTitle}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <strong>Total Scores:</strong> ${filteredScores.length}
                </div>
                <div class="stat-item">
                    <strong>Best HF:</strong> ${bestHF.toFixed(4)}
                </div>
                <div class="stat-item">
                    <strong>Avg HF:</strong> ${avgHF.toFixed(4)}
                </div>
                <div class="stat-item">
                    <strong>Best Time:</strong> ${bestTime.toFixed(2)}s
                </div>
                <div class="stat-item">
                    <strong>Avg Time:</strong> ${avgTime.toFixed(2)}s
                </div>
            </div>
        </div>
        <div class="stage-list">
            ${filteredScores
              .map(
                (score, index) => `
                <div class="stage-item">
                    <h4>#${index + 1} - ${score.shooter}</h4>
                    <p><strong>HF:</strong> ${score.hitFactor.toFixed(
                      4
                    )} | <strong>Time:</strong> ${score.time.toFixed(
                  2
                )}s | <strong>Points:</strong> ${score.points}</p>
                    <p><strong>Stage:</strong> ${
                      score.stage
                    } | <strong>Date:</strong> ${score.date}</p>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  resultsContent.innerHTML = resultsHtml;
}

function populateStageFilter(scores) {
  const stageFilter = document.getElementById("stageFilter");
  const currentSelection = stageFilter.value;

  const uniqueStages = [...new Set(scores.map((score) => score.stage))].sort();

  stageFilter.innerHTML = '<option value="">All Stages</option>';

  uniqueStages.forEach((stageName) => {
    const option = document.createElement("option");
    option.value = stageName;
    option.textContent = stageName;
    stageFilter.appendChild(option);
  });

  if (currentSelection && uniqueStages.includes(currentSelection)) {
    stageFilter.value = currentSelection;
  }
}

function quickScore() {
  currentStage = {
    id: "quick",
    name: "Quick Stage",
    paperTargets: 6,
    steelTargets: 4,
    maxPoints: 80,
  };

  setupScoringScreen();
  showScreen("scoring");
}

function deleteStage(stageId) {
  if (confirm("Are you sure you want to delete this stage?")) {
    let stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
    stages = stages.filter((stage) => stage.id !== stageId);
    localStorage.setItem("uspsa_stages", JSON.stringify(stages));
    loadStages();
  }
}

function editStage(stageId) {
  const stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  const stage = stages.find((s) => s.id === stageId);

  if (stage) {
    document.getElementById("stageName").value = stage.name;
    document.getElementById("paperTargets").textContent = stage.paperTargets;
    document.getElementById("steelTargets").textContent = stage.steelTargets;
    document.getElementById("stageNotes").value = stage.notes || "";
    updateMaxPoints();

    showScreen("stage-setup");

    window.editingStageId = stageId;
  }
}

function duplicateStage(stageId) {
  const stages = JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  const stage = stages.find((s) => s.id === stageId);

  if (stage) {
    const duplicatedStage = {
      ...stage,
      id: Date.now(),
      name: stage.name + " (Copy)",
      created: new Date().toLocaleDateString(),
    };

    stages.push(duplicatedStage);
    localStorage.setItem("uspsa_stages", JSON.stringify(stages));
    loadStages();
    alert("Stage duplicated successfully!");
  }
}

function clearAllData() {
  if (confirm("This will delete ALL stages and scores. Are you sure?")) {
    localStorage.removeItem("uspsa_stages");
    localStorage.removeItem("uspsa_scores");
    localStorage.removeItem("uspsa_app_initialized");
    alert("All data cleared!");
    location.reload();
  }
}

document.addEventListener("contextmenu", function (e) {
  if (
    e.target.classList.contains("score-btn") ||
    e.target.classList.contains("steel-btn")
  ) {
    e.preventDefault();
  }
});

document.addEventListener("keydown", function (e) {
  if (!document.getElementById("scoring").classList.contains("active")) return;

  if (e.code === "Escape") {
    e.preventDefault();
    clearScore();
  }

  if (
    e.code === "Enter" &&
    document.getElementById("shooterName").value.trim() &&
    document.getElementById("shooterTime").value.trim()
  ) {
    e.preventDefault();
    reviewScore();
  }
});

function initializeApp() {
  const hasRun = localStorage.getItem("uspsa_app_initialized");

  if (!hasRun) {
    const sampleStages = [
      {
        id: Date.now(),
        name: "Sample Stage 1",
        paperTargets: 6,
        steelTargets: 4,
        notes: "Sample stage for testing",
        maxPoints: 80,
        created: new Date().toLocaleDateString(),
      },
    ];

    localStorage.setItem("uspsa_stages", JSON.stringify(sampleStages));
    localStorage.setItem("uspsa_app_initialized", "true");
  }
}

initializeApp();
