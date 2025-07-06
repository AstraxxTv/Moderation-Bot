/**
 * Commande de suppression de messages
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedBuilder = require('../utils/embedBuilder');
const PermissionChecker = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer un nombre spécifique de messages')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Supprimer seulement les messages de cet utilisateur')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    cooldown: 5,

    async execute(interaction, client) {
        const amount = interaction.options.getInteger('nombre');
        const targetUser = interaction.options.getUser('utilisateur');
        const moderator = interaction.member;

        // Vérifications de permissions
        if (!PermissionChecker.canManageMessages(moderator)) {
            return interaction.reply({
                embeds: [EmbedBuilder.error('Permission Refusée', 'Vous n\'avez pas la permission de supprimer des messages.')],
                ephemeral: true
            });
        }

        try {
            // Récupérer les messages
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            
            let messagesToDelete = messages;

            // Filtrer par utilisateur si spécifié
            if (targetUser) {
                messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
            }

            // Limiter le nombre de messages à supprimer
            const messagesToDeleteArray = Array.from(messagesToDelete.values()).slice(0, amount);

            if (messagesToDeleteArray.length === 0) {
                return interaction.reply({
                    embeds: [EmbedBuilder.warning('Aucun Message', 'Aucun message à supprimer trouvé.')],
                    ephemeral: true
                });
            }

            // Supprimer les messages
            const deletedMessages = await interaction.channel.bulkDelete(messagesToDeleteArray, true);

            // Créer l'embed de confirmation
            const clearEmbed = EmbedBuilder.success(
                'Messages Supprimés',
                `${deletedMessages.size} message(s) ont été supprimés.`,
                [
                    { name: 'Canal', value: `${interaction.channel.name}`, inline: true },
                    { name: 'Modérateur', value: `${moderator.user.tag}`, inline: true }
                ]
            );

            if (targetUser) {
                clearEmbed.addFields({ name: 'Utilisateur Ciblé', value: `${targetUser.tag}`, inline: true });
            }

            await interaction.reply({ embeds: [clearEmbed] });

            // Supprimer le message de confirmation après 5 secondes
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    console.log('Impossible de supprimer le message de confirmation:', error);
                }
            }, 5000);

        } catch (error) {
            console.error('Erreur lors de la suppression des messages:', error);
            
            if (error.code === 50034) {
                await interaction.reply({
                    embeds: [EmbedBuilder.error('Erreur', 'Impossible de supprimer des messages de plus de 14 jours.')],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    embeds: [EmbedBuilder.error('Erreur', 'Une erreur s\'est produite lors de la suppression des messages.')],
                    ephemeral: true
                });
            }
        }
    },
}; 