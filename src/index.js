require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  REST,
  Routes,
} = require("discord.js");

const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

// ============================================
// Utilitaires
// ============================================

function isStaff(member) {
  if (config.STAFF_ROLE_IDS.length === 0) {
    // Si aucun rôle staff n'est défini, on se base sur la permission "Gérer les rôles"
    return member.permissions.has(PermissionsBitField.Flags.ManageRoles);
  }
  return member.roles.cache.some((r) => config.STAFF_ROLE_IDS.includes(r.id));
}

function findGroup(key) {
  return config.GROUPS.find((g) => g.key === key);
}

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setTitle("📋 Création de ticket - Embauche")
    .setDescription(
      "Sélectionne l'entreprise pour laquelle tu souhaites postuler.\n\n" +
        "Un salon privé sera créé et le patron / le staff étudiera ta candidature."
    )
    .setColor(0x2b2d31);
}

function buildPanelRow() {
  const select = new StringSelectMenuBuilder()
    .setCustomId("ticket_group_select")
    .setPlaceholder("Choisis une entreprise...")
    .addOptions(
      config.GROUPS.map((g) => ({
        label: g.label,
        value: g.key,
        emoji: g.emoji,
      }))
    );

  return new ActionRowBuilder().addComponents(select);
}

function formatGroupNameForChannel(label) {
  // Garde uniquement la première partie utile, format "Ballas", "LosSantosVagos", etc.
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .replace(/^./, (c) => c.toUpperCase());
}

