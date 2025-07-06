/**
 * Événement d'arrivée de membre
 * Développé par AstraxxTv
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guild = member.guild;
        
        // Système de bienvenue
        if (config.welcome.enabled && config.welcomeChannelId) {
            const welcomeChannel = guild.channels.cache.get(config.welcomeChannelId);
            if (welcomeChannel) {
                const welcomeMessage = config.welcome.message
                    .replace('{user}', member.toString())
                    .replace('{memberCount}', guild.memberCount);
                
                const welcomeEmbed = new EmbedBuilder()
                    .setColor(config.embedSuccessColor)
                    .setTitle('🎉 Nouveau Membre !')
                    .setDescription(welcomeMessage)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });

                await welcomeChannel.send({ embeds: [welcomeEmbed] });
            }
        }

        // Message privé de bienvenue
        if (config.welcome.dmMessage) {
            try {
                const dmMessage = config.welcome.dmMessage
                    .replace('{user}', member.user.username)
                    .replace('{server}', guild.name);
                
                const dmEmbed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle(`Bienvenue sur ${guild.name} !`)
                    .setDescription(dmMessage)
                    .setThumbnail(guild.iconURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });

                await member.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Impossible d'envoyer un message privé à ${member.user.tag}: ${error.message}`);
            }
        }

        // Attribution automatique de rôle
        if (config.autoRoleId) {
            try {
                const autoRole = guild.roles.cache.get(config.autoRoleId);
                if (autoRole) {
                    await member.roles.add(autoRole, 'Rôle automatique');
                }
            } catch (error) {
                console.log(`Erreur lors de l'attribution du rôle automatique à ${member.user.tag}: ${error.message}`);
            }
        }

        // Log de l'arrivée
        if (config.logs.enabled && config.logs.memberJoin && config.logChannelId) {
            const logChannel = guild.channels.cache.get(config.logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle('👋 Membre Rejoint')
                    .setDescription(`${member.user.tag} a rejoint le serveur.`)
                    .addFields(
                        { name: 'Utilisateur', value: `${member.user.tag} (${member.user.id})`, inline: true },
                        { name: 'Compte créé le', value: member.user.createdAt.toLocaleDateString('fr-FR'), inline: true },
                        { name: 'Membre #', value: guild.memberCount.toString(), inline: true }
                    )
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });

                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        // Vérification de l'âge du compte (anti-raid)
        const accountAge = Date.now() - member.user.createdAt.getTime();
        const minAccountAge = 7 * 24 * 60 * 60 * 1000; // 7 jours

        if (accountAge < minAccountAge) {
            const suspiciousEmbed = new EmbedBuilder()
                .setColor(config.embedWarningColor)
                .setTitle('⚠️ Compte Suspect')
                .setDescription(`Un compte récent a rejoint le serveur.`)
                .addFields(
                    { name: 'Utilisateur', value: `${member.user.tag} (${member.user.id})`, inline: true },
                    { name: 'Âge du compte', value: `${Math.floor(accountAge / (24 * 60 * 60 * 1000))} jours`, inline: true }
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://minotar.net/helm/AstraxxTv/48.png' });

            // Envoyer l'alerte dans le canal de logs
            if (config.logChannelId) {
                const logChannel = guild.channels.cache.get(config.logChannelId);
                if (logChannel) {
                    await logChannel.send({ embeds: [suspiciousEmbed] });
                }
            }
        }
    },
}; 