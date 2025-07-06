/**
 * Événement de départ de membre
 * Développé par AstraxxTv
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const guild = member.guild;

        // Log du départ
        if (config.logs.enabled && config.logs.memberLeave && config.logChannelId) {
            const logChannel = guild.channels.cache.get(config.logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(config.embedWarningColor)
                    .setTitle('👋 Membre Parti')
                    .setDescription(`${member.user.tag} a quitté le serveur.`)
                    .addFields(
                        { name: 'Utilisateur', value: `${member.user.tag} (${member.user.id})`, inline: true },
                        { name: 'A rejoint le', value: member.joinedAt ? member.joinedAt.toLocaleDateString('fr-FR') : 'Inconnu', inline: true },
                        { name: 'Membres restants', value: (guild.memberCount - 1).toString(), inline: true }
                    )
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    },
}; 