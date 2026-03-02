import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRole extends Document {
    name: string; // "super_admin", "editor", "viewer"
    permissions: string[]; // ["read", "create", "update", "delete", "manage_users"]
    label: string;
    description: string;
}

const RoleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    label: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;
