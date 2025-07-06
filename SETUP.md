# 🚀 Guide de Démarrage Rapide

Ce guide vous aidera à configurer et lancer votre bot Discord de modération en quelques étapes simples.

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (version 16.9.0 ou supérieure)
- Un compte Discord
- Un bot Discord (voir étape 1)

## 🔧 Configuration du Bot Discord

### Étape 1: Créer un Bot Discord

1. Allez sur le [Portail Développeur Discord](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application
4. Allez dans l'onglet "Bot"
5. Cliquez sur "Add Bot"
6. Copiez le **Token** (vous en aurez besoin plus tard)
7. Activez les options suivantes :
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### Étape 2: Inviter le Bot sur votre Serveur

1. Allez dans l'onglet "OAuth2" > "URL Generator"
2. Sélectionnez "bot" dans les scopes
3. Sélectionnez les permissions suivantes :
   - ✅ Administrator (ou les permissions individuelles)
   - ✅ Ban Members
   - ✅ Kick Members
   - ✅ Manage Messages
   - ✅ Manage Roles
   - ✅ Moderate Members
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Use Slash Commands
4. Copiez l'URL générée et ouvrez-la dans votre navigateur
5. Sélectionnez votre serveur et autorisez le bot

## ⚙️ Configuration du Projet

### Étape 3: Installer les Dépendances

```bash
npm install
```

### Étape 4: Configurer le Bot

1. Copiez `config.example.json` vers `config.json`
2. Modifiez `config.json` avec vos informations :

```json
{
  "token": "VOTRE_TOKEN_ICI",
  "clientId": "VOTRE_CLIENT_ID_ICI",
  "guildId": "VOTRE_GUILD_ID_ICI",
  "ownerId": "VOTRE_ID_UTILISATEUR_ICI"
}
```

**Comment obtenir ces informations :**
- **token** : Copié depuis l'étape 1
- **clientId** : ID de l'application (onglet "General Information")
- **guildId** : ID de votre serveur (clic droit sur le serveur > "Copier l'identifiant")
- **ownerId** : Votre ID utilisateur (clic droit sur votre nom > "Copier l'identifiant")

### Étape 5: Configurer les Canaux et Rôles (Optionnel)

Pour utiliser toutes les fonctionnalités, configurez également :

```json
{
  "logChannelId": "ID_CANAL_LOGS",
  "welcomeChannelId": "ID_CANAL_BIENVENUE",
  "modRoleId": "ID_ROLE_MODERATEUR",
  "adminRoleId": "ID_ROLE_ADMIN"
}
```

## 🚀 Lancement du Bot

### Étape 6: Déployer les Commandes

```bash
npm run deploy
```

### Étape 7: Lancer le Bot

```bash
npm start
```

Vous devriez voir :
```
🤖 VotreBot#1234 est maintenant en ligne !
👥 Servant 1 serveurs
👤 Servant 50 utilisateurs
📝 Développé par AstraxxTv
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## ✅ Test des Commandes

Testez que tout fonctionne :

1. `/help` - Affiche la liste des commandes
2. `/serverinfo` - Affiche les informations du serveur
3. `/userinfo` - Affiche vos informations

## 🔧 Configuration Avancée

### Statuts Rotatifs

Le bot change automatiquement son statut. Modifiez dans `config.json` :

```json
{
  "status": {
    "enabled": true,
    "type": "WATCHING",
    "messages": [
      "les membres du serveur",
      "la modération",
      "vos commandes"
    ],
    "interval": 30000
  }
}
```

### Modération Automatique

Activez/désactivez les fonctionnalités dans `config.json` :

```json
{
  "autoMod": {
    "enabled": true,
    "antiSpam": true,
    "antiCaps": true,
    "antiInvite": true,
    "wordFilter": true,
    "bannedWords": ["mot1", "mot2"]
  }
}
```

## 🛠️ Développement

### Mode Développement

```bash
npm run dev
```

### Ajouter une Commande

1. Créez un fichier dans `commands/`
2. Suivez le format des commandes existantes
3. Redéployez : `npm run deploy`

## ❗ Problèmes Courants

### "Token Invalid"
- Vérifiez que votre token est correct
- Régénérez le token si nécessaire

### "Missing Permissions"
- Vérifiez que le bot a les bonnes permissions
- Vérifiez la hiérarchie des rôles

### "Command Not Found"
- Redéployez les commandes : `npm run deploy`
- Vérifiez que le bot est en ligne

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que Node.js est à jour
2. Vérifiez que toutes les dépendances sont installées
3. Vérifiez la configuration dans `config.json`
4. Consultez les logs d'erreur

---

**Développé avec ❤️ par AstraxxTv** 