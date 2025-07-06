/**
 * Commande de débannissement
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const CustomEmbedBuilder = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissions');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Débannir un utilisateur du serveur')
        .addStringOption(option =>
            option.setName('utilisateur_id')
                .setDescription('L\'ID de l\'utilisateur à débannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du débannissement')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    cooldown: 3,

    async execute(interaction, client) {
        const userId = interaction.options.getString('utilisateur_id');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const moderator = interaction.member;

        // Vérifications de permissions
        if (!PermissionChecker.canBan(moderator)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Permission Refusée', 'Vous n\'avez pas la permission de débannir des utilisateurs.')],
                ephemeral: true
            });
        }

        // Vérifier si l'ID est valide
        if (!/^\d{17,19}$/.test(userId)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('ID Invalide', 'L\'ID utilisateur fourni n\'est pas valide.')],
                ephemeral: true
            });
        }

        try {
            // Récupérer les bans du serveur
            const bans = await interaction.guild.bans.fetch();
            const ban = bans.get(userId);

            if (!ban) {
                return interaction.reply({
                    embeds: [CustomEmbedBuilder.error('Utilisateur Non Banni', 'Cet utilisateur n\'est pas banni de ce serveur.')],
                    ephemeral: true
                });
            }

            // Débannir l'utilisateur
            await interaction.guild.members.unban(userId, `${reason} | Débanni par ${moderator.user.tag}`);

            // Récupérer les informations de l'utilisateur
            const user = ban.user;

            // Créer l'embed de confirmation
            const unbanEmbed = CustomEmbedBuilder.success(
                'Utilisateur Débanni',
                `${user.tag} a été débanni du serveur.`,
                [
                    { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Modérateur', value: `${moderator.user.tag}`, inline: true },
                    { name: 'Raison', value: reason, inline: false }
                ]
            );

            await interaction.reply({ embeds: [unbanEmbed] });

            // Envoyer le log
            if (config.logs.enabled && config.logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
                if (logChannel) {
                    const logEmbed = CustomEmbedBuilder.log('Débannissement', user, moderator.user, reason);
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('Erreur lors du débannissement:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Erreur', 'Une erreur s\'est produite lors du débannissement.')],
                ephemeral: true
            });
        }
    },
}; 