import * as ui from "@minecraft/server-ui";
import { world, system} from "@minecraft/server"
export function camera() {

    let camui = new ui.ActionFormData()
    camui.title("Painél")
    camui.button("Posicionar Câmera")
    camui.button("Câmera Seguir")
    camui.button("Limpar Câmera")
    world.beforeEvents.itemUse.subscribe(eventData => {
        if (eventData.itemStack?.typeId === 'cam:cam') {
            let player = eventData.source
            system.run(() => {
                camui.show(player).then(result => {
                    if (result.selection == 0) {
                        player.runCommandAsync("camera @s clear")
                        player.runCommandAsync("tag @s remove camfollow")
                        player.runCommandAsync("tag @s add camposit")
                        player.runCommandAsync("camera @s set minecraft:free pos ^ ^1.5 ^ rot ~ ~")
                        player.runCommandAsync('playsound random.levelup @s')
                        player.runCommandAsync('tellraw @s {"rawtext":[{"text":"§6§l[Kcam]§r§7 -§a Câmera posicionada."}]}')
                    }
                    if (result.selection == 1) {
                        player.runCommandAsync('tellraw @s[tag=camfollow] {"rawtext":[{"text":"§6§l[Kcam]§r§7 -§c A câmera já está te seguindo."}]}')
                        player.runCommandAsync('playsound note.bass @s[tag=camfollow]')
                        player.runCommandAsync('playsound random.levelup @s[tag=!camfollow]')
                        player.runCommandAsync('tellraw @s[tag=!camfollow] {"rawtext":[{"text":"§6§l[Kcam]§r§7 -§a A câmera está te seguindo."}]}')
                        player.runCommandAsync("tag @s add camfollow")


                    }
                    if (result.selection == 2) {
                        if (player.hasTag("camposit") || player.hasTag("camfollow")) {
                            player.runCommandAsync('camera @s clear')
                            player.runCommandAsync('tellraw @s {"rawtext":[{"text":"§6§l[Kcam]§r§7 -§a Câmera removida."}]}')
                            player.runCommandAsync('playsound random.levelup @s')
                            player.runCommandAsync("tag @s remove camfollow")
                            player.runCommandAsync('tag @s remove camposit')
                        }
                        else {
                            player.runCommandAsync('playsound note.bass @s')
                            player.runCommandAsync('tellraw @s {"rawtext":[{"text":"§6§l[Kcam]§r§7 -§c Não há o que apagar."}]}')
                        }


                    }
                })
            })
        }
    })
}

