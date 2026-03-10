import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL!;
console.log("Connecting to:", url.replace(/:[^:@]+@/, ":***@"));
const pool = new pg.Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Orchestra Tracker...");

  // ─── Team Members ────────────────────────────────────────

  const sarah = await prisma.teamMember.upsert({
    where: { email: "sarah@orchestra.dev" },
    update: {},
    create: {
      name: "Sarah Martin",
      email: "sarah@orchestra.dev",
      role: "Lead / Project Manager",
      avatar: null,
    },
  });

  const max = await prisma.teamMember.upsert({
    where: { email: "max@orchestra.dev" },
    update: {},
    create: {
      name: "Max Dupont",
      email: "max@orchestra.dev",
      role: "Full-Stack Developer",
      avatar: null,
    },
  });

  const alex = await prisma.teamMember.upsert({
    where: { email: "alex@orchestra.dev" },
    update: {},
    create: {
      name: "Alex Lefèvre",
      email: "alex@orchestra.dev",
      role: "Designer / Commercial",
      avatar: null,
    },
  });

  console.log("  ✅ 3 team members created");

  // ─── Categories ──────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "billing", emoji: "💰", color: "green", isCustom: false },
    }),
    prisma.category.create({
      data: { name: "admin", emoji: "📋", color: "blue", isCustom: false },
    }),
    prisma.category.create({
      data: { name: "sales", emoji: "🤝", color: "violet", isCustom: false },
    }),
    prisma.category.create({
      data: { name: "marketing", emoji: "📢", color: "orange", isCustom: false },
    }),
    prisma.category.create({
      data: { name: "other", emoji: "⚙️", color: "gray", isCustom: false },
    }),
  ]);

  const [billing, admin, sales, marketing, other] = categories;
  console.log("  ✅ 5 default categories created");

  // ─── Clients ─────────────────────────────────────────────

  const acme = await prisma.client.create({
    data: {
      name: "Acme Corp",
      email: "contact@acme.com",
      phone: "+33 1 23 45 67 89",
      company: "Acme Corporation",
      notes: "Client fidèle depuis 2024. Projets web et e-commerce.",
    },
  });

  const betaCorp = await prisma.client.create({
    data: {
      name: "BetaCorp",
      email: "hello@betacorp.io",
      phone: "+33 6 12 34 56 78",
      company: "BetaCorp SAS",
      notes: "Start-up tech, projets mobile.",
    },
  });

  const novaTech = await prisma.client.create({
    data: {
      name: "NovaTech",
      email: "info@novatech.fr",
      phone: "+33 1 98 76 54 32",
      company: "NovaTech Industries",
      notes: "Grand compte, contrat maintenance + consulting.",
    },
  });

  console.log("  ✅ 3 clients created");

  // ─── Projects ────────────────────────────────────────────

  const acmeShop = await prisma.project.create({
    data: {
      name: "Site E-commerce",
      clientId: acme.id,
      status: "en_cours",
      startDate: new Date("2026-01-15"),
      dueDate: new Date("2026-04-15"),
      budget: 15000,
      monthlyCost: 250,
      annualCost: 3000,
      tags: ["e-commerce", "site-web"],
      notes: "Refonte complète de la boutique en ligne.",
    },
  });

  const acmeBranding = await prisma.project.create({
    data: {
      name: "Refonte Branding",
      clientId: acme.id,
      status: "termine",
      startDate: new Date("2025-09-01"),
      dueDate: new Date("2025-12-15"),
      budget: 8000,
      tags: ["branding"],
    },
  });

  const betaApp = await prisma.project.create({
    data: {
      name: "App Mobile MVP",
      clientId: betaCorp.id,
      status: "en_cours",
      startDate: new Date("2026-02-01"),
      dueDate: new Date("2026-06-30"),
      budget: 25000,
      monthlyCost: 800,
      tags: ["app-mobile"],
      notes: "MVP React Native pour iOS et Android.",
    },
  });

  const betaSite = await prisma.project.create({
    data: {
      name: "Landing Page",
      clientId: betaCorp.id,
      status: "en_recette",
      startDate: new Date("2026-01-10"),
      dueDate: new Date("2026-02-28"),
      budget: 3500,
      tags: ["site-web"],
    },
  });

  const novaMaintenance = await prisma.project.create({
    data: {
      name: "Contrat Maintenance 2026",
      clientId: novaTech.id,
      status: "en_cours",
      startDate: new Date("2026-01-01"),
      dueDate: new Date("2026-12-31"),
      budget: 12000,
      monthlyCost: 1000,
      annualCost: 12000,
      tags: ["maintenance"],
    },
  });

  const novaConsulting = await prisma.project.create({
    data: {
      name: "Audit UX & Performance",
      clientId: novaTech.id,
      status: "nouveau",
      budget: 6000,
      tags: ["consulting"],
      notes: "Phase de devis — réunion de cadrage prévue.",
    },
  });

  const novaIntranet = await prisma.project.create({
    data: {
      name: "Intranet RH",
      clientId: novaTech.id,
      status: "nouveau",
      startDate: new Date("2025-11-01"),
      dueDate: new Date("2026-05-01"),
      budget: 20000,
      annualCost: 5000,
      tags: ["site-web"],
      notes: "En attente — validation budget interne NovaTech.",
    },
  });

  console.log("  ✅ 7 projects created");

  // ─── Tasks ───────────────────────────────────────────────

  await prisma.task.createMany({
    data: [
      // Billing tasks
      {
        title: "Envoyer facture Acme #003",
        status: "todo",
        priority: "urgent",
        categoryId: billing.id,
        assigneeId: sarah.id,
        projectId: acmeShop.id,
      },
      {
        title: "Relancer paiement BetaCorp landing",
        status: "todo",
        priority: "normal",
        categoryId: billing.id,
        assigneeId: sarah.id,
        projectId: betaSite.id,
      },
      {
        title: "Faire point compta mensuel",
        description: "Réconciliation mars 2026",
        status: "in_progress",
        priority: "normal",
        categoryId: billing.id,
        assigneeId: sarah.id,
        projectId: null, // 🏢 Orchestra interne
      },
      // Admin tasks
      {
        title: "Mettre à jour contrat NovaTech",
        status: "todo",
        priority: "normal",
        categoryId: admin.id,
        assigneeId: sarah.id,
        projectId: novaMaintenance.id,
      },
      {
        title: "Renouveler licence Figma équipe",
        status: "done",
        priority: "low",
        categoryId: admin.id,
        assigneeId: alex.id,
        projectId: null,
      },
      // Sales tasks
      {
        title: "Préparer devis Audit UX NovaTech",
        description: "Inclure audit Lighthouse + recommandations UX",
        status: "in_progress",
        priority: "urgent",
        categoryId: sales.id,
        assigneeId: alex.id,
        projectId: novaConsulting.id,
      },
      {
        title: "Appel découverte prospect Zenith",
        status: "todo",
        priority: "normal",
        categoryId: sales.id,
        assigneeId: alex.id,
        projectId: null,
      },
      // Marketing tasks
      {
        title: "Rédiger case study Acme Branding",
        status: "todo",
        priority: "low",
        categoryId: marketing.id,
        assigneeId: alex.id,
        projectId: acmeBranding.id,
      },
      {
        title: "Mettre à jour portfolio site Orchestra",
        status: "todo",
        priority: "low",
        categoryId: marketing.id,
        assigneeId: max.id,
        projectId: null,
      },
      // Dev / Other tasks
      {
        title: "Setup CI/CD pipeline BetaCorp app",
        description: "GitHub Actions + Expo EAS Build",
        status: "in_progress",
        priority: "urgent",
        categoryId: other.id,
        assigneeId: max.id,
        projectId: betaApp.id,
      },
      {
        title: "Review PR landing page BetaCorp",
        status: "todo",
        priority: "normal",
        categoryId: other.id,
        assigneeId: max.id,
        projectId: betaSite.id,
      },
    ],
  });

  console.log("  ✅ 11 tasks created");

  // ─── Invoices (sample) ───────────────────────────────────

  await prisma.invoice.createMany({
    data: [
      {
        projectId: acmeShop.id,
        number: "ACME-2026-001",
        amount: 5000,
        status: "paid",
        dueDate: new Date("2026-02-15"),
        sentDate: new Date("2026-01-20"),
        paidDate: new Date("2026-02-10"),
      },
      {
        projectId: acmeShop.id,
        number: "ACME-2026-002",
        amount: 5000,
        status: "sent",
        dueDate: new Date("2026-03-15"),
        sentDate: new Date("2026-02-20"),
      },
      {
        projectId: acmeShop.id,
        number: "ACME-2026-003",
        amount: 5000,
        status: "draft",
      },
      {
        projectId: betaSite.id,
        number: "BETA-2026-001",
        amount: 3500,
        status: "overdue",
        dueDate: new Date("2026-02-28"),
        sentDate: new Date("2026-02-01"),
      },
      {
        projectId: betaApp.id,
        number: "BETA-2026-002",
        amount: 10000,
        status: "sent",
        dueDate: new Date("2026-04-01"),
        sentDate: new Date("2026-03-01"),
      },
    ],
  });

  console.log("  ✅ 5 invoices created");

  // ─── Issues (sample) ────────────────────────────────────

  await prisma.issue.createMany({
    data: [
      {
        projectId: acmeShop.id,
        title: "Crash panier en mobile Safari",
        description: "Le bouton 'Ajouter au panier' ne répond pas sur iOS Safari 17",
        status: "in_progress",
        priority: "critical",
        type: "bug",
        assigneeId: max.id,
      },
      {
        projectId: acmeShop.id,
        title: "Typo page contact",
        status: "open",
        priority: "low",
        type: "bug",
      },
      {
        projectId: acmeShop.id,
        title: "Bug paiement Stripe webhook",
        description: "Webhook 402 intermittent sur les paiements > 100€",
        status: "resolved",
        priority: "high",
        type: "bug",
        assigneeId: max.id,
      },
      {
        projectId: betaApp.id,
        title: "Écran blanc au lancement Android 14",
        description: "Splash screen ne disparaît pas sur certains Samsung",
        status: "open",
        priority: "high",
        type: "bug",
        assigneeId: max.id,
      },
      {
        projectId: betaSite.id,
        title: "Ajouter section témoignages",
        description: "Le client veut 3 témoignages en slider",
        status: "open",
        priority: "medium",
        type: "improvement",
        assigneeId: alex.id,
      },
    ],
  });

  console.log("  ✅ 5 issues created");
  console.log("\n🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
