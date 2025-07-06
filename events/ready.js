/**
 * Événement Ready
 * Développé par AstraxxTv
 */

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🤖 ${client.user.tag} est maintenant en ligne !`);
        console.log(`👥 Servant ${client.guilds.cache.size} serveurs`);
        console.log(`👤 Servant ${client.users.cache.size} utilisateurs`);
        console.log(`📝 Développé par AstraxxTv`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Définir le statut initial
        client.user.setActivity('les commandes | /help', { type: 'WATCHING' });
    },
}; 