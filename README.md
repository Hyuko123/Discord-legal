# Discord Ticket Bot - GTA RP

Bot Discord pour la gestion des candidatures (tickets) et l'attribution automatique des rôles, pour un serveur GTA 5 RP.

## Fonctionnalités

- `/panel` : envoie un message avec un menu déroulant listant les 9 groupes/familles.
- Quand un membre choisit un groupe, un salon privé est créé dans la bonne catégorie, visible uniquement par lui (+ staff).
- Le salon contient un embed avec deux boutons :
  - **Accepter** : ajoute le rôle du groupe au membre, puis supprime le ticket après 10 secondes.
  - **Refuser** : supprime le ticket après 10 secondes.
- À l'arrivée d'un membre sur le serveur, le rôle **Citoyen** lui est automatiquement attribué.
- Seuls les membres ayant un rôle staff configuré (ou la permission "Gérer les rôles") peuvent Accepter/Refuser.

## Installation locale

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Copier `.env.example` en `.env` et remplir :
   ```
   DISCORD_TOKEN=ton_token
   GUILD_ID=id_de_ton_serveur
   STAFF_ROLE_IDS=id_role_staff_1,id_role_staff_2
   ```
3. Lancer le bot :
   ```bash
   npm start
   ```
4. Dans un salon du serveur, taper `/panel` pour envoyer le panneau de candidature.

## Configuration des rôles/catégories

Tout est centralisé dans `src/config.js` : ID des catégories de tickets, ID des rôles de groupe, ID du rôle Citoyen. Modifie ce fichier si tu changes la structure de ton serveur.

## Permissions requises pour le bot (Developer Portal)

Lors de la création du lien d'invitation, coche au minimum :
- `bot`
- `applications.commands`

Et dans les permissions du bot :
- Gérer les salons (Manage Channels)
- Gérer les rôles (Manage Roles) — **le rôle du bot doit être positionné au-dessus de tous les rôles de groupe et du rôle Citoyen dans la hiérarchie des rôles du serveur**
- Voir les salons, Envoyer des messages, Intégrer des liens, Gérer les messages

N'oublie pas d'activer l'intent **Server Members Intent** dans le Developer Portal (onglet Bot), sinon l'attribution automatique du rôle Citoyen à l'arrivée ne fonctionnera pas.

## Déploiement sur Railway

1. Pousse ce projet sur un repo GitHub.
2. Sur [Railway](https://railway.app), crée un nouveau projet "Deploy from GitHub repo" et sélectionne ce repo.
3. Dans l'onglet **Variables**, ajoute :
   - `DISCORD_TOKEN`
   - `GUILD_ID`
   - `STAFF_ROLE_IDS` (optionnel)
4. Railway détecte automatiquement `npm start` grâce au `package.json`. Déploie, et c'est en ligne.

## Notes

- Si tu modifies la liste des groupes dans `src/config.js`, le menu déroulant et les boutons se mettront à jour automatiquement (les `customId` des boutons sont générés à partir de la clé `key` du groupe).
- Le bot identifie le membre propriétaire d'un ticket grâce aux permissions du salon (overwrite autre que le bot), donc ne change pas manuellement les permissions du salon de ticket.
