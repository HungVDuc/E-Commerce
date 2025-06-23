const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Color = require("../models/color.model");
const Size = require("../models/size.model");
const Category = require("../models/category.model");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Seed categories
    const categories = ["Shirts", "Pants", "Shoes"];
    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) await Category.create({ name });
    }

    // Seed colors
    const colorData = [
      { name: "Red", hexCode: "#FF0000" },
      { name: "Blue", hexCode: "#0000FF" },
      { name: "Green", hexCode: "#00FF00" },
      { name: "Black", hexCode: "#000000" },
      { name: "White", hexCode: "#FFFFFF" },
    ];

    for (const color of colorData) {
      const exists = await Color.findOne({ name: color.name });
      if (!exists) {
        await Color.create(color);
      }
    }

    // Seed sizes
    const sizes = ["S", "M", "L", "XL"];
    for (const name of sizes) {
      const exists = await Size.findOne({ name });
      if (!exists) await Size.create({ name });
    }

    // Seed admin user
    const adminEmail = "admin@example.com";
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
      });
    }

    console.log("✅ Seed completed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
