/**
 * Script de seed pour insérer les produits Matière Première dans la base de données
 * Exécution: node seed-products.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const PRODUCTS = [
  {
    name: "Vanilla Powder",
    slug: "vanilla-powder",
    description: "Une interprétation délicate et poudreuse de la vanille. Vanilla Powder capture l'essence brute de la vanille de Madagascar, offrant une chaleur douce et réconfortante. Un parfum minimaliste qui célèbre la pureté d'une seule matière première.",
    topNotes: "Vanille de Madagascar",
    heartNotes: "Vanille poudreuse, amande",
    baseNotes: "Vanille, musc blanc",
    price: 8500,
    stock: 50,
  },
  {
    name: "Crystal Saffron",
    slug: "crystal-saffron",
    description: "Le safran cristallin dans toute sa splendeur. Crystal Saffron révèle les facettes précieuses du safran iranien, avec ses notes épicées et légèrement amères. Un parfum rare et sophistiqué pour les amateurs de matières premières nobles.",
    topNotes: "Safran iranien, bergamote",
    heartNotes: "Safran, épices",
    baseNotes: "Ambre gris, bois de cèdre",
    price: 9500,
    stock: 40,
  },
  {
    name: "Radical Rose",
    slug: "radical-rose",
    description: "Une rose sans compromis. Radical Rose est une célébration de la rose centifolia de Grasse, présentée dans toute son intensité naturelle. Frais, floral et intemporel, ce parfum incarne la pureté de la matière première.",
    topNotes: "Rose centifolia, poivre rose",
    heartNotes: "Rose, géranium",
    baseNotes: "Vétiver, bois de santal",
    price: 8500,
    stock: 55,
  },
  {
    name: "Falcon Leather",
    slug: "falcon-leather",
    description: "Un cuir brut et authentique. Falcon Leather capture l'essence du cuir naturel, offrant une texture riche et légèrement animale. Un parfum pour ceux qui apprécient les matières premières complexes et caractérisées.",
    topNotes: "Cuir brut, bergamote",
    heartNotes: "Cuir, tabac",
    baseNotes: "Cuir, ambre, musc",
    price: 9000,
    stock: 35,
  },
  {
    name: "Santal Austral",
    slug: "santal-austral",
    description: "Le bois de santal australien dans sa forme la plus pure. Santal Austral offre une chaleur boisée, légèrement crémeuse et douce. Un classique minimaliste qui respire l'élégance intemporelle.",
    topNotes: "Bois de santal australien",
    heartNotes: "Bois de santal, vanille",
    baseNotes: "Bois de santal, musc blanc",
    price: 8500,
    stock: 48,
  },
  {
    name: "Encens Suave",
    slug: "encens-suave",
    description: "L'encens dans toute sa douceur. Encens Suave révèle les notes lisses et résineuses de l'encens de Somalie, avec une légère touche de vanille. Un parfum contemplatif et apaisant.",
    topNotes: "Encens de Somalie, citron",
    heartNotes: "Encens, résine",
    baseNotes: "Encens, vanille, ambre",
    price: 8500,
    stock: 42,
  },
  {
    name: "Metal Lavender",
    slug: "metal-lavender",
    description: "La lavande réinventée avec une touche métallique. Metal Lavender combine la lavande de Provence avec des notes minérales et fraîches, créant un contraste moderne et surprenant.",
    topNotes: "Lavande de Provence, notes minérales",
    heartNotes: "Lavande, géranium",
    baseNotes: "Bois de cèdre, musc",
    price: 8500,
    stock: 50,
  },
  {
    name: "Bois d'Ébène",
    slug: "bois-debene",
    description: "L'ébène brut et noble. Bois d'Ébène capture l'essence sombre et riche du bois d'ébène, offrant une profondeur boisée avec des notes légèrement épicées. Un parfum pour les esprits aventuriers.",
    topNotes: "Bois d'ébène, poivre noir",
    heartNotes: "Bois d'ébène, épices",
    baseNotes: "Bois d'ébène, vétiver, musc",
    price: 9000,
    stock: 38,
  },
  {
    name: "Neroli Oranger",
    slug: "neroli-oranger",
    description: "Le néroli de Tunisie dans sa plus pure expression. Neroli Oranger offre une fraîcheur citronnée avec des notes florales délicates. Un parfum lumineux et énergisant.",
    topNotes: "Néroli de Tunisie, bergamote",
    heartNotes: "Néroli, fleurs blanches",
    baseNotes: "Bois de santal, musc blanc",
    price: 8500,
    stock: 45,
  },
  {
    name: "Cologne Cédrat",
    slug: "cologne-cedrat",
    description: "Une cologne fraîche et vivifiante. Cologne Cédrat célèbre le cédrat de Calabre avec ses notes acidulées et rafraîchissantes. Un parfum idéal pour l'été et les moments de détente.",
    topNotes: "Cédrat de Calabre, citron",
    heartNotes: "Cédrat, notes vertes",
    baseNotes: "Bois blanc, musc léger",
    price: 8000,
    stock: 60,
  },
];

async function seedProducts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("🌱 Début du seed des produits Matière Première...");

    for (const product of PRODUCTS) {
      await connection.execute(
        `INSERT INTO products (name, slug, description, topNotes, heartNotes, baseNotes, price, stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.slug,
          product.description,
          product.topNotes,
          product.heartNotes,
          product.baseNotes,
          product.price,
          product.stock,
        ]
      );
      console.log(`✓ ${product.name} inséré`);
    }

    console.log("\n✅ Seed terminé avec succès ! 10 produits ont été insérés.");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedProducts();
