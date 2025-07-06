/**
 * Utilitaire pour construire des embeds Discord
 * Développé par AstraxxTv
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

class EmbedBuilder {
    static success(title, description, fields = []) {
        return new EmbedBuilder()
            .setColor(config.embedSuccessColor)
            .setTitle(`✅ ${title}`)
            .setDescription(description)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }

    static error(title, description, fields = []) {
        return new EmbedBuilder()
            .setColor(config.embedErrorColor)
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }

    static warning(title, description, fields = []) {
        return new EmbedBuilder()
            .setColor(config.embedWarningColor)
            .setTitle(`⚠️ ${title}`)
            .setDescription(description)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }

    static info(title, description, fields = []) {
        return new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`ℹ️ ${title}`)
            .setDescription(description)
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }

    static log(action, user, moderator, reason = 'Aucune raison spécifiée', duration = null) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`📝 Log de Modération`)
            .addFields(
                { name: 'Action', value: action, inline: true },
                { name: 'Utilisateur', value: `<@${user.id}> (${user.tag})`, inline: true },
                { name: 'Modérateur', value: `<@${moderator.id}> (${moderator.tag})`, inline: true },
                { name: 'Raison', value: reason, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

        if (duration) {
            embed.addFields({ name: 'Durée', value: duration, inline: true });
        }

        return embed;
    }

    static welcome(user, memberCount) {
        return new EmbedBuilder()
            .setColor(config.embedSuccessColor)
            .setTitle('🎉 Nouveau Membre !')
            .setDescription(`Bienvenue ${user} sur le serveur !\nTu es notre ${memberCount}ème membre !`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }

    static goodbye(user) {
        return new EmbedBuilder()
            .setColor(config.embedWarningColor)
            .setTitle('👋 Membre Parti')
            .setDescription(`${user} a quitté le serveur.`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });
    }
}

module.exports = EmbedBuilder; 