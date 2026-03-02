import mongoose, { Schema, Document, Model } from "mongoose";
import { Role } from "@/lib/schemas";

export interface IUser extends Document {
    username: string;
    passwordHash: string;
    role: Role;
    displayName: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
        },
        role: {
            type: String,
            enum: ["super_admin", "editor", "viewer"],
            default: "viewer",
        },
        displayName: {
            type: String,
            required: [true, "Display name is required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple model compilations in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
