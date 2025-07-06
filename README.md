# 🤖 Bot Discord de Modération Avancé

Un bot Discord professionnel et complet pour la modération de serveurs, développé par **AstraxxTv**.

## ✨ Fonctionnalités

### 🛡️ Modération
- **Bannissement** - Bannir des utilisateurs avec suppression de messages
- **Expulsion** - Expulser des utilisateurs du serveur
- **Mute temporaire** - Muter des utilisateurs avec durée personnalisable
- **Débannissement** - Débannir des utilisateurs
- **Suppression de messages** - Supprimer des messages en masse
- **Système de permissions** - Vérification automatique des permissions

### 🔒 Modération Automatique
- **Anti-spam** - Détection et prévention du spam
- **Anti-caps** - Limitation des messages en majuscules
- **Anti-lien** - Contrôle des liens (optionnel)
- **Anti-invite** - Blocage des invitations Discord
- **Filtre de mots** - Liste de mots interdits personnalisable

### 📊 Informations
- **Informations utilisateur** - Profils détaillés avec badges et permissions
- **Informations serveur** - Statistiques complètes du serveur
- **Système de logs** - Logs détaillés de toutes les actions

### 🎉 Fonctionnalités Communautaires
- **Système de bienvenue** - Messages de bienvenue personnalisables
- **Attribution automatique de rôles** - Rôles automatiques pour nouveaux membres
- **Statuts rotatifs** - Statuts du bot qui changent automatiquement
- **Système de niveaux** - Système d'expérience (base)

## 🚀 Installation

### Prérequis
- Node.js 16.9.0 ou supérieur
- Un bot Discord avec les permissions appropriées

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/moderation-bot.git
   cd moderation-bot
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer le bot**
   - Ouvrir `config.json`
   - Remplacer toutes les valeurs par vos propres informations
   - Obtenir votre token Discord sur le [Portail Développeur Discord](https://discord.com/developers/applications)

4. **Déployer les commandes slash**
   ```bash
   npm run deploy
   ```

5. **Lancer le bot**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Fichier config.json

```json
{
  "token": "VOTRE_TOKEN_DISCORD_ICI",
  "clientId": "VOTRE_CLIENT_ID_ICI",
  "guildId": "VOTRE_GUILD_ID_ICI",
  "prefix": "!",
  "embedColor": "#0099ff",
  "embedErrorColor": "#ff0000",
  "embedSuccessColor": "#00ff00",
  "embedWarningColor": "#ffff00",
  "ownerId": "VOTRE_ID_UTILISATEUR_ICI",
  "logChannelId": "ID_CANAL_LOGS_ICI",
  "welcomeChannelId": "ID_CANAL_BIENVENUE_ICI",
  "modRoleId": "ID_ROLE_MODERATEUR_ICI",
  "adminRoleId": "ID_ROLE_ADMIN_ICI",
  "mutedRoleId": "ID_ROLE_MUTE_ICI",
  "autoRoleId": "ID_ROLE_AUTO_ICI"
}
```

### Permissions Requises

Le bot nécessite les permissions suivantes :
- `BanMembers` - Pour bannir/débannir
- `KickMembers` - Pour expulser
- `ManageMessages` - Pour supprimer des messages
- `ManageRoles` - Pour gérer les rôles
- `ModerateMembers` - Pour muter
- `SendMessages` - Pour envoyer des messages
- `EmbedLinks` - Pour les embeds
- `UseSlashCommands` - Pour les commandes slash

## 📋 Commandes

### Modération
- `/ban <utilisateur> [raison] [jours]` - Bannir un utilisateur
- `/kick <utilisateur> [raison]` - Expulser un utilisateur
- `/mute <utilisateur> <durée> [raison]` - Muter un utilisateur
- `/unban <utilisateur_id> [raison]` - Débannir un utilisateur
- `/clear <nombre> [utilisateur]` - Supprimer des messages

### Informations
- `/userinfo [utilisateur]` - Afficher les informations d'un utilisateur
- `/serverinfo` - Afficher les informations du serveur
- `/help [commande]` - Afficher l'aide

## 🔧 Fonctionnalités Avancées

### Système de Statuts Rotatifs
Le bot change automatiquement son statut selon la configuration :
```json
{
  "status": {
    "enabled": true,
    "type": "WATCHING",
    "messages": [
      "les membres du serveur",
      "la modération",
      "les commandes"
    ],
    "interval": 30000
  }
}
```

### Système de Logs
Toutes les actions de modération sont automatiquement loggées dans le canal configuré.

### Modération Automatique
Le bot surveille automatiquement les messages et applique les règles configurées.

## 🛠️ Développement

### Structure du Projet
```
moderation-bot/
├── commands/          # Commandes slash
├── events/           # Événements Discord
├── utils/            # Utilitaires
├── config.json       # Configuration
├── index.js          # Point d'entrée
├── deploy-commands.js # Déploiement des commandes
└── package.json      # Dépendances
```

### Ajouter une Nouvelle Commande

1. Créer un fichier dans `commands/`
2. Exporter un objet avec `data` et `execute`
3. Redéployer les commandes avec `npm run deploy`

### Ajouter un Nouvel Événement

1. Créer un fichier dans `events/`
2. Exporter un objet avec `name` et `execute`
3. Le bot chargera automatiquement l'événement

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développeur

**AstraxxTv** - Développeur principal

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter AstraxxTv sur Discord

## 🔄 Mises à Jour

### Version 1.0.0
- ✅ Système de modération complet
- ✅ Modération automatique
- ✅ Système de logs
- ✅ Commandes d'informations
- ✅ Système de bienvenue
- ✅ Statuts rotatifs

---

**Développé avec ❤️ par AstraxxTv** 