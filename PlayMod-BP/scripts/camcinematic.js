import * as ui from "@minecraft/server-ui";
import { world, system } from "@minecraft/server";
export const db = {};

export const Config_Dropdown = {
    animation_options: [
        { "rawtext": [{ "translate": "animation.none" }] },
        "Linear",
        "Spring",
        "In Quad",
        "Out Quad",
        "In Out Quad",
        "In Cubic",
        "Out Cubic",
        "In Out Cubic",
        "In Quart",
        "Out Quart",
        "In Out Quart",
        "In Quint",
        "Out Quint",
        "In Out Quint",
        "In Sine",
        "Out Sine",
        "In Out Sine",
        "In Expo",
        "Out Expo",
        "In Out Expo",
        "In Circ",
        "Out Circ",
        "In Out Circ",
        "In Bounce",
        "Out Bounce",
        "In Out Bounce",
        "In Back",
        "Out Back",
        "In Out Back",
        "In Elastic",
        "Out Elastic",
        "In Out Elastic"
    ],
    animation_select: [
        "",
        "linear",
        "spring",
        "in_quad",
        "out_quad",
        "in_out_quad",
        "in_cubic",
        "out_cubic",
        "in_out_cubic",
        "in_quart",
        "out_quart",
        "in_out_quart",
        "in_quint",
        "out_quint",
        "in_out_quint",
        "in_sine",
        "out_sine",
        "in_out_sine",
        "in_expo",
        "out_expo",
        "in_out_expo",
        "in_circ",
        "out_circ",
        "in_out_circ",
        "in_bounce",
        "out_bounce",
        "in_out_bounce",
        "in_back",
        "out_back",
        "in_out_back",
        "in_elastic",
        "out_elastic",
        "in_out_elastic"
    ],
    particle_dropdown: [
        { "rawtext": [{ "translate": "particle.red" }] },
        { "rawtext": [{ "translate": "particle.rgb" }] },
        { "rawtext": [{ "translate": "particle.purple" }] },
        { "rawtext": [{ "translate": "particle.fire" }] },
        { "rawtext": [{ "translate": "particle.blue.fire" }] }
    ],
    particle_select: [
        'minecraft:obsidian_glow_dust_particle',
        'minecraft:sculk_sensor_redstone_particle',
        'minecraft:dragon_breath_trail',
        'minecraft:basic_flame_particle',
        'minecraft:blue_flame_particle'
    ]
}


