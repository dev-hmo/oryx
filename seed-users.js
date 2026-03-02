const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please add your MONGODB_URI to .env.local");
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    role: String,
    displayName: String,
    isActive: Boolean,
    lastLoginAt: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const initialUsers = [
    {
        username: "admin",
        password: "oryx@Admin2026",
        role: "super_admin",
        displayName: "Super Admin",
    },
    {
        username: "editor",
        password: "editor@Ed2026",
        role: "editor",
        displayName: "Content Editor",
    },
    {
        username: "viewer",
        password: "viewer@View2026",
        role: "viewer",
        displayName: "Read-Only Viewer",
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        console.log("Cleaning up existing users...");
        await User.deleteMany({});

        console.log("Seeding initial users...");
        for (const u of initialUsers) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(u.password, salt);

            await User.create({
                username: u.username,
                passwordHash,
                role: u.role,
                displayName: u.displayName,
                isActive: true,
                lastLoginAt: null,
            });
            console.log(`Created user: ${u.username}`);
        }

        console.log("🎉 Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seed();
