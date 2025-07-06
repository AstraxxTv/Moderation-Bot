/**
 * Bot Discord de Modération Avancé
 * Développé par AstraxxTv
 * Version: 1.0.0
 */

const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Création du client Discord avec tous les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration
    ]
});

// Collections pour stocker les commandes et les événements
client.commands = new Collection();
client.cooldowns = new Collection();
client.userData = new Collection();

// Variables globales
let statusIndex = 0;
let statusInterval;

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Commande chargée: ${command.data.name}`);
    } else {
        console.log(`⚠️ La commande ${filePath} manque de propriétés requises`);
    }
}

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Événement chargé: ${event.name}`);
}

// Gestionnaire d'interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Gestion des cooldowns
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({
                content: `⏰ Veuillez attendre <t:${expiredTimestamp}:R> avant de réutiliser la commande \`${command.data.name}\`.`,
                ephemeral: true
            });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    // Exécution de la commande
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
        
        const errorMessage = {
            content: '❌ Une erreur s\'est produite lors de l\'exécution de cette commande !',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Fonction pour changer le statut du bot
function updateStatus() {
    if (!config.status.enabled) return;
    
    const statusMessages = config.status.messages;
    const status = statusMessages[statusIndex];
    
    let activityType;
    switch (config.status.type) {
        case 'PLAYING':
            activityType = ActivityType.Playing;
            break;
        case 'STREAMING':
            activityType = ActivityType.Streaming;
            break;
        case 'LISTENING':
            activityType = ActivityType.Listening;
            break;
        case 'WATCHING':
            activityType = ActivityType.Watching;
            break;
        case 'COMPETING':
            activityType = ActivityType.Competing;
            break;
        default:
            activityType = ActivityType.Watching;
    }
    
    client.user.setActivity(status, { type: activityType });
    
    statusIndex = (statusIndex + 1) % statusMessages.length;
}

// Événement ready
client.once('ready', () => {
    console.log(`🤖 ${client.user.tag} est maintenant en ligne !`);
    console.log(`👥 Servant ${client.guilds.cache.size} serveurs`);
    console.log(`👤 Servant ${client.users.cache.size} utilisateurs`);
    console.log(`📝 Développé par AstraxxTv`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Démarrage du système de statut rotatif
    if (config.status.enabled) {
        updateStatus();
        statusInterval = setInterval(updateStatus, config.status.interval);
    }
    
    // Vérification de la configuration
    if (config.token === 'VOTRE_TOKEN_DISCORD_ICI') {
        console.log('⚠️ ATTENTION: Veuillez configurer votre token Discord dans config.json');
    }
});

// Gestion des erreurs
client.on('error', error => {
    console.error('Erreur Discord.js:', error);
});

process.on('unhandledRejection', error => {
    console.error('Promesse rejetée non gérée:', error);
});

process.on('uncaughtException', error => {
    console.error('Exception non capturée:', error);
});

// Connexion du bot
client.login(config.token); 