export function camcinematic() {

    const camcinematicui = new ui.ActionFormData()
        .title({ "rawtext": [{ "translate": "cancinematicui.title" }] })
        .body({ "rawtext": [{ "translate": "%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s\n%%s", "with": { "rawtext": [{ "translate": "cancinematicui.body.line1" }, { "translate": "cancinematicui.body.line2" }, { "translate": "cancinematicui.body.line3" }, { "translate": "cancinematicui.body.line4" }, { "translate": "cancinematicui.body.line5" }, { "translate": "cancinematicui.body.line6" }, { "translate": "cancinematicui.body.line7" }, { "translate": "cancinematicui.body.line8" }] } }] })
        .button({ "rawtext": [{ "translate": "button.add.cam" }] }, "textures/menu/cam.png")
        .button({ "rawtext": [{ "translate": "button.configuration.cam" }] }, "textures/menu/config.png")
        .button({ "rawtext": [{ "translate": "button.initiate.cam" }] }, "textures/menu/iniciar.png")
        .button({ "rawtext": [{ "translate": "button.delete.cam" }] }, "textures/menu/apagar.png")

    world.beforeEvents.itemUse.subscribe(eventData => {
        if (eventData.itemStack?.typeId === 'cam:camcinematic') {
            const player = eventData.source;
            if (!db[player.id]) {
                db[player.id] = {
                    campositions: [],
                    anim: 0,
                    time: 1,
                    marker: false,
                    particlepos: [],
                    cont: 0,
                    contcampos: 0,
                    particulas: 0,
                    cinematic: false
                };
            }
            system.run(() => {
                camcinematicui.show(player).then(result => {
                    mainCam(result, player);
                });
            });
        }
    });

    function mainCam(result, player) {

        const { x, y, z } = player.location;
        const xRot = player.getRotation().x;
        const yRot = player.getRotation().y;

        switch (result.selection) {
            case 0:
                handlePosicionarQuadro(player, x, y, z, xRot, yRot);
                break;
            case 1:
                handleConfiguracoes(player);
                break;
            case 2:
                handleIniciarCinematica(player);
                break;
            case 3:
                handleApagarCamera(player);
                break;
            default:
                break;
        }
    }

    function handlePosicionarQuadro(player, x, y, z, xRot, yRot) {
        if (!db[player.id].marker) {
            player.runCommandAsync('tag @s remove marker');
        }
        db[player.id].campositions.push(` ${x} ${y + 1.8} ${z} rot ${xRot} ${yRot}`);
        db[player.id].particlepos.push(`${x} ${y + 1.8} ${z}`);
        player.runCommandAsync('playsound camera.take_picture @s ~ ~ ~0.7');
        player.runCommandAsync('tellraw @s { "rawtext": [{ "translate": "add.cam" }] }');
    }

    function handleConfiguracoes(player) {
        const configui = new ui.ModalFormData()
            .title({ "rawtext": [{ "translate": "settings.title" }] })
            .textField({ "rawtext": [{ "translate": "settings.textField" }] }, { "rawtext": [{ "translate": "settings.textField.box" }] }, `${db[player.id].time}`)
            .dropdown({ "rawtext": [{ "translate": "settings.dropdown.animation" }] }, Config_Dropdown.animation_options, db[player.id].anim)
            .toggle({ "rawtext": [{ "translate": "settings.toggle" }] }, db[player.id].marker)
            .dropdown({ "rawtext": [{ "translate": "settings.dropdown.particles" }] }, Config_Dropdown.particle_dropdown, db[player.id].particulas);

        system.run(() => {
            configui.show(player).then(r => {
                if (r.canceled) {
                    player.runCommandAsync('tellraw @s { "rawtext": [{ "translate": "not.save.cam" }]} ');
                    player.runCommandAsync('playsound note.bass @s ~ ~ ~ 0.4');
                    return;
                }

                if (r.formValues[0] !== undefined) {
                    db[player.id].time = r.formValues[0];
                }
                if (r.formValues[1] !== undefined) {
                    db[player.id].anim = r.formValues[1];
                }
                if (r.formValues[2] !== undefined) {
                    db[player.id].marker = r.formValues[2];
                }
                if (r.formValues[2] === true) {
                    player.runCommandAsync('tag @s add marker');
                }
                if (r.formValues[2] === false) {
                    player.runCommandAsync('tag @s remove marker');
                }
                if (r.formValues[3] !== undefined) {
                    db[player.id].particulas = r.formValues[3];
                }
                player.runCommandAsync('playsound camera.take_picture @s ~ ~ ~0.7');

                system.run(() => {
                    camcinematicui.show(player).then(result => {
                        mainCam(result, player);
                    });
                });
            });
        });
    }
    function handleIniciarCinematica(player) {
        db[player.id].contcampos = 0;
        let velocidade = db[player.id].time.toString().replace(/\D/g, '');
        if (!velocidade) {
            velocidade = 1;
        }
        let delay = 19.97 * velocidade;

        if (db[player.id].campositions.length === 0) {
            player.runCommandAsync('tellraw @s { "rawtext": [{ "translate": "initiate.fail.cinematic" }] }');
            player.runCommandAsync('playsound note.bass @s ~ ~ ~ 0.4');
            return;
        }

        function cinematic() {
            if (db[player.id].contcampos < db[player.id].campositions.length) {
                db[player.id].cinematic = true;

                if (db[player.id].contcampos === 0 && db[player.id].anim > 0) {
                    player.runCommandAsync(`camera @s set minecraft:free pos ${db[player.id].campositions[db[player.id].contcampos]}`)
                    delay = 20;
                }

                if (db[player.id].anim === 0) {
                    player.runCommandAsync(`camera @s set minecraft:free pos ${db[player.id].campositions[db[player.id].contcampos]}`);
                    delay = 19.97 * velocidade;
                    if (db[player.id].contcampos === db[player.id].campositions.length - 1) {
                        velocidade = 1;
                    }
                }

                if (db[player.id].anim !== 0 && db[player.id].contcampos >= 1) {
                    player.runCommandAsync(`camera @s set minecraft:free ease ${velocidade} ${Config_Dropdown.animation_select[db[player.id].anim]} pos ${db[player.id].campositions[db[player.id].contcampos]}`);
                    delay = 19.97 * velocidade;
                }

                db[player.id].contcampos++;

                if (db[player.id].contcampos === db[player.id].campositions.length) {
                    system.runTimeout(() => {
                        player.runCommandAsync('camera @s clear');
                        db[player.id].cinematic = false;
                    }, delay = velocidade * 19.97 + 20);
                }

                system.runTimeout(() => {
                    cinematic();
                }, delay);
            }
        }

        cinematic();
    }

    function handleApagarCamera(player) {
        player.runCommandAsync("camera @s clear");

        if (db[player.id].campositions.length > 0) {
            player.runCommandAsync('tellraw @s { "rawtext": [{ "translate": "delete.cam"}] }');
            player.runCommandAsync('playsound camera.take_picture @s ~ ~ ~0.7');
            db[player.id].campositions = [];
            db[player.id].particlepos = [];
            db[player.id].cinematic = false;
            db[player.id].contcampos = 0;
            db[player.id].cont = 0;
        } else {
            player.runCommandAsync('playsound note.bass @s ~ ~ ~ 0.4');
            player.runCommandAsync('tellraw @s{ "rawtext": [{ "translate": "not.delete.cam" }] }');
        }
    }

    // Função para selecionar a partícula
    function particleSelectioned(player) {
        return Config_Dropdown.particle_select[db[player.id].particulas];
    }
}
