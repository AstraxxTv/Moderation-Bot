/**
 * Commande d'aide
 * Développé par AstraxxTv
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Afficher la liste des commandes disponibles')
        .addStringOption(option =>
            option.setName('commande')
                .setDescription('Nom de la commande pour plus de détails')
                .setRequired(false)),

    cooldown: 3,

    async execute(interaction, client) {
        const commandName = interaction.options.getString('commande');
        
        if (commandName) {
            // Afficher les détails d'une commande spécifique
            const command = client.commands.get(commandName);
            
            if (!command) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Commande Non Trouvée')
                        .setDescription(`La commande \`${commandName}\` n'existe pas.`)
                        .setTimestamp()
                        .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' })],
                    ephemeral: true
                });
            }

            const commandEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`📖 Aide: /${command.data.name}`)
                .setDescription(command.data.description || 'Aucune description disponible.')
                .addFields(
                    { name: 'Cooldown', value: `${command.cooldown || 3} secondes`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

            await interaction.reply({ embeds: [commandEmbed] });
            return;
        }

        // Afficher la liste générale des commandes
        const categories = {
            '🛡️ Modération': ['ban', 'kick', 'mute', 'unban', 'clear'],
            'ℹ️ Informations': ['userinfo', 'serverinfo'],
            '🔧 Utilitaires': ['help']
        };

        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🤖 Bot de Modération - Aide')
            .setDescription('Voici la liste des commandes disponibles. Utilisez `/help <commande>` pour plus de détails.')
            .setTimestamp()
            .setFooter({ text: 'Développé par AstraxxTv', iconURL: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png' });

        for (const [category, commands] of Object.entries(categories)) {
            const commandList = commands
                .map(cmd => {
                    const command = client.commands.get(cmd);
                    return command ? `\`/${command.data.name}\` - ${command.data.description}` : null;
                })
                .filter(cmd => cmd !== null)
                .join('\n');

            if (commandList) {
                helpEmbed.addFields({
                    name: category,
                    value: commandList,
                    inline: false
                });
            }
        }

        helpEmbed.addFields({
            name: '📝 Informations',
            value: '• Toutes les commandes utilisent le système slash (/) de Discord\n• Certaines commandes nécessitent des permissions spécifiques\n• Le bot inclut un système de modération automatique',
            inline: false
        });

        await interaction.reply({ embeds: [helpEmbed] });
    },
}; 