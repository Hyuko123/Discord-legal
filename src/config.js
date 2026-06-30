// ============================================
// CONFIGURATION DU BOT
// Modifie ces valeurs ou utilise les variables d'environnement (.env)
// ============================================

module.exports = {
  // Token du bot (mets-le dans le .env, jamais en dur ici)
  TOKEN: process.env.DISCORD_TOKEN,

  // ID du serveur (guild) - optionnel, utile pour enregistrer les commandes plus vite
  GUILD_ID: process.env.GUILD_ID || null,

  // Rôle donné automatiquement à l'arrivée sur le serveur
  CITIZEN_ROLE_ID: "1521208467220725861",

  // Rôle(s) autorisés à accepter/refuser les tickets (staff)
  // Mets un ou plusieurs IDs séparés par une virgule dans la variable d'env STAFF_ROLE_IDS
  // sinon laisse vide pour autoriser tout le monde ayant la permission "Gérer les rôles"
  STAFF_ROLE_IDS: (process.env.STAFF_ROLE_IDS || "1521208970155397262")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),

  // Liste des groupes RP : nom affiché, ID de la catégorie où ranger les tickets, ID du rôle à donner
  GROUPS: [
    {
      key: "f4l",
      label: "F4L",
      emoji: "🔫",
      categoryId: "1521148188621406238",
      roleId: "1521206232927440957",
      leadRoleId: "1521527726048018532",
    },
    {
      key: "ballas",
      label: "BALLAS",
      emoji: "🟣",
      categoryId: "1521148274340270162",
      roleId: "1521206722352517173",
      leadRoleId: "1521527730620076082",
    },
    {
      key: "lsv",
      label: "LOS SANTOS VAGOS",
      emoji: "🟡",
      categoryId: "1521148324479242380",
      roleId: "1521206941945168072",
      leadRoleId: "1521527378214518975",
    },
    {
      key: "marabunta",
      label: "MARABUNTA GRANDE",
      emoji: "🟢",
      categoryId: "1521148402468130988",
      roleId: "1521207095813214270",
      leadRoleId: "1521527407792750773",
    },
    {
      key: "redwoods",
      label: "RED-WOODS",
      emoji: "🔴",
      categoryId: "1521148550396903456",
      roleId: "1521207208065503262",
      leadRoleId: "1521526591778455613",
    },
    {
      key: "bluesky",
      label: "BLUE-SKY",
      emoji: "🔵",
      categoryId: "1521148614167232674",
      roleId: "1521207336994345110",
      leadRoleId: "1521526424341708841",
    },
    {
      key: "lostmc",
      label: "THE LOST MC",
      emoji: "🏍️",
      categoryId: "1521148699600748594",
      roleId: "1521207631291613254",
      leadRoleId: "1521526274630352978",
    },
    {
      key: "oneil",
      label: "FAMILLE O'NEIL",
      emoji: "🍀",
      categoryId: "1521149024093208637",
      roleId: "1521207974243205162",
      leadRoleId: "1521526111094308964",
    },
    {
      key: "medellin",
      label: "CARTEL MEDELLIN",
      emoji: "🌴",
      categoryId: "1521148756966506506",
      roleId: "1521208094292574218",
      leadRoleId: "1521525943644983386",
    },
  ],
};
