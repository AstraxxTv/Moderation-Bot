/**
 * Commande d'informations serveur
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment/locale/fr');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Afficher les informations du serveur'),

    cooldown: 3,

    async execute(interaction, client) {
        const guild = interaction.guild;
        
        // Configuration de moment.js pour le français
        moment.locale('fr');

        // Récupérer les statistiques du serveur
        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(member => member.presence?.status !== 'offline').size;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const humanCount = totalMembers - botCount;

        // Compter les canaux par type
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;
        const categories = guild.channels.cache.filter(channel => channel.type === 4).size;
        const announcements = guild.channels.cache.filter(channel => channel.type === 5).size;
        const stages = guild.channels.cache.filter(channel => channel.type === 13).size;
        const forums = guild.channels.cache.filter(channel => channel.type === 15).size;

        // Compter les rôles
        const totalRoles = guild.roles.cache.size;

        // Compter les emojis
        const totalEmojis = guild.emojis.cache.size;
        const animatedEmojis = guild.emojis.cache.filter(emoji => emoji.animated).size;
        const staticEmojis = totalEmojis - animatedEmojis;

        // Créer l'embed d'informations
        const serverInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`📊 Informations du Serveur: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
                { name: '🆔 ID du Serveur', value: guild.id, inline: true },
                { name: '📅 Créé le', value: moment(guild.createdAt).format('DD/MM/YYYY à HH:mm'), inline: true },
                { name: '👥 Membres', value: `${totalMembers} (${onlineMembers} en ligne)`, inline: true },
                { name: '👤 Humains', value: humanCount.toString(), inline: true },
                { name: '🤖 Bots', value: botCount.toString(), inline: true },
                { name: '💬 Canaux Texte', value: textChannels.toString(), inline: true },
                { name: '🔊 Canaux Vocaux', value: voiceChannels.toString(), inline: true },
                { name: '📢 Annonces', value: announcements.toString(), inline: true },
                { name: '🎭 Rôles', value: totalRoles.toString(), inline: true },
                { name: '😀 Emojis', value: `${totalEmojis} (${animatedEmojis} animés)`, inline: true },
                { name: '📁 Catégories', value: categories.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

        // Ajouter les informations de boost si disponibles
        if (guild.premiumTier > 0) {
            const boostLevel = guild.premiumTier;
            const boostCount = guild.premiumSubscriptionCount;
            const boostEmoji = ['', '⭐', '💫', '🌟'];
            
            serverInfoEmbed.addFields({
                name: '🚀 Niveau de Boost',
                value: `${boostEmoji[boostLevel]} Niveau ${boostLevel} (${boostCount} boosts)`,
                inline: true
            });
        }

        // Ajouter les informations de vérification
        const verificationLevels = {
            0: 'Aucune',
            1: 'Faible',
            2: 'Moyenne',
            3: 'Élevée',
            4: 'Très élevée'
        };

        serverInfoEmbed.addFields({
            name: '🔒 Niveau de Vérification',
            value: verificationLevels[guild.verificationLevel] || 'Inconnu',
            inline: true
        });

        // Ajouter les informations de contenu explicite
        const contentFilterLevels = {
            0: 'Désactivé',
            1: 'Membres sans rôle',
            2: 'Tous les membres'
        };

        serverInfoEmbed.addFields({
            name: '🚫 Filtre de Contenu',
            value: contentFilterLevels[guild.explicitContentFilter] || 'Inconnu',
            inline: true
        });

        // Ajouter les fonctionnalités du serveur
        const features = guild.features.map(feature => {
            const featureNames = {
                'ANIMATED_ICON': '🎨 Icône Animée',
                'BANNER': '🖼️ Bannière',
                'COMMERCE': '🛒 Commerce',
                'COMMUNITY': '👥 Communauté',
                'DISCOVERABLE': '🔍 Découvrable',
                'FEATURABLE': '⭐ Mise en avant',
                'INVITE_SPLASH': '🎨 Splash d\'invitation',
                'MEMBER_VERIFICATION_GATE_ENABLED': '🚪 Porte de vérification',
                'MONETIZATION_ENABLED': '💰 Monétisation',
                'MORE_EMOJI': '😀 Plus d\'emojis',
                'NEWS': '📢 Actualités',
                'PARTNERED': '🤝 Partenaire',
                'PREVIEW_ENABLED': '👀 Aperçu',
                'PRIVATE_THREADS': '🧵 Fils privés',
                'ROLE_ICONS': '🎭 Icônes de rôles',
                'SEVEN_DAY_THREAD_ARCHIVE': '📅 Archives 7 jours',
                'THREE_DAY_THREAD_ARCHIVE': '📅 Archives 3 jours',
                'TICKETED_EVENTS_ENABLED': '🎫 Événements avec tickets',
                'VANITY_URL': '🔗 URL personnalisée',
                'VERIFIED': '✅ Vérifié',
                'VIP_REGIONS': '🌍 Régions VIP',
                'WELCOME_SCREEN_ENABLED': '👋 Écran de bienvenue'
            };
            return featureNames[feature] || feature;
        });

        if (features.length > 0) {
            serverInfoEmbed.addFields({
                name: '✨ Fonctionnalités',
                value: features.slice(0, 10).join('\n') + (features.length > 10 ? '\n...' : ''),
                inline: false
            });
        }

        // Ajouter l'image de bannière si disponible
        if (guild.banner) {
            serverInfoEmbed.setImage(guild.bannerURL({ size: 1024 }));
        }

        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
}; 