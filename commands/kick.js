/**
 * Commande d'expulsion
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilder = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissions');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison de l\'expulsion')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    cooldown: 3,

    async execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const moderator = interaction.member;

        // Vérifications de permissions
        if (!PermissionChecker.canKick(moderator)) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Permission Refusée', 'Vous n\'avez pas la permission d\'expulser des utilisateurs.')],
                ephemeral: true
            });
        }

        const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Erreur', 'Impossible de trouver cet utilisateur sur le serveur.')],
                ephemeral: true
            });
        }

        // Vérifier si l'utilisateur peut être expulsé
        if (!targetMember.kickable) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Impossible d\'Expulser', 'Je ne peux pas expulser cet utilisateur. Il a peut-être des permissions plus élevées que moi.')],
                ephemeral: true
            });
        }

        // Vérifier la hiérarchie des rôles
        if (!PermissionChecker.isHigherRole(moderator, targetMember)) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Permission Refusée', 'Vous ne pouvez pas expulser quelqu\'un qui a un rôle plus élevé que vous.')],
                ephemeral: true
            });
        }

        // Vérifier si l'utilisateur est le propriétaire
        if (targetMember.id === interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Impossible d\'Expulser', 'Vous ne pouvez pas expulser le propriétaire du serveur.')],
                ephemeral: true
            });
        }

        try {
            // Expulser l'utilisateur
            await targetMember.kick(`${reason} | Expulsé par ${moderator.user.tag}`);

            // Créer l'embed de confirmation
            const kickEmbed = EmbedBuilder.success(
                'Utilisateur Expulsé',
                `${user.tag} a été expulsé du serveur.`,
                [
                    { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Modérateur', value: `${moderator.user.tag}`, inline: true },
                    { name: 'Raison', value: reason, inline: false }
                ]
            );

            await interaction.reply({ embeds: [kickEmbed] });

            // Envoyer un message privé à l'utilisateur expulsé
            try {
                const dmEmbed = EmbedBuilder.warning(
                    'Vous avez été expulsé',
                    `Vous avez été expulsé du serveur **${interaction.guild.name}**`,
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
                    const logEmbed = EmbedBuilder.log('Expulsion', user, moderator.user, reason);
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('Erreur lors de l\'expulsion:', error);
            await interaction.reply({
                embeds: [EmbedBuilder.error('Erreur', 'Une erreur s\'est produite lors de l\'expulsion.')],
                ephemeral: true
            });
        }
    },
}; 