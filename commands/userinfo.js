/**
 * Commande d'informations utilisateur
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment/locale/fr');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Afficher les informations d\'un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur dont vous voulez voir les informations')
                .setRequired(false)),

    cooldown: 3,

    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('utilisateur') || interaction.user;
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Configuration de moment.js pour le français
        moment.locale('fr');

        // Créer l'embed d'informations
        const userInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`📋 Informations de ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '👤 Utilisateur', value: `${targetUser}`, inline: true },
                { name: '🆔 ID', value: targetUser.id, inline: true },
                { name: '📅 Compte créé le', value: moment(targetUser.createdAt).format('DD/MM/YYYY à HH:mm'), inline: true },
                { name: '📊 Statut', value: targetMember ? targetMember.presence?.status || 'Hors ligne' : 'Non membre', inline: true },
                { name: '🎨 Couleur', value: targetMember ? targetMember.displayHexColor : 'N/A', inline: true },
                { name: '🎭 Surnom', value: targetMember?.nickname || 'Aucun', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

        // Ajouter les rôles si l'utilisateur est membre
        if (targetMember) {
            const roles = targetMember.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, 10); // Limiter à 10 rôles

            if (roles.length > 0) {
                userInfoEmbed.addFields({
                    name: `🎭 Rôles [${roles.length}]`,
                    value: roles.join(', ') + (targetMember.roles.cache.size > 11 ? '...' : ''),
                    inline: false
                });
            }

            // Ajouter les permissions clés
            const keyPermissions = [];
            if (targetMember.permissions.has('Administrator')) keyPermissions.push('👑 Administrateur');
            if (targetMember.permissions.has('ManageGuild')) keyPermissions.push('⚙️ Gérer le serveur');
            if (targetMember.permissions.has('ManageMessages')) keyPermissions.push('💬 Gérer les messages');
            if (targetMember.permissions.has('BanMembers')) keyPermissions.push('🔨 Bannir');
            if (targetMember.permissions.has('KickMembers')) keyPermissions.push('👢 Expulser');
            if (targetMember.permissions.has('ManageRoles')) keyPermissions.push('🎭 Gérer les rôles');

            if (keyPermissions.length > 0) {
                userInfoEmbed.addFields({
                    name: '🔑 Permissions Clés',
                    value: keyPermissions.join('\n'),
                    inline: false
                });
            }

            // Ajouter la date d'arrivée
            userInfoEmbed.addFields({
                name: '🚪 A rejoint le',
                value: moment(targetMember.joinedAt).format('DD/MM/YYYY à HH:mm'),
                inline: true
            });

            // Ajouter le statut de communication
            if (targetMember.isCommunicationDisabled()) {
                const timeoutEnd = targetMember.communicationDisabledUntil;
                userInfoEmbed.addFields({
                    name: '🔇 Mute jusqu\'au',
                    value: moment(timeoutEnd).format('DD/MM/YYYY à HH:mm'),
                    inline: true
                });
            }
        }

        // Ajouter des badges si disponibles
        const badges = [];
        if (targetUser.flags) {
            if (targetUser.flags.has('Staff')) badges.push('👨‍💼 Discord Staff');
            if (targetUser.flags.has('Partner')) badges.push('🤝 Discord Partner');
            if (targetUser.flags.has('Hypesquad')) badges.push('💎 HypeSquad Events');
            if (targetUser.flags.has('BugHunterLevel1')) badges.push('🐛 Bug Hunter');
            if (targetUser.flags.has('BugHunterLevel2')) badges.push('🐛 Bug Hunter Gold');
            if (targetUser.flags.has('HypeSquadOnlineHouse1')) badges.push('🏠 House Bravery');
            if (targetUser.flags.has('HypeSquadOnlineHouse2')) badges.push('🏠 House Brilliance');
            if (targetUser.flags.has('HypeSquadOnlineHouse3')) badges.push('🏠 House Balance');
            if (targetUser.flags.has('PremiumEarlySupporter')) badges.push('👑 Early Supporter');
            if (targetUser.flags.has('TeamPseudoUser')) badges.push('👥 Team User');
            if (targetUser.flags.has('VerifiedBot')) badges.push('🤖 Verified Bot');
            if (targetUser.flags.has('VerifiedDeveloper')) badges.push('👨‍💻 Verified Bot Developer');
        }

        if (badges.length > 0) {
            userInfoEmbed.addFields({
                name: '🏆 Badges',
                value: badges.join('\n'),
                inline: false
            });
        }

        await interaction.reply({ embeds: [userInfoEmbed] });
    },
}; 