async function createTicketChannel(guild, member, group) {
  const groupName = formatGroupNameForChannel(group.label);

  // Compte les tickets déjà existants dans la catégorie pour ce groupe afin de numéroter
  const existingTickets = guild.channels.cache.filter(
    (c) =>
      c.parentId === group.categoryId &&
      c.name.startsWith(`rc-${groupName.toLowerCase()}-`)
  );
  const nextNumber = existingTickets.size + 1;
  const channelName = `RC-${groupName}-${String(nextNumber).padStart(2, "0")}`.toLowerCase();

  const overwrites = [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: member.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    },
    {
      id: client.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageRoles,
      ],
    },
  ];

  // Si group.leadOnly est vrai, le staff général n'a pas accès : seul le patron (leadRoleId) voit le ticket
  if (!group.leadOnly) {
    for (const staffRoleId of config.STAFF_ROLE_IDS) {
      overwrites.push({
        id: staffRoleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      });
    }
  }

  // Le Lead du groupe concerné voit toujours le ticket (patron, ou en plus du staff)
  overwrites.push({
    id: group.leadRoleId,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory,
    ],
  });

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: group.categoryId,
    permissionOverwrites: overwrites,
  });

  const embed = new EmbedBuilder()
    .setTitle(`Candidature - ${group.label}`)
    .setDescription(
      `Bienvenue ${member} 👋\n\n` +
        `Tu postules pour rejoindre **${group.label}**.\n` +
        `Merci de te présenter en RP et d'attendre la décision du patron / staff.`
    )
    .setColor(0x2b2d31)
    .setFooter({ text: `Entreprise demandée : ${group.label}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`ticket_accept_${group.key}`)
      .setLabel("Accepter")
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅"),
    new ButtonBuilder()
      .setCustomId(`ticket_refuse_${group.key}`)
      .setLabel("Refuser")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌")
  );

  await channel.send({
    content: `${member}`,
    embeds: [embed],
    components: [row],
  });

  return channel;
}

// ============================================
// Slash command /panel
// ============================================

const commands = [
  new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Envoie le panneau de création de ticket dans ce salon")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .toJSON(),
];

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(config.TOKEN);
  try {
    if (config.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, config.GUILD_ID),
        { body: commands }
      );
      console.log("Commandes slash enregistrées (guild).");
    } else {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
      console.log("Commandes slash enregistrées (global, peut prendre jusqu'à 1h).");
    }
  } catch (err) {
    console.error("Erreur lors de l'enregistrement des commandes :", err);
  }
}

// ============================================
// Events
// ============================================

client.once(Events.ClientReady, async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  await registerCommands();
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await member.roles.add(config.CITIZEN_ROLE_ID);
  } catch (err) {
    console.error(
      `Impossible d'ajouter le rôle Citoyen à ${member.user.tag} :`,
      err.message
    );
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // /panel
    if (interaction.isChatInputCommand() && interaction.commandName === "panel") {
      await interaction.reply({
        embeds: [buildPanelEmbed()],
        components: [buildPanelRow()],
      });
      return;
    }

    // Sélection du groupe -> création du ticket
    if (interaction.isStringSelectMenu() && interaction.customId === "ticket_group_select") {
      await interaction.deferReply({ ephemeral: true });

      const group = findGroup(interaction.values[0]);
      if (!group) {
        return interaction.editReply({ content: "Groupe introuvable." });
      }

      // Empêche un membre d'ouvrir plusieurs tickets pour le même groupe en même temps
      const groupNameForCheck = formatGroupNameForChannel(group.label).toLowerCase();
      const existing = interaction.guild.channels.cache.find(
        (c) =>
          c.parentId === group.categoryId &&
          c.name.startsWith(`rc-${groupNameForCheck}-`) &&
          c.permissionOverwrites.cache.has(interaction.user.id)
      );
      if (existing) {
        return interaction.editReply({
          content: `Tu as déjà un ticket ouvert pour ce groupe : ${existing}`,
        });
      }

      const channel = await createTicketChannel(
        interaction.guild,
        interaction.member,
        group
      );

      await interaction.editReply({
        content: `Ton ticket a été créé : ${channel}`,
      });
      return;
    }

    // Boutons Accepter / Refuser
    if (interaction.isButton()) {
      const [prefix, action, groupKey] = interaction.customId.split("_").length === 3
        ? interaction.customId.split("_")
        : [null, null, null];

      // customId format: ticket_accept_<key> / ticket_refuse_<key>
      if (interaction.customId.startsWith("ticket_accept_") || interaction.customId.startsWith("ticket_refuse_")) {
        const isAccept = interaction.customId.startsWith("ticket_accept_");
        const key = interaction.customId.replace(
          isAccept ? "ticket_accept_" : "ticket_refuse_",
          ""
        );
        const group = findGroup(key);

        if (!group) {
          return interaction.reply({
            content: "Groupe introuvable pour ce ticket.",
            ephemeral: true,
          });
        }

        const isGroupLead = interaction.member.roles.cache.has(group.leadRoleId);
        if (!isStaff(interaction.member) && !isGroupLead) {
          return interaction.reply({
            content: "Tu n'as pas la permission de faire ça.",
            ephemeral: true,
          });
        }

        // On retrouve le membre qui a ouvert le ticket via les permissions du salon
        const channel = interaction.channel;
        const targetOverwrite = channel.permissionOverwrites.cache.find(
          (o) => o.type === 1 && o.id !== client.user.id
        );
        const targetMember = targetOverwrite
          ? await interaction.guild.members.fetch(targetOverwrite.id).catch(() => null)
          : null;

        if (isAccept) {
          if (targetMember) {
            await targetMember.roles.add(group.roleId).catch((e) =>
              console.error("Erreur ajout rôle :", e.message)
            );
          }

          await interaction.reply({
            content: `✅ Candidature **acceptée** par ${interaction.user} pour **${group.label}**.${
              targetMember ? ` Rôle attribué à ${targetMember}.` : ""
            }\nCe salon sera supprimé dans 10 secondes.`,
          });

          setTimeout(() => {
            channel.delete().catch(() => {});
          }, 10_000);
        } else {
          await interaction.reply({
            content: `❌ Candidature **refusée** par ${interaction.user} pour **${group.label}**.\nCe salon sera supprimé dans 10 secondes.`,
          });

          setTimeout(() => {
            channel.delete().catch(() => {});
          }, 10_000);
        }
        return;
      }
    }
  } catch (err) {
    console.error("Erreur interaction :", err);
    if (interaction.isRepliable()) {
      const payload = { content: "Une erreur est survenue.", ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN)
