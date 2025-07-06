/**
 * Commande de mute
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const CustomEmbedBuilder = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissions');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Muter un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à muter')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('durée')
                .setDescription('Durée du mute (ex: 1h, 30m, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du mute')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    cooldown: 3,

    async execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        const duration = interaction.options.getString('durée');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const moderator = interaction.member;

        // Vérifications de permissions
        if (!PermissionChecker.canManageRoles(moderator)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Permission Refusée', 'Vous n\'avez pas la permission de muter des utilisateurs.')],
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

        // Vérifier si l'utilisateur peut être muté
        if (!targetMember.moderatable) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Impossible de Muter', 'Je ne peux pas muter cet utilisateur. Il a peut-être des permissions plus élevées que moi.')],
                ephemeral: true
            });
        }

        // Vérifier la hiérarchie des rôles
        if (!PermissionChecker.isHigherRole(moderator, targetMember)) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Permission Refusée', 'Vous ne pouvez pas muter quelqu\'un qui a un rôle plus élevé que vous.')],
                ephemeral: true
            });
        }

        // Vérifier si l'utilisateur est le propriétaire
        if (targetMember.id === interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Impossible de Muter', 'Vous ne pouvez pas muter le propriétaire du serveur.')],
                ephemeral: true
            });
        }

        // Convertir la durée en millisecondes
        const ms = require('ms');
        const durationMs = ms(duration);

        if (!durationMs || durationMs < 60000 || durationMs > 2419200000) { // Entre 1 minute et 28 jours
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Durée Invalide', 'La durée doit être entre 1 minute et 28 jours (ex: 1h, 30m, 1d).')],
                ephemeral: true
            });
        }

        try {
            // Muter l'utilisateur
            await targetMember.timeout(durationMs, `${reason} | Muté par ${moderator.user.tag}`);

            // Créer l'embed de confirmation
            const muteEmbed = CustomEmbedBuilder.success(
                'Utilisateur Muté',
                `${user.tag} a été muté.`,
                [
                    { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Modérateur', value: `${moderator.user.tag}`, inline: true },
                    { name: 'Durée', value: duration, inline: true },
                    { name: 'Raison', value: reason, inline: false }
                ]
            );

            await interaction.reply({ embeds: [muteEmbed] });

            // Envoyer un message privé à l'utilisateur muté
            try {
                const dmEmbed = CustomEmbedBuilder.warning(
                    'Vous avez été muté',
                    `Vous avez été muté sur le serveur **${interaction.guild.name}**`,
                    [
                        { name: 'Durée', value: duration, inline: true },
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
                    const logEmbed = CustomEmbedBuilder.log('Mute', user, moderator.user, reason, duration);
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

            // Programmer le démute automatique
            setTimeout(async () => {
                try {
                    const member = await interaction.guild.members.fetch(user.id);
                    if (member.isCommunicationDisabled()) {
                        await member.timeout(null, 'Mute expiré automatiquement');
                        
                        const unmuteEmbed = CustomEmbedBuilder.info(
                            'Mute Expiré',
                            `${user.tag} a été automatiquement démuté.`,
                            [
                                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                                { name: 'Durée', value: duration, inline: true }
                            ]
                        );

                        // Envoyer le log de démute
                        if (config.logs.enabled && config.logChannelId) {
                            const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
                            if (logChannel) {
                                const logEmbed = CustomEmbedBuilder.log('Démute Automatique', user, client.user, 'Mute expiré', duration);
                                await logChannel.send({ embeds: [logEmbed] });
                            }
                        }
                    }
                } catch (error) {
                    console.log(`Erreur lors du démute automatique de ${user.tag}:`, error);
                }
            }, durationMs);

        } catch (error) {
            console.error('Erreur lors du mute:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Erreur', 'Une erreur s\'est produite lors du mute.')],
                ephemeral: true
            });
        }
    },
}; 
