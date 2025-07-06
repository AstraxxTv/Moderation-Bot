<div align="center">

# 🤖 Bot Discord de Modération Avancé

[![Discord.js](https://img.shields.io/badge/Discord.js-14.14.1-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.9.0+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](package.json)
[![Maintenance](https://img.shields.io/badge/Maintenance-Actif-brightgreen.svg)](https://github.com/AstraxxTv)

> **Un bot Discord professionnel et complet pour la modération de serveurs**  
> Développé avec ❤️ par **AstraxxTv**

[🚀 Installation Rapide](#-installation-rapide) • [📋 Fonctionnalités](#-fonctionnalités) • [⚙️ Configuration](#️-configuration) • [📖 Documentation](#-documentation)

</div>

---

## 🎯 Aperçu

Ce bot Discord offre une solution complète de modération pour vos serveurs Discord. Avec des fonctionnalités avancées de modération automatique, un système de logs détaillé, et une interface utilisateur intuitive, il est conçu pour maintenir un environnement sain et sécurisé pour votre communauté.

### ✨ Points Forts

- 🛡️ **Modération Complète** - Toutes les actions de modération essentielles
- 🤖 **Automatisation Intelligente** - Système anti-spam et filtres automatiques
- 📊 **Analytics Avancées** - Statistiques détaillées et logs complets
- 🎨 **Interface Moderne** - Embeds visuels et interactions intuitives
- ⚡ **Performance Optimisée** - Code efficace et temps de réponse rapide
- 🔧 **Configuration Flexible** - Personnalisation complète via JSON

---

## 📋 Fonctionnalités

### 🛡️ Système de Modération

| Fonctionnalité | Description | Commande |
|----------------|-------------|----------|
| **Bannissement** | Bannir des utilisateurs avec suppression de messages | `/ban` |
| **Expulsion** | Expulser des utilisateurs du serveur | `/kick` |
| **Mute Temporaire** | Muter avec durée personnalisable | `/mute` |
| **Débannissement** | Débannir des utilisateurs | `/unban` |
| **Nettoyage** | Supprimer des messages en masse | `/clear` |

### 🔒 Modération Automatique

- **🛡️ Anti-Spam** - Détection intelligente du spam
- **📢 Anti-Caps** - Limitation des messages en majuscules
- **🔗 Anti-Lien** - Contrôle des liens (optionnel)
- **🎫 Anti-Invite** - Blocage des invitations Discord
- **🚫 Filtre de Mots** - Liste de mots interdits personnalisable

### 📊 Informations et Analytics

- **👤 Profils Utilisateurs** - Informations détaillées avec badges
- **🏠 Statistiques Serveur** - Données complètes du serveur
- **📝 Système de Logs** - Traçabilité de toutes les actions
- **📈 Système de Niveaux** - Progression des membres

### 🎉 Fonctionnalités Communautaires

- **👋 Système de Bienvenue** - Messages personnalisables
- **🎭 Rôles Automatiques** - Attribution automatique
- **🔄 Statuts Rotatifs** - Statuts dynamiques du bot
- **📨 Messages Privés** - Notifications automatiques

---

## 🚀 Installation Rapide

### 📋 Prérequis

- [Node.js](https://nodejs.org/) 16.9.0 ou supérieur
- Un bot Discord avec les permissions appropriées
- Git installé sur votre système

### ⚡ Installation en 5 Étapes

<details>
<summary><b>1️⃣ Cloner le Repository</b></summary>

```bash
git clone https://github.com/AstraxxTv/moderation-bot.git
cd moderation-bot
```

</details>

<details>
<summary><b>2️⃣ Installer les Dépendances</b></summary>

```bash
npm install
```

</details>

<details>
<summary><b>3️⃣ Configuration du Bot Discord</b></summary>

1. Allez sur le [Portail Développeur Discord](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Activez les intents suivants :
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
4. Copiez le **Token** et **Client ID**

</details>

<details>
<summary><b>4️⃣ Configuration du Projet</b></summary>

```bash
# Copier le fichier de configuration
cp config.example.json config.json

# Éditer la configuration
nano config.json  # ou votre éditeur préféré
```

Remplissez les informations essentielles :
```json
{
  "token": "VOTRE_TOKEN_DISCORD",
  "clientId": "VOTRE_CLIENT_ID",
  "guildId": "VOTRE_GUILD_ID",
  "ownerId": "VOTRE_ID_UTILISATEUR"
}
```

</details>

<details>
<summary><b>5️⃣ Lancement</b></summary>

```bash
# Déployer les commandes slash
npm run deploy

# Lancer le bot
npm start
```

</details>

---

## ⚙️ Configuration

### 🔧 Fichier de Configuration Principal

Le fichier `config.json` permet une personnalisation complète :

```json
{
  "token": "VOTRE_TOKEN_DISCORD",
  "clientId": "VOTRE_CLIENT_ID",
  "guildId": "VOTRE_GUILD_ID",
  "ownerId": "VOTRE_ID_UTILISATEUR",
  
  "embedColor": "#0099ff",
  "embedErrorColor": "#ff0000",
  "embedSuccessColor": "#00ff00",
  "embedWarningColor": "#ffff00",
  
  "logChannelId": "ID_CANAL_LOGS",
  "welcomeChannelId": "ID_CANAL_BIENVENUE",
  "modRoleId": "ID_ROLE_MODERATEUR",
  "adminRoleId": "ID_ROLE_ADMIN",
  "autoRoleId": "ID_ROLE_AUTO"
}
```

### 🎛️ Configuration des Statuts

```json
{
  "status": {
    "enabled": true,
    "type": "WATCHING",
    "messages": [
      "les membres du serveur",
      "la modération",
      "les commandes",
      "la sécurité"
    ],
    "interval": 30000
  }
}
```

### 🛡️ Configuration de la Modération Automatique

```json
{
  "autoMod": {
    "enabled": true,
    "antiSpam": true,
    "antiCaps": true,
    "antiLink": false,
    "antiInvite": true,
    "wordFilter": true,
    "bannedWords": ["mot1", "mot2", "mot3"]
  }
}
```

---

## 📖 Documentation

### 📋 Commandes Disponibles

#### 🛡️ Modération
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/ban` | Bannir un utilisateur | `BanMembers` |
| `/kick` | Expulser un utilisateur | `KickMembers` |
| `/mute` | Muter un utilisateur | `ModerateMembers` |
| `/unban` | Débannir un utilisateur | `BanMembers` |
| `/clear` | Supprimer des messages | `ManageMessages` |

#### ℹ️ Informations
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/userinfo` | Informations utilisateur | Aucune |
| `/serverinfo` | Informations serveur | Aucune |
| `/help` | Aide et documentation | Aucune |

### 🔐 Permissions Requises

Le bot nécessite les permissions suivantes pour fonctionner correctement :

- **`BanMembers`** - Bannir et débannir des utilisateurs
- **`KickMembers`** - Expulser des utilisateurs
- **`ManageMessages`** - Supprimer des messages
- **`ManageRoles`** - Gérer les rôles
- **`ModerateMembers`** - Muter des utilisateurs
- **`SendMessages`** - Envoyer des messages
- **`EmbedLinks`** - Utiliser les embeds
- **`UseSlashCommands`** - Utiliser les commandes slash

---

## 🛠️ Développement

### 📁 Structure du Projet

```
moderation-bot/
├── 📁 commands/          # Commandes slash
│   ├── ban.js           # Commande de bannissement
│   ├── kick.js          # Commande d'expulsion
│   ├── mute.js          # Commande de mute
│   ├── unban.js         # Commande de débannissement
│   ├── clear.js         # Commande de nettoyage
│   ├── userinfo.js      # Informations utilisateur
│   ├── serverinfo.js    # Informations serveur
│   └── help.js          # Système d'aide
├── 📁 events/           # Événements Discord
│   ├── ready.js         # Événement de démarrage
│   ├── guildMemberAdd.js # Arrivée de membres
│   ├── guildMemberRemove.js # Départ de membres
│   └── messageCreate.js # Création de messages
├── 📁 utils/            # Utilitaires
│   ├── embedBuilder.js  # Constructeur d'embeds
│   └── permissions.js   # Gestion des permissions
├── ⚙️ config.json       # Configuration principale
├── 🚀 index.js          # Point d'entrée
├── 📦 package.json      # Dépendances
└── 📚 README.md         # Documentation
```

### 🔧 Scripts Disponibles

```bash
npm start          # Lancer le bot en production
npm run dev        # Lancer en mode développement
npm run deploy     # Déployer les commandes slash
```

### 📝 Ajouter une Nouvelle Commande

1. **Créer le fichier** dans `commands/`
2. **Suivre le format** des commandes existantes
3. **Redéployer** avec `npm run deploy`

Exemple de structure :
```javascript
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ma-commande')
        .setDescription('Description de ma commande'),
    
    async execute(interaction, client) {
        // Logique de la commande
    },
};
```

---

## 📊 Statistiques

<div align="center">

| Métrique | Valeur |
|----------|--------|
| **Commandes** | 8 |
| **Événements** | 4 |
| **Fonctionnalités** | 15+ |
| **Lignes de Code** | 2000+ |
| **Dépendances** | 7 |

</div>

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

### 🔄 Workflow de Contribution

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Commiter** vos changements
   ```bash
   git commit -m 'feat: ajouter une nouvelle fonctionnalité'
   ```
4. **Pousser** vers la branche
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
5. **Ouvrir** une Pull Request

### 📋 Guidelines

- Suivez les conventions de nommage
- Ajoutez des commentaires pour le code complexe
- Testez vos modifications
- Mettez à jour la documentation si nécessaire

---

## 🐛 Support et Dépannage

### ❗ Problèmes Courants

<details>
<summary><b>Token Invalid</b></summary>

- Vérifiez que votre token est correct
- Régénérez le token si nécessaire
- Assurez-vous que le bot n'est pas déjà connecté ailleurs

</details>

<details>
<summary><b>Missing Permissions</b></summary>

- Vérifiez que le bot a les bonnes permissions
- Vérifiez la hiérarchie des rôles
- Assurez-vous que le bot est au-dessus des rôles à gérer

</details>

<details>
<summary><b>Command Not Found</b></summary>

- Redéployez les commandes : `npm run deploy`
- Vérifiez que le bot est en ligne
- Attendez quelques minutes pour la propagation

</details>

### 📞 Obtenir de l'Aide

- **🐛 Issues** : [Ouvrir une issue](https://github.com/AstraxxTv/moderation-bot/issues)
- **💬 Discord** : Rejoignez notre serveur de support
- **📧 Email** : Contactez-nous directement

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License - Copyright (c) 2024 AstraxxTv

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

---

## 👨‍💻 Développeur

<div align="center">

**AstraxxTv** - Développeur Principal

[![GitHub](https://img.shields.io/badge/GitHub-AstraxxTv-black?style=for-the-badge&logo=github)](https://github.com/AstraxxTv)
[![Discord](https://img.shields.io/badge/Discord-AstraxxTv-7289DA?style=for-the-badge&logo=discord)](https://discord.gg/votre-serveur)

</div>

---

<div align="center">

### ⭐ Si ce projet vous plaît, n'oubliez pas de le star !

**Développé avec ❤️ par AstraxxTv**

[Retour en haut](#-bot-discord-de-modération-avancé)

</div> 