import { world } from "@minecraft/server";

let seconds = 0;
const CHAT_OBJECTIVE = "chatsSent";

export function timer() {
  seconds++;

  if (seconds >= 3) {
    try {
      const objective = world.scoreboard.getObjective(CHAT_OBJECTIVE);
      if (objective) {
        // Reset score for everyone tracked in this objective
        for (const participant of objective.getParticipants()) {
          objective.setScore(participant, 0);
        }
      }
    } catch (e) {
      // Ignore errors to keep script alive
    }

    seconds = 0;
  }

  return seconds;
}

