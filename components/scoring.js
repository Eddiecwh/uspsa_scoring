// Scoring calculations

export const Scoring = {
  calculateBestHits(target) {
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

    // Noshoots always count for full penalty
    for (let i = 0; i < totalNoShoots; i++)
      penalties.push({ type: "noshoot", value: -10 });

    // Mikes only count if there aren't 2 scoring hits
    const effectiveMikes = Math.min(
      totalMikes,
      Math.max(0, 2 - bestScoringHits.length)
    );

    for (let i = 0; i < effectiveMikes; i++)
      penalties.push({ type: "mike", value: -10 });

    for (let i = 0; i < totalNPMs; i++)
      penalties.push({ type: "npm", value: 0 });

    return {
      bestHits: [...bestScoringHits, ...penalties],
      totalHits: scoringHits.length + totalMikes + totalNoShoots + totalNPMs,
    };
  },

  calculateTotalPoints(targets, steel) {
    let totalPoints = 0;

    targets.forEach((target) => {
      const { bestHits } = this.calculateBestHits(target);
      bestHits.forEach((hit) => {
        totalPoints += hit.value;
      });
    });

    steel.forEach((hit) => {
      if (hit) totalPoints += 5;
    });

    return totalPoints;
  },

  calculateHitFactor(points, time) {
    return time > 0 ? points / time : 0;
  },

  validateTargetScored(target) {
    const totalHits =
      target.alpha +
      target.charlie +
      target.delta +
      target.mike +
      target.noshoot +
      target.npm;
    return totalHits >= 2;
  },

  validateAllTargetsScored(targets) {
    for (let i = 0; i < targets.length; i++) {
      if (!this.validateTargetScored(targets[i])) {
        return { valid: false, targetIndex: i };
      }
    }
    return { valid: true };
  },

  calculateShotsFired(targets, steel) {
    let shotsFired = 0;

    targets.forEach((target) => {
      const { totalHits } = this.calculateBestHits(target);
      shotsFired += totalHits;
    });

    steel.forEach((hit) => {
      if (hit) shotsFired++;
    });

    return shotsFired;
  },

  createScoreRecord(shooter, stage, currentScore) {
    const totalPoints = this.calculateTotalPoints(
      currentScore.targets,
      currentScore.steel
    );
    const hitFactor = this.calculateHitFactor(totalPoints, currentScore.time);
    const shotsFired = this.calculateShotsFired(
      currentScore.targets,
      currentScore.steel
    );

    return {
      id: Date.now(),
      shooter: shooter,
      stage: stage.name,
      stageId: stage.id,
      time: currentScore.time,
      points: totalPoints,
      hitFactor: hitFactor,
      targets: [...currentScore.targets],
      steel: [...currentScore.steel],
      shotsFired: shotsFired,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    };
  },
};
