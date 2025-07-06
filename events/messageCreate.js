/**
 * Événement de création de message avec modération automatique
 * Développé par AstraxxTv
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

// Système anti-spam
const spamMap = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignorer les messages des bots
        if (message.author.bot) return;

        // Système de modération automatique
        if (config.autoMod.enabled) {
            await handleAutoMod(message);
        }

        // Système de niveaux (si activé)
        if (config.levels.enabled) {
            await handleLeveling(message);
        }
    },
};

async function handleAutoMod(message) {
    const content = message.content.toLowerCase();
    const member = message.member;

    // Anti-spam
    if (config.autoMod.antiSpam) {
        const userId = message.author.id;
        const now = Date.now();
        
        if (!spamMap.has(userId)) {
            spamMap.set(userId, []);
        }
        
        const userMessages = spamMap.get(userId);
        userMessages.push(now);
        
        // Garder seulement les messages des 5 dernières secondes
        const recentMessages = userMessages.filter(time => now - time < 5000);
        spamMap.set(userId, recentMessages);
        
        if (recentMessages.length > 5) {
            await message.delete();
            const warningEmbed = new EmbedBuilder()
                .setColor(config.embedWarningColor)
                .setTitle('⚠️ Anti-Spam')
                .setDescription(`${message.author}, vous envoyez trop de messages rapidement.`)
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
            
            const warning = await message.channel.send({ embeds: [warningEmbed] });
            
            // Supprimer l'avertissement après 5 secondes
            setTimeout(() => {
                warning.delete().catch(() => {});
            }, 5000);
            
            return;
        }
    }

    // Anti-caps
    if (config.autoMod.antiCaps) {
        const upperCaseCount = (message.content.match(/[A-Z]/g) || []).length;
        const totalLetters = (message.content.match(/[A-Za-z]/g) || []).length;
        
        if (totalLetters > 10 && (upperCaseCount / totalLetters) > 0.7) {
            await message.delete();
            const warningEmbed = new EmbedBuilder()
                .setColor(config.embedWarningColor)
                .setTitle('⚠️ Anti-Caps')
                .setDescription(`${message.author}, évitez d'écrire en majuscules.`)
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
            
            const warning = await message.channel.send({ embeds: [warningEmbed] });
            
            setTimeout(() => {
                warning.delete().catch(() => {});
            }, 5000);
            
            return;
        }
    }

    // Anti-lien
    if (config.autoMod.antiLink) {
        const linkRegex = /https?:\/\/[^\s]+/g;
        if (linkRegex.test(message.content)) {
            // Vérifier si l'utilisateur a la permission de poster des liens
            if (!member.permissions.has('ManageMessages')) {
                await message.delete();
                const warningEmbed = new EmbedBuilder()
                    .setColor(config.embedWarningColor)
                    .setTitle('⚠️ Liens Interdits')
                    .setDescription(`${message.author}, vous n'avez pas la permission de poster des liens.`)
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
                
                const warning = await message.channel.send({ embeds: [warningEmbed] });
                
                setTimeout(() => {
                    warning.delete().catch(() => {});
                }, 5000);
                
                return;
            }
        }
    }

    // Anti-invite
    if (config.autoMod.antiInvite) {
        const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+/g;
        if (inviteRegex.test(message.content)) {
            await message.delete();
            const warningEmbed = new EmbedBuilder()
                .setColor(config.embedWarningColor)
                .setTitle('⚠️ Invitations Interdites')
                .setDescription(`${message.author}, les invitations Discord ne sont pas autorisées.`)
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
            
            const warning = await message.channel.send({ embeds: [warningEmbed] });
            
            setTimeout(() => {
                warning.delete().catch(() => {});
            }, 5000);
            
            return;
        }
    }

    // Filtre de mots
    if (config.autoMod.wordFilter && config.autoMod.bannedWords.length > 0) {
        for (const word of config.autoMod.bannedWords) {
            if (content.includes(word.toLowerCase())) {
                await message.delete();
                const warningEmbed = new EmbedBuilder()
                    .setColor(config.embedErrorColor)
                    .setTitle('🚫 Mot Interdit')
                    .setDescription(`${message.author}, ce mot n'est pas autorisé sur ce serveur.`)
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
                
                const warning = await message.channel.send({ embeds: [warningEmbed] });
                
                setTimeout(() => {
                    warning.delete().catch(() => {});
                }, 5000);
                
                return;
            }
        }
    }
}

async function handleLeveling(message) {
    const userId = message.author.id;
    const guildId = message.guild.id;
    
    // Vérifier le cooldown
    const cooldownKey = `${userId}-${guildId}`;
    const now = Date.now();
    
    if (!message.client.userData.has(cooldownKey)) {
        message.client.userData.set(cooldownKey, 0);
    }
    
    const lastMessage = message.client.userData.get(cooldownKey);
    if (now - lastMessage < config.levels.xpCooldown) {
        return;
    }
    
    // Ajouter de l'XP
    message.client.userData.set(cooldownKey, now);
    
    // Ici vous pourriez implémenter un système de base de données pour stocker l'XP
    // Pour cet exemple, on utilise juste la mémoire
    
    // Annoncer les niveaux (exemple simplifié)
    if (config.levels.announceChannelId) {
        const announceChannel = message.guild.channels.cache.get(config.levels.announceChannelId);
        if (announceChannel && Math.random() < 0.01) { // 1% de chance
            const levelEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🎉 Niveau Atteint !')
                .setDescription(`${message.author} a gagné de l'expérience !`)
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });
            
            await announceChannel.send({ embeds: [levelEmbed] });
        }
    }
} 