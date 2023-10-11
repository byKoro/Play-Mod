import { world, system } from "@minecraft/server"
import { db, Config_Dropdown } from './camcinematic.js'

function particle_selectioned(player) {
    return Config_Dropdown.particle_select[db[player.id].particulas];
}

export async function Marker_Active() {
    system.runInterval((tick) => {
        const playersWithTestTag = world.getPlayers().filter(player => player.hasTag('marker'));
        for (let player of playersWithTestTag) {
            console.clear
            if (db[player.id]?.particlepos?.length > 0 && db[player.id].marker && !db[player.id].cinematic) {
                const selectedParticle = particle_selectioned(player);
                const particleCommands = db[player.id].particlepos.map(pos => `particle ${selectedParticle} ${pos}`);
                const commandPromises = particleCommands.map(command => player.runCommandAsync(command));
                Promise.all(commandPromises);
                db[player.id].cont = 0;
            }
        }
    }, 0);
}

