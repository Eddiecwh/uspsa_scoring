// app.js - Main application controller

import { Storage } from "./components/storage.js";
import { Scoring } from "./components/scoring.js";
import { UI } from "./components/uiUtils.js";
import { StageManager } from "./components/stageManager.js";
import { ResultsManager } from "./components/resultsManager.js";
import { ScoringScreen } from "./components/scoringScreen.js";

let currentStage = null;
let currentScore = {
  shooter: "",
  time: 0,
  targets: [],
  steel: [],
};

function initializeApp() {
  if (!Storage.isInitialized()) {
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
    Storage.saveStages(sampleStages);
    Storage.setInitialized();
  }
}

window.showScreen = function (screenId) {
  UI.showScreen(screenId);

  if (screenId === "stage-library") {
    StageManager.loadStages();
  } else if (screenId === "results") {
    ResultsManager.loadResults();
  }
};

window.adjustCounter = (counterId, delta) =>
  StageManager.adjustCounter(counterId, delta);
window.saveStage = () => StageManager.saveStage();
window.deleteStage = (stageId) => StageManager.deleteStage(stageId);
window.editStage = (stageId) => StageManager.editStage(stageId);
window.duplicateStage = (stageId) => StageManager.duplicateStage(stageId);

window.selectStage = function (stageId) {
  currentStage = Storage.getStageById(stageId);
  if (currentStage) {
    ScoringScreen.setup(currentStage, currentScore);
    showScreen("scoring");
  }
};

window.startScoring = function () {
  currentStage = {
    id: "temp",
    name: document.getElementById("stageName").value || "Unnamed Stage",
    paperTargets: parseInt(document.getElementById("paperTargets").textContent),
    steelTargets: parseInt(document.getElementById("steelTargets").textContent),
    maxPoints: parseInt(document.getElementById("maxPoints").value),
  };

  ScoringScreen.setup(currentStage, currentScore);
  showScreen("scoring");
};

window.quickScore = function () {
  currentStage = {
    id: "quick",
    name: "Quick Stage",
    paperTargets: 6,
    steelTargets: 4,
    maxPoints: 80,
  };

  ScoringScreen.setup(currentStage, currentScore);
  showScreen("scoring");
};

window.clearScore = function () {
  UI.showConfirmToast("Clear all scoring data?", () => {
    ScoringScreen.resetScore(currentStage, currentScore);
    UI.showToast("Scoring data cleared", "info");
  });
};

window.reviewScore = function () {
  const shooterName = document.getElementById("shooterName").value.trim();
  const timeInput = document.getElementById("shooterTime").value.trim();

  if (!shooterName) {
    UI.showToast("Please enter shooter name", "warning");
    return;
  }

  if (!timeInput || parseFloat(timeInput) <= 0) {
    UI.showToast("Please enter a valid time", "warning");
    return;
  }

  const validation = Scoring.validateAllTargetsScored(currentScore.targets);
  if (!validation.valid) {
    UI.showToast(
      `Target ${
        validation.targetIndex + 1
      } needs at least 2 hits. Please score all targets with minimum 2 hits before proceeding.`,
      "warning",
      5000
    );
    return;
  }

  ScoringScreen.showReview(currentStage, currentScore, shooterName);
  showScreen("score-review");
};

window.finalSaveScore = function () {
  const shooterName = document.getElementById("shooterName").value.trim();

  const validation = Scoring.validateAllTargetsScored(currentScore.targets);
  if (!validation.valid) {
    return;
  }

  const scoreRecord = Scoring.createScoreRecord(
    shooterName,
    currentStage,
    currentScore
  );
  Storage.addScore(scoreRecord);

  UI.showToast(
    `Score saved! Hit Factor: ${scoreRecord.hitFactor.toFixed(4)}`,
    "success"
  );

  clearScore();
  showScreen("scoring");
};

window.loadResults = () => ResultsManager.loadResults();
window.exportResults = () => ResultsManager.exportResults();

window.clearAllData = function () {
  UI.showConfirmToast(
    "This will delete ALL stages and scores. Are you sure?",
    () => {
      Storage.clearAll();
      UI.showToast("All data cleared!", "success");
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  );
};

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  StageManager.loadStages();
  StageManager.updateMaxPoints();

  document.addEventListener("input", function (e) {
    if (e.target.id === "shooterTime") {
      ScoringScreen.updatePreview(currentScore);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!document.getElementById("scoring").classList.contains("active"))
      return;

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

  document.addEventListener("contextmenu", function (e) {
    if (
      e.target.classList.contains("score-btn") ||
      e.target.classList.contains("steel-btn")
    ) {
      e.preventDefault();
    }
  });
});

export { currentScore, currentStage };
