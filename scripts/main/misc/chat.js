import { world, system } from "@minecraft/server";

const messages = new Map();
const CHAT_OBJECTIVE = "chatsSent";
const CHAT_LIMIT = 3;

function getChatsObjective() {
  let objective = world.scoreboard.getObjective(CHAT_OBJECTIVE);
  if (!objective) {
    try {
      objective = world.scoreboard.addObjective(CHAT_OBJECTIVE, CHAT_OBJECTIVE);
    } catch (e) {
      // If another script just created it, get it again
      objective = world.scoreboard.getObjective(CHAT_OBJECTIVE);
    }
  }
  return objective;
}

/**
 * @param {import("@minecraft/server").ChatSendBeforeEvent} data
 */
export function chatrank(data) {
  const tags = data.sender.getTags();
  const objective = getChatsObjective();
  let score = 0;

  // Safely get current chat count
  try {
    score = objective.getScore(data.sender.scoreboardIdentity);
  } catch (e) {
    score = 0;
  }

  // Get ranks from tags
  let ranks = tags
    .filter((tag) => tag.startsWith("nick:"))
    .map((tag) => tag.replace("nick:", ""));

  if (!ranks.length) {
    ranks = ["${data.sender.nameTag}"];
  }

  // Too fast?
  if (score >= CHAT_LIMIT) {
    data.cancel = true;
    data.sender.sendMessage("§l§4Hey! You're sending messages too quickly!");
    return;
  }

  // Exact same message spam?
  const lastMessage = messages.get(data.sender.name);
  if (lastMessage === data.message) {
    data.cancel = true;
    data.sender.sendMessage("§l§cPlease do not spam chat!");
    return;
  }

  const formatted = `<${ranks.join}> §f${data.message}`;

  // Broadcast formatted message
  world.sendMessage(formatted);

  // Store last message and cancel original
  messages.set(data.sender.name, data.message);
  data.cancel = true;

  // Increment chatsSent safely on next tick
  const runId = system.run(() => {
    try {
      const obj = getChatsObjective();
      obj.addScore(data.sender, 1);
    } catch (e) {
      // Ignore scoreboard errors
    } finally {
      system.clearRun(runId);
    }
  });
}







