/**
 * Commande de bannissement
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const CustomEmbedBuilder = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissions');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du bannissement')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('jours')
                .setDescription('Nombre de jours de messages à supprimer (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    cooldown: 5,

    async execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const deleteMessageDays = interaction.options.getInteger('jours') || 0;
        const moderator = interaction.member;

        // Vérifications de permissions
        if (!PermissionChecker.canBan(moderator)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Permission Refusée', 'Vous n\'avez pas la permission de bannir des utilisateurs.')],
                ephemeral: true
            });
        }

        const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Erreur', 'Impossible de trouver cet utilisateur sur le serveur.')],
                ephemeral: true
            });
        }

        // Vérifier si l'utilisateur peut être banni
        if (!targetMember.bannable) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Impossible de Bannir', 'Je ne peux pas bannir cet utilisateur. Il a peut-être des permissions plus élevées que moi.')],
                ephemeral: true
            });
        }

        // Vérifier la hiérarchie des rôles
        if (!PermissionChecker.isHigherRole(moderator, targetMember)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Permission Refusée', 'Vous ne pouvez pas bannir quelqu\'un qui a un rôle plus élevé que vous.')],
                ephemeral: true
            });
        }

        // Vérifier si l'utilisateur est le propriétaire
        if (targetMember.id === interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Impossible de Bannir', 'Vous ne pouvez pas bannir le propriétaire du serveur.')],
                ephemeral: true
            });
        }

        try {
            // Bannir l'utilisateur
            await targetMember.ban({
                reason: `${reason} | Banni par ${moderator.user.tag}`,
                deleteMessageDays: deleteMessageDays
            });

            // Créer l'embed de confirmation
            const banEmbed = CustomEmbedBuilder.success(
                'Utilisateur Banni',
                `${user.tag} a été banni du serveur.`,
                [
                    { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Modérateur', value: `${moderator.user.tag}`, inline: true },
                    { name: 'Raison', value: reason, inline: false },
                    { name: 'Messages supprimés', value: `${deleteMessageDays} jours`, inline: true }
                ]
            );

            await interaction.reply({ embeds: [banEmbed] });

            // Envoyer un message privé à l'utilisateur banni
            try {
                const dmEmbed = CustomEmbedBuilder.warning(
                    'Vous avez été banni',
                    `Vous avez été banni du serveur **${interaction.guild.name}**`,
                    [
                        { name: 'Raison', value: reason, inline: false },
                        { name: 'Modérateur', value: moderator.user.tag, inline: true },
                        { name: 'Date', value: new Date().toLocaleString('fr-FR'), inline: true }
                    ]
                );
                await user.send({ embeds: [dmEmbed] });
            } catch (dmError) {
                console.log(`Impossible d'envoyer un message privé à ${user.tag}: ${dmError.message}`);
            }

            // Envoyer le log
            if (config.logs.enabled && config.logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
                if (logChannel) {
                    const logEmbed = CustomEmbedBuilder.log('Bannissement', user, moderator.user, reason);
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('Erreur lors du bannissement:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Erreur', 'Une erreur s\'est produite lors du bannissement.')],
                ephemeral: true
            });
        }
    },
}; 