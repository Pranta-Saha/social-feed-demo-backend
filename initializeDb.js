import sequelize from "./src/config/database.js";

const initializeDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connected");

    console.log("Syncing models...");
    await sequelize.sync({ force: false, alter: false });
    console.log("✓ Models synchronized");

    console.log("\n✅ Database initialized successfully!");
    console.log("\nTables created:");
    console.log("  - Users");
    console.log("  - Posts");
    console.log("  - Comments");
    console.log("  - Replies");
    console.log("  - PostLikes");
    console.log("  - CommentLikes");
    console.log("  - ReplyLikes");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

initializeDatabase();
