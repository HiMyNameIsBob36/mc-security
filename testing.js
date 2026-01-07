import { world } from "@minecraft/server";

world.beforeEvents.playerInteractWithItem.subscribe((event) => {
    const player = event.player;

    if (item?.typeId === "minecraft:stick") {
        player.sendMessage("You used a stick!");
    }
});
