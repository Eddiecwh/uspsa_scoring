// localStorage operations

export const Storage = {
  getStages() {
    return JSON.parse(localStorage.getItem("uspsa_stages") || "[]");
  },

  saveStages(stages) {
    localStorage.setItem("uspsa_stages", JSON.stringify(stages));
  },

  addStage(stage) {
    const stages = this.getStages();
    stages.push(stage);
    this.saveStages(stages);
  },

  updateStage(stageId, updatedStage) {
    let stages = this.getStages();
    const index = stages.findIndex((s) => s.id === stageId);
    if (index !== -1) {
      stages[index] = updatedStage;
      this.saveStages(stages);
    }
  },

  deleteStage(stageId) {
    let stages = this.getStages();
    stages = stages.filter((stage) => stage.id !== stageId);
    this.saveStages(stages);
  },

  getStageById(stageId) {
    const stages = this.getStages();
    return stages.find((s) => s.id === stageId);
  },

  getScores() {
    return JSON.parse(localStorage.getItem("uspsa_scores") || "[]");
  },

  saveScores(scores) {
    localStorage.setItem("uspsa_scores", JSON.stringify(scores));
  },

  addScore(score) {
    const scores = this.getScores();
    scores.push(score);
    this.saveScores(scores);
  },

  isInitialized() {
    return localStorage.getItem("uspsa_app_initialized") === "true";
  },

  setInitialized() {
    localStorage.setItem("uspsa_app_initialized", "true");
  },

  clearAll() {
    localStorage.removeItem("uspsa_stages");
    localStorage.removeItem("uspsa_scores");
    localStorage.removeItem("uspsa_app_initialized");
  },
};
