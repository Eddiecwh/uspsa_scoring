// Handles the scoring screen UI and interactions

import { Scoring } from "./scoring.js";
import { UI } from "./uiUtils.js";

let longPressTimer = null;
let isLongPress = false;

export const ScoringScreen = {
  setup(stage, currentScore) {
    if (!stage) return;

    document.getElementById("currentStageName").textContent = stage.name;

    this.setupSteelTargets(stage, currentScore);
    this.setupPaperTargets(stage, currentScore);
    this.resetScore(stage, currentScore);
  },

  setupSteelTargets(stage, currentScore) {
    const steelGrid = document.getElementById("steelGrid");
    steelGrid.innerHTML = "";
    currentScore.steel = [];

    for (let i = 0; i < stage.steelTargets; i++) {
      const steelBtn = document.createElement("div");
      steelBtn.className = "steel-btn";
      steelBtn.textContent = `S${i + 1}`;

      this.attachSteelEventListeners(steelBtn, i, currentScore);

      steelGrid.appendChild(steelBtn);
      currentScore.steel.push(false);
    }
  },

  attachSteelEventListeners(steelBtn, index, currentScore) {
    let touchStartTime = 0;
    let touchMoved = false;

    steelBtn.addEventListener("touchstart", (e) => {
      touchStartTime = Date.now();
      touchMoved = false;
      this.handleLongPressStart(e, () => this.resetSteel(index, currentScore));
    });

    steelBtn.addEventListener("touchmove", (e) => {
      touchMoved = true;
    });

    steelBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.handleLongPressEnd(e);

      if (!touchMoved && !isLongPress) {
        this.toggleSteel(index, currentScore);
      }
    });

    steelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isLongPress) {
        this.toggleSteel(index, currentScore);
      }
    });

    steelBtn.addEventListener("mousedown", (e) =>
      this.handleLongPressStart(e, () => this.resetSteel(index, currentScore))
    );
    steelBtn.addEventListener("mouseup", (e) => this.handleLongPressEnd(e));
    steelBtn.addEventListener("mouseleave", (e) => this.handleLongPressEnd(e));
    steelBtn.addEventListener("touchcancel", (e) => this.handleLongPressEnd(e));
  },

  setupPaperTargets(stage, currentScore) {
    const targetGrid = document.getElementById("targetGrid");
    targetGrid.innerHTML = "";
    currentScore.targets = [];

    for (let i = 0; i < stage.paperTargets; i++) {
      const targetRow = this.createTargetRow(i, currentScore);
      targetGrid.appendChild(targetRow);

      currentScore.targets.push({
        alpha: 0,
        charlie: 0,
        delta: 0,
        mike: 0,
        noshoot: 0,
        npm: 0,
      });
    }
  },

  createTargetRow(targetIndex, currentScore) {
    const targetRow = document.createElement("div");
    targetRow.className = "target-row target-unscored";
    targetRow.innerHTML = `
      <div class="target-header">
          <span class="target-title">Target ${targetIndex + 1}</span>
      </div>
      <div class="scoring-buttons">
          <div class="score-column">
              <button class="score-btn alpha" data-target="${targetIndex}" data-score="alpha">
                  <span class="score-label">A</span>
                  <span class="score-count" id="alpha-${targetIndex}">0</span>
              </button>
          </div>
          <div class="score-column">
              <button class="score-btn charlie" data-target="${targetIndex}" data-score="charlie">
                  <span class="score-label">C</span>
                  <span class="score-count" id="charlie-${targetIndex}">0</span>
              </button>
          </div>
          <div class="score-column">
              <button class="score-btn delta" data-target="${targetIndex}" data-score="delta">
                  <span class="score-label">D</span>
                  <span class="score-count" id="delta-${targetIndex}">0</span>
              </button>
          </div>
          <div class="score-column">
              <button class="score-btn mike" data-target="${targetIndex}" data-score="mike">
                  <span class="score-label">M</span>
                  <span class="score-count" id="mike-${targetIndex}">0</span>
              </button>
          </div>
          <div class="score-column">
              <button class="score-btn noshoot" data-target="${targetIndex}" data-score="noshoot">
                  <span class="score-label">NS</span>
                  <span class="score-count" id="noshoot-${targetIndex}">0</span>
              </button>
          </div>
          <div class="score-column">
              <button class="score-btn npm" data-target="${targetIndex}" data-score="npm">
                  <span class="score-label">NPM</span>
                  <span class="score-count" id="npm-${targetIndex}">0</span>
              </button>
          </div>
      </div>
    `;

    this.attachScoreButtonListeners(targetRow, targetIndex, currentScore);
    return targetRow;
  },

  attachScoreButtonListeners(targetRow, targetIndex, currentScore) {
    const scoreButtons = targetRow.querySelectorAll(".score-btn");
    scoreButtons.forEach((button) => {
      const scoreType = button.dataset.score;

      let touchStartTime = 0;
      let touchMoved = false;

      button.addEventListener("touchstart", (e) => {
        touchStartTime = Date.now();
        touchMoved = false;
        this.handleLongPressStart(e, () =>
          this.resetScoreButton(targetIndex, scoreType, currentScore)
        );
      });

      button.addEventListener("touchmove", (e) => {
        touchMoved = true;
      });

      button.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.handleLongPressEnd(e);

        if (!touchMoved && !isLongPress) {
          this.selectScore(targetIndex, scoreType, currentScore);
        }
      });

      button.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isLongPress) {
          this.selectScore(targetIndex, scoreType, currentScore);
        }
      });

      button.addEventListener("mousedown", (e) =>
        this.handleLongPressStart(e, () =>
          this.resetScoreButton(targetIndex, scoreType, currentScore)
        )
      );
      button.addEventListener("mouseup", (e) => this.handleLongPressEnd(e));
      button.addEventListener("mouseleave", (e) => this.handleLongPressEnd(e));
      button.addEventListener("touchcancel", (e) => this.handleLongPressEnd(e));
    });
  },

  handleLongPressStart(event, callback) {
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
  },

  handleLongPressEnd(event) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    setTimeout(() => {
      isLongPress = false;
    }, 150);
  },

  selectScore(targetIndex, scoreType, currentScore) {
    const target = currentScore.targets[targetIndex];
    const countElement = document.getElementById(`${scoreType}-${targetIndex}`);
    const buttonElement = countElement.closest(".score-btn");

    if (target[scoreType] < 2) {
      target[scoreType]++;

      if (["alpha", "charlie", "delta"].includes(scoreType)) {
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

    const scoringHits =
      target.alpha + target.charlie + target.delta + target.mike;
    if (
      scoringHits > 2 &&
      ["alpha", "charlie", "delta", "mike"].includes(scoreType)
    ) {
      target[scoreType]--;
      UI.showToast(
        "Maximum 2 scoring hits per target (A, C, D, M)!",
        "warning"
      );
      return;
    }

    countElement.textContent = target[scoreType];
    this.updatePreview(currentScore);
  },

  resetScoreButton(targetIndex, scoreType, currentScore) {
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

    this.updatePreview(currentScore);
  },

  toggleSteel(index, currentScore) {
    currentScore.steel[index] = !currentScore.steel[index];
    const steelBtn = document.querySelectorAll(".steel-btn")[index];
    steelBtn.classList.toggle("hit");
    this.updatePreview(currentScore);
  },

  resetSteel(index, currentScore) {
    currentScore.steel[index] = false;
    const steelBtn = document.querySelectorAll(".steel-btn")[index];
    steelBtn.classList.remove("hit");
    this.updatePreview(currentScore);
  },

  updatePreview(currentScore) {
    const totalPoints = Scoring.calculateTotalPoints(
      currentScore.targets,
      currentScore.steel
    );

    currentScore.targets.forEach((target, index) => {
      const targetRow = document
        .querySelector(`[data-target="${index}"]`)
        ?.closest(".target-row");
      if (targetRow) {
        if (Scoring.validateTargetScored(target)) {
          targetRow.classList.add("target-scored");
          targetRow.classList.remove("target-unscored");
        } else {
          targetRow.classList.add("target-unscored");
          targetRow.classList.remove("target-scored");
        }
      }
    });

    const timeInput = document.getElementById("shooterTime");
    const time = parseFloat(timeInput.value) || 0;
    currentScore.time = time;

    const hitFactor = Scoring.calculateHitFactor(totalPoints, time);

    document.getElementById("pointsPreview").textContent = totalPoints;
    document.getElementById("timePreview").textContent = time.toFixed(2);
    document.getElementById("hitFactorPreview").textContent =
      hitFactor.toFixed(4);
    document.getElementById("resultsPreview").style.display = "block";
  },

  resetScore(stage, currentScore) {
    currentScore.shooter = "";
    currentScore.time = 0;
    currentScore.targets = [];
    currentScore.steel = [];

    document.getElementById("shooterName").value = "";
    document.getElementById("shooterTime").value = "";

    for (let i = 0; i < stage.paperTargets; i++) {
      currentScore.targets.push({
        alpha: 0,
        charlie: 0,
        delta: 0,
        mike: 0,
        noshoot: 0,
        npm: 0,
      });

      ["alpha", "charlie", "delta", "mike", "noshoot", "npm"].forEach(
        (scoreType) => {
          const countElement = document.getElementById(`${scoreType}-${i}`);
          if (countElement) {
            const buttonElement = countElement.closest(".score-btn");
            countElement.textContent = "0";
            buttonElement?.classList.remove(
              "hit",
              "penalty",
              "score-btn-hit",
              "minus-score-btn-hit"
            );
          }
        }
      );
    }

    for (let i = 0; i < stage.steelTargets; i++) {
      currentScore.steel.push(false);
    }

    document.querySelectorAll(".steel-btn.hit").forEach((btn) => {
      btn.classList.remove("hit");
    });

    document.getElementById("resultsPreview").style.display = "none";
  },

  showReview(stage, currentScore, shooterName) {
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

      const { bestHits } = Scoring.calculateBestHits(target);
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

    const time = currentScore.time;
    const hitFactor = Scoring.calculateHitFactor(totalPoints, time);

    document.getElementById("reviewStageName").textContent = stage.name;
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
  },
}; // scoringScreen.js - Handles the scoring screen UI and interactions
