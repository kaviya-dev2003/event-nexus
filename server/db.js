require("dotenv").config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "event_nexus",
  },
});

async function initDb() {
  const hasUsers = await knex.schema.hasTable("users");
  if (!hasUsers) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.enum("role", ["user", "organizer", "admin"]).defaultTo("user");
      table.boolean("is_active").defaultTo(true);
      table.boolean("is_verified").defaultTo(false); // For organizers
      table.timestamps(true, true);
    });
  } else {
    // Check if columns exist and add them if missing
    const hasIsActive = await knex.schema.hasColumn("users", "is_active");
    if (!hasIsActive) {
      await knex.schema.table("users", (table) => {
        table.boolean("is_active").defaultTo(true);
      });
    }
    const hasIsVerified = await knex.schema.hasColumn("users", "is_verified");
    if (!hasIsVerified) {
      await knex.schema.table("users", (table) => {
        table.boolean("is_verified").defaultTo(false);
      });
    }
  }

  const hasEvents = await knex.schema.hasTable("events");
  if (!hasEvents) {
    await knex.schema.createTable("events", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("category").notNullable();
      table.string("date").notNullable();
      table.string("time").notNullable();
      table.string("location").notNullable();
      table.text("description");
      table.decimal("price").notNullable();
      table.integer("total_seats").notNullable();
      table.integer("available_seats").notNullable();
      table.string("image_url");
      table.integer("organizer_id").unsigned().references("users.id");
      table
        .enum("status", ["pending", "approved", "rejected"])
        .defaultTo("pending");
      table.timestamps(true, true);
    });
  }

  const hasBookings = await knex.schema.hasTable("bookings");
  if (!hasBookings) {
    await knex.schema.createTable("bookings", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("users.id");
      table.integer("event_id").unsigned().references("events.id");
      table.integer("quantity").notNullable();
      table.decimal("total_price").notNullable();
      table
        .enum("status", [
          "pending_payment",
          "pending_approval",
          "approved",
          "rejected",
        ])
        .defaultTo("pending_payment");
      table.string("transaction_id");
      table.timestamps(true, true);
    });
  }

  const hasPayments = await knex.schema.hasTable("payments");
  if (!hasPayments) {
    await knex.schema.createTable("payments", (table) => {
      table.increments("id").primary();
      table.integer("booking_id").unsigned().references("bookings.id");
      table.integer("user_id").unsigned().references("users.id");
      table.decimal("amount").notNullable();
      table.string("payment_method").notNullable(); // UPI, Card, etc.
      table.string("transaction_id").unique().notNullable();
      table
        .enum("status", ["pending", "completed", "failed"])
        .defaultTo("pending");
      table.timestamps(true, true);
    });
  }

  console.log("Database initialized");

  // Seed Admin if not exists
  const admin = await knex("users").where({ role: "admin" }).first();
  if (!admin) {
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await knex("users").insert({
      name: "Site Admin",
      email: "admin@eventnexus.com",
      password: hashedPassword,
      role: "admin",
      is_active: true,
    });
    console.log("Admin account created: admin@eventnexus.com / admin123");
  }

  // Seed some initial data if events table is empty
  //   const eventCount = await knex('events').count('id as count').first();
  //   if (eventCount.count === 0) {
  //     const adminUser = await knex('users').where({ role: 'admin' }).first();
  //     await knex('events').insert([
  //       {
  //         name: 'Grand Music Concert',
  //         category: 'Music',
  //         date: '2024-08-15',
  //         time: '19:00',
  //         location: 'City Arena',
  //         description: 'Join us for a night of incredible music and live performances.',
  //         price: 99.99,
  //         total_seats: 500,
  //         available_seats: 500,
  //         organizer_id: adminUser.id,
  //         status: 'approved',
  //         image_url: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=2070'
  //       },
  //       {
  //         name: 'Tech Innovation Summit',
  //         category: 'Tech',
  //         date: '2024-09-10',
  //         time: '09:00',
  //         location: 'Convention Center',
  //         description: 'Explore the latest in technology and innovation.',
  //         price: 149.00,
  //         total_seats: 300,
  //         available_seats: 300,
  //         organizer_id: adminUser.id,
  //         status: 'approved',
  //         image_url: 'https://images.unsplash.com/photo-1540575861501-7c9111272c3b?auto=format&fit=crop&q=80&w=2070'
  //       }
  //     ]);
  //     console.log('Initial events seeded');
  //   }
}

module.exports = { knex, initDb };
