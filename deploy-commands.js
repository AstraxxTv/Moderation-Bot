/**
 * Script de déploiement des commandes slash
 * Développé par AstraxxTv
 */

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`📝 Commande préparée: ${command.data.name}`);
    } else {
        console.log(`⚠️ La commande ${filePath} manque de propriétés requises`);
    }
}

const rest = new REST().setToken(config.token);

(async () => {
    try {
        console.log(`🔄 Début du déploiement de ${commands.length} commandes d'application...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );

        console.log(`✅ ${data.length} commandes d'application déployées avec succès !`);
        console.log('📝 Développé par AstraxxTv');
    } catch (error) {
        console.error('❌ Erreur lors du déploiement des commandes:', error);
    }
})(); 