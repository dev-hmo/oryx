"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            const data = await res.json();
            onChange(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".svg"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="relative">
                {value ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 transition-all font-bold"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`
                            relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer
                            flex flex-col items-center justify-center p-6 text-center
                            ${isDragActive ? "border-blue-500 bg-blue-500/5" : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"}
                            ${uploading ? "cursor-wait opacity-50" : ""}
                        `}
                    >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                <p className="text-sm text-white/60 font-medium">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-white/40" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-white font-medium">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-white/40">
                                        PNG, JPG, WEBP, SVG up to 5MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-400 font-medium flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" />
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
