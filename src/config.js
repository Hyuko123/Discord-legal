// ============================================
// CONFIGURATION DU BOT - SECTEUR LÉGAL
// Modifie ces valeurs ou utilise les variables d'environnement (.env)
// ============================================

module.exports = {
  // Token du bot (mets-le dans le .env, jamais en dur ici)
  TOKEN: process.env.DISCORD_TOKEN,

  // ID du serveur (guild) - optionnel, utile pour enregistrer les commandes plus vite
  GUILD_ID: process.env.GUILD_ID || "1520861790559408128",

  // Rôle donné automatiquement à l'arrivée sur le serveur
  CITIZEN_ROLE_ID: "1521208467220725861",

  // Rôle(s) autorisés à accepter/refuser les tickets (staff)
  STAFF_ROLE_IDS: (process.env.STAFF_ROLE_IDS || "1521134616952700938")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),

  // Liste des entreprises légales : nom affiché, ID de la catégorie où ranger les tickets,
  // ID du rôle employé donné à l'acceptation, ID du rôle patron (lead) pouvant gérer les tickets
  GROUPS: [
    {
      key: "burgershot",
      label: "BURGER SHOT",
      emoji: "🍔",
      categoryId: "1520865208585945238",
      roleId: "1521103193545642084",
      leadRoleId: "1521528779594272860",
    },
    {
      key: "aldente",
      label: "AL DENTE",
      emoji: "🍝",
      categoryId: "1520865325967740969",
      roleId: "1521103339784372378",
      leadRoleId: "1521529012348780655",
    },
    {
      key: "pearlhookies",
      label: "PEARL / HOOKIES",
      emoji: "🦪",
      categoryId: "1520865368032153833",
      roleId: "1521103440632348683",
      leadRoleId: "1521529584292462784",
    },
    {
      key: "restaurantnord",
      label: "RESTAURANT NORD",
      emoji: "🍽️",
      categoryId: "1520865404761673951",
      roleId: "1521103600221163591",
      leadRoleId: "1521529774458146836",
    },
    {
      key: "redlinegarage",
      label: "REDLINE GARAGE",
      emoji: "🔧",
      categoryId: "1520866607424082121",
      roleId: "1521104205480464384",
      leadRoleId: "1521529931216195697",
    },
    {
      key: "speedgarage",
      label: "SPEED GARAGE",
      emoji: "🏎️",
      categoryId: "1520866646347223141",
      roleId: "1521104627305811979",
      leadRoleId: "1521530060857671680",
    },
    {
      key: "pdm",
      label: "PDM",
      emoji: "🚗",
      categoryId: "1520866683177271406",
      roleId: "1521104747161980968",
      leadRoleId: "1521530175815159879",
    },
    {
      key: "bennys",
      label: "BENNY'S",
      emoji: "🛠️",
      categoryId: "1520866729394438144",
      roleId: "1521104945531588629",
      leadRoleId: "1521530340777263285",
    },
    {
      key: "dynasty8",
      label: "DYNASTY 8",
      emoji: "🏠",
      categoryId: "1520867599364132915",
      roleId: "1521105211115180185",
      leadRoleId: "1521530440492781578",
    },
    {
      key: "youtool",
      label: "YOUTOOL",
      emoji: "🧰",
      categoryId: "1520868231416381641",
      roleId: "1521105514551971870",
      leadRoleId: "1521530612559646870",
    },
    {
      key: "bahamas",
      label: "BAHAMAS",
      emoji: "🏝️",
      categoryId: "1520868301444485290",
      roleId: "1521105749336391690",
      leadRoleId: "1521530746970308789",
    },
    {
      key: "unicorn",
      label: "UNICORN",
      emoji: "🦄",
      categoryId: "1520868364866818100",
      roleId: "1521105925912400134",
      leadRoleId: "1521530877996437575",
    },
    {
      key: "ltdgroovestreet",
      label: "LTD GROOVE STREET",
      emoji: "🏪",
      categoryId: "1520868412627095724",
      roleId: "1521106048356843573",
      leadRoleId: "1521530991687241969",
    },
    {
      key: "ltdlittleseoul",
      label: "LTD LITTLE SÉOUL",
      emoji: "🏪",
      categoryId: "1520868456222691398",
      roleId: "1521106493511041184",
      leadRoleId: "1521531213284769934",
    },
    {
      key: "ltdsandyshores",
      label: "LTD SANDY SHORES",
      emoji: "🏪",
      categoryId: "1520868497595568299",
      roleId: "1521106597953273877",
      leadRoleId: "1521531353386979498",
    },
    {
      key: "ltdpaletobay",
      label: "LTD PALETO BAY",
      emoji: "🏪",
      categoryId: "1520868537034473615",
      roleId: "1521106668182704289",
      leadRoleId: "1521531454109122570",
    },
    {
      key: "pawnshop",
      label: "PAWN SHOP",
      emoji: "💰",
      categoryId: "1522236600707453109",
      roleId: "1522236895764021391",
      leadRoleId: "1522236937652535416",
    },
    {
      key: "hookies",
      label: "HOOKIES",
      emoji: "🦪",
      categoryId: "1522184746585686109",
      roleId: "1522185091290239088",
      leadRoleId: "1522185097866903572",
    },
  ],
};
