// Results display and export

import { Storage } from "./storage.js";
import { UI } from "./uiUtils.js";

export const ResultsManager = {
  loadResults() {
    const scores = Storage.getScores();
    const resultsContent = document.getElementById("resultsContent");

    this.populateStageFilter(scores);

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
      resultsContent.innerHTML =
        "<p>No scores found for the selected stage.</p>";
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
  },

  populateStageFilter(scores) {
    const stageFilter = document.getElementById("stageFilter");
    const currentSelection = stageFilter.value;

    const uniqueStages = [
      ...new Set(scores.map((score) => score.stage)),
    ].sort();

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
  },

  exportResults() {
    const scores = Storage.getScores();

    if (scores.length === 0) {
      UI.showToast("No scores to export", "warning");
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
  },
};
