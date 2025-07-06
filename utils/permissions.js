/**
 * Utilitaire pour vérifier les permissions
 * Développé par AstraxxTv
 */

const config = require('../config.json');

class PermissionChecker {
    static isOwner(userId) {
        return userId === config.ownerId;
    }

    static hasModRole(member) {
        if (!member || !member.roles) return false;
        return member.roles.cache.has(config.modRoleId);
    }

    static hasAdminRole(member) {
        if (!member || !member.roles) return false;
        return member.roles.cache.has(config.adminRoleId);
    }

    static canModerate(member) {
        if (!member) return false;
        return this.isOwner(member.id) || this.hasAdminRole(member) || this.hasModRole(member);
    }

    static canBan(member) {
        if (!member) return false;
        return member.permissions.has('BanMembers') || this.canModerate(member);
    }

    static canKick(member) {
        if (!member) return false;
        return member.permissions.has('KickMembers') || this.canModerate(member);
    }

    static canManageMessages(member) {
        if (!member) return false;
        return member.permissions.has('ManageMessages') || this.canModerate(member);
    }

    static canManageRoles(member) {
        if (!member) return false;
        return member.permissions.has('ManageRoles') || this.canModerate(member);
    }

    static canManageChannels(member) {
        if (!member) return false;
        return member.permissions.has('ManageChannels') || this.canModerate(member);
    }

    static canManageGuild(member) {
        if (!member) return false;
        return member.permissions.has('ManageGuild') || this.canModerate(member);
    }

    static isHigherRole(moderator, target) {
        if (!moderator || !target) return false;
        
        // Le propriétaire peut toujours modérer
        if (this.isOwner(moderator.id)) return true;
        
        // Vérifier la hiérarchie des rôles
        const moderatorHighestRole = moderator.roles.highest;
        const targetHighestRole = target.roles.highest;
        
        return moderatorHighestRole.position > targetHighestRole.position;
    }

    static getPermissionLevel(member) {
        if (!member) return 0;
        
        if (this.isOwner(member.id)) return 5; // Propriétaire
        if (this.hasAdminRole(member)) return 4; // Admin
        if (this.hasModRole(member)) return 3; // Modérateur
        if (member.permissions.has('ManageGuild')) return 2; // Gestionnaire
        if (member.permissions.has('ManageMessages')) return 1; // Utilisateur avec permissions
        
        return 0; // Utilisateur normal
    }
}

module.exports = PermissionChecker; 