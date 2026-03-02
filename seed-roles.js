const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please add your MONGODB_URI to .env.local");
    process.exit(1);
}

const RoleSchema = new mongoose.Schema({
    name: String,
    permissions: [String],
    label: String,
    description: String,
}, { timestamps: true });

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

const defaultRoles = [
    {
        name: "super_admin",
        label: "Super Admin",
        description: "Full access to all system features",
        permissions: ["read", "create", "update", "delete", "manage_users"],
    },
    {
        name: "editor",
        label: "Content Editor",
        description: "Can manage content but not users or system settings",
        permissions: ["read", "create", "update"],
    },
    {
        name: "viewer",
        label: "Read-Only Viewer",
        description: "Can view all data but cannot make any changes",
        permissions: ["read"],
    }
];

async function seedRoles() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        console.log("Connected successfully.");

        console.log("Cleaning up existing roles...");
        await Role.deleteMany({});
        console.log("Cleanup done.");

        console.log("Seeding default roles...");
        for (const r of defaultRoles) {
            await Role.create(r);
            console.log(`- Created ${r.name}`);
        }

        console.log("🎉 Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        process.exit(1);
    }
}

seedRoles();
