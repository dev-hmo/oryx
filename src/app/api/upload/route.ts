import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        // Create a unique filename
        const extension = file.name.split(".").pop();
        const filename = `${uuidv4()}.${extension}`;
        const filePath = path.join(uploadDir, filename);

        // Write file to local disk
        await writeFile(filePath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url });

    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Failed to upload file", details: err.message }, { status: 500 });
    }
}
