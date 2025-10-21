// Stage setup and management

import { Storage } from "./storage.js";
import { UI } from "./uiUtils.js";

export const StageManager = {
  updateMaxPoints() {
    const paperTargets = parseInt(
      document.getElementById("paperTargets").textContent
    );
    const steelTargets = parseInt(
      document.getElementById("steelTargets").textContent
    );
    const maxPoints = paperTargets * 10 + steelTargets * 5;
    document.getElementById("maxPoints").value = maxPoints;
  },

  adjustCounter(counterId, delta) {
    const element = document.getElementById(counterId);
    let value = parseInt(element.textContent) + delta;
    value = Math.max(0, value);
    element.textContent = value;
    this.updateMaxPoints();
  },

  saveStage() {
    const stage = {
      id: Date.now(),
      name: document.getElementById("stageName").value || "Unnamed Stage",
      paperTargets: parseInt(
        document.getElementById("paperTargets").textContent
      ),
      steelTargets: parseInt(
        document.getElementById("steelTargets").textContent
      ),
      notes: document.getElementById("stageNotes").value,
      maxPoints: parseInt(document.getElementById("maxPoints").value),
      created: new Date().toLocaleDateString(),
    };

    Storage.addStage(stage);
    UI.showToast("Stage saved successfully!", "success");
    this.loadStages();
  },

  loadStages() {
    const stages = Storage.getStages();
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
  },

  deleteStage(stageId) {
    UI.showConfirmToast("Are you sure you want to delete this stage?", () => {
      Storage.deleteStage(stageId);
      this.loadStages();
      UI.showToast("Stage deleted successfully", "success");
    });
  },

  editStage(stageId) {
    const stage = Storage.getStageById(stageId);

    if (stage) {
      document.getElementById("stageName").value = stage.name;
      document.getElementById("paperTargets").textContent = stage.paperTargets;
      document.getElementById("steelTargets").textContent = stage.steelTargets;
      document.getElementById("stageNotes").value = stage.notes || "";
      this.updateMaxPoints();

      UI.showScreen("stage-setup");

      window.editingStageId = stageId;
    }
  },

  duplicateStage(stageId) {
    const stage = Storage.getStageById(stageId);

    if (stage) {
      const duplicatedStage = {
        ...stage,
        id: Date.now(),
        name: stage.name + " (Copy)",
        created: new Date().toLocaleDateString(),
      };

      Storage.addStage(duplicatedStage);
      this.loadStages();
      UI.showToast("Stage duplicated successfully!", "success");
    }
  },
};
