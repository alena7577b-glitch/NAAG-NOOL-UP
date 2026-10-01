import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/server";
import { SettingsForm } from "./SettingsForm";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Security & Password Settings | NAAG NOOL UP",
  description: "Update your password and manage account security preferences",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-dusk font-bold">Security & Settings</h1>
        <p className="text-stone-600 text-sm mt-1">
          Manage your account credentials, security preferences, and authentication methods.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-dusk mb-4">Change Password</h2>
        <SettingsForm />
      </div>
    </div>
  );
}
