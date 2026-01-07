import { chatrank } from "./misc/chat.js";
import { world, system } from "@minecraft/server";
import { timer } from "./misc/second.js";

let tick = 0;
let worldLoaded = false;

// Handle chat messages
world.beforeEvents.chatSend.subscribe((event) => {
  chatrank(event);
});

// Run every tick
system.runInterval(() => {
  tick++;

  // Detect first time at least one player is in the world
  if (!worldLoaded) {
    const players = world.getPlayers();

    if (players.length > 0) {
      world.sendMessage(`World has loaded in ${tick} ticks`);
      worldLoaded = true;

      // Create scoreboard objective if it doesn't exist yet
      try {
        world.scoreboard.addObjective("chatsSent", "chatsSent");
      } catch (e) {
        // Ignore error if the objective already exists
      }
    }
  }

  // Call timer() once per second (20 ticks)
  if (system.currentTick % 20 === 0) {
    timer();
  }
}, 1);
