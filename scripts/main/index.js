import { chatrank } from "./misc/chat.js";
import { world, system, Player } from "@minecraft/server";
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
      world.sendMessage(`§l§p🍀 The map has been loaded for the first time and may experince issues!`);
      worldLoaded = true;

      // Create scoreboard objective if it doesn't exist yet
      try {
        world.scoreboard.addObjective("chatsSent");
      } catch (e) {
        // Do nothing, just add it!
      }
    }
  }

  // Call timer() once per second (20 ticks)
  if (system.currentTick % 20 === 0) {
    timer();
  }
}, 1);


world.afterEvents.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
    if (!initialSpawn) return
    world.sendMessage(`§lwelcome new person ><`);
})

/* world.afterEvents.playerDeath.subscribe((event) => {
  const player = event.player;
  
  player.runCommand("function death");
});

/* world.afterEvents.playerKilled.subscribe((event) => {
  const player = event.player;
  
  player.runCommand("function killed");
}); */

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
  let itemType = event.itemStack.typeId

    if (itemType === "minecraft:stick" 
 || itemType === "minecraft:diamond"
 || itemType === "minecraft:apple") {
    world.runCommand("say hate");
    }
}) 





