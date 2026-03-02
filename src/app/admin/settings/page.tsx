"use client";

import React, { useState } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/use-content";
import { useThemeStore } from "@/store/theme-store";
import { type ContactInfo } from "@/lib/api";
import { Phone, MessageCircle, MapPin, Save, Plus, Trash2, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const inputCls = "admin-input";
const labelCls = "block text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5";

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
    const { theme } = useThemeStore();
    return (
        <div className="admin-card">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

function SettingsForm({ initial, onSave, isSubmitting }: { initial: ContactInfo; onSave: (d: ContactInfo) => void; isSubmitting: boolean }) {
    const [phones, setPhones] = useState<string[]>(initial.phones);
    const [viber, setViber] = useState(initial.viber);
    const [whatsapp, setWhatsapp] = useState(initial.whatsapp);
    const [addresses, setAddresses] = useState<string[]>(initial.addresses);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        onSave({
            phones: phones.filter(Boolean),
            viber,
            whatsapp,
            addresses: addresses.filter(Boolean),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Phone Numbers */}
            <Section icon={Phone} title="Phone Numbers">
                <div className="space-y-2 mb-3">
                    {phones.map((phone, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                className={inputCls}
                                value={phone}
                                onChange={(e) => setPhones((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))}
                                placeholder="09 777 379 000"
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={() => setPhones((prev) => prev.filter((_, j) => j !== i))}
                                className="p-2.5 shrink-0 rounded-xl text-gray-400 dark:text-white/30 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                                disabled={isSubmitting}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setPhones((prev) => [...prev, ""])}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-all"
                    disabled={isSubmitting}
                >
                    <Plus className="w-3.5 h-3.5" /> Add Phone Number
                </button>
            </Section>

            {/* Messaging */}
            <Section icon={MessageCircle} title="Messaging">
                <div className="space-y-3">
                    <div>
                        <label className={labelCls}>Viber</label>
                        <input className={inputCls} value={viber} onChange={(e) => setViber(e.target.value)} placeholder="+959 421 139 022" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>WhatsApp</label>
                        <input className={inputCls} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+959 421 139 022" disabled={isSubmitting} />
                    </div>
                </div>
            </Section>

            {/* Addresses */}
            <Section icon={MapPin} title="Office Addresses">
                <div className="space-y-2 mb-3">
                    {addresses.map((addr, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <textarea
                                className={`${inputCls} resize-none h-20`}
                                value={addr}
                                onChange={(e) => setAddresses((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))}
                                placeholder="Enter address..."
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={() => setAddresses((prev) => prev.filter((_, j) => j !== i))}
                                className="p-2.5 shrink-0 mt-0.5 rounded-xl text-gray-400 dark:text-white/30 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                                disabled={isSubmitting}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setAddresses((prev) => [...prev, ""])}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-all"
                    disabled={isSubmitting}
                >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
            </Section>

            {/* Save button */}
            <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg
                    ${saved
                        ? "bg-emerald-600 shadow-emerald-500/20 text-white"
                        : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 text-white"
                    } disabled:opacity-50`}
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                    <CheckCircle className="w-4 h-4" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {isSubmitting ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
        </div>
    );
}

export default function SettingsAdmin() {
    const { data: contactInfo, isLoading, isError } = useSettings();
    const updateMutation = useUpdateSettings();
    const { theme } = useThemeStore();

    const handleSave = async (data: ContactInfo) => {
        try {
            await updateMutation.mutateAsync(data);
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
                <p className={`animate-pulse text-sm transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>Loading settings...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>
                <div>
                    <h3 className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Failed to load settings</h3>
                    <p className={`text-sm mt-1 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-500 font-medium'}`}>Please try again later.</p>
                </div>
                <button onClick={() => window.location.reload()} className="admin-btn-secondary px-8">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="pb-2">
                <h2 className={`text-xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contact Info Settings</h2>
                <p className={`text-sm mt-0.5 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-500 font-medium'}`}>Update the contact details shown on the live website.</p>
            </div>

            {contactInfo && (
                <SettingsForm
                    initial={contactInfo}
                    onSave={handleSave}
                    isSubmitting={updateMutation.isPending}
                />
            )}
        </div>
    );
}
