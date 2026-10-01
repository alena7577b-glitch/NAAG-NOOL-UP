import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/server";
import { ProfileForm } from "./ProfileForm";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Personal Profile | NAAG NOOL UP",
  description: "Manage your personal profile and contact information",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-dusk font-bold">Personal Profile</h1>
        <p className="text-stone-600 text-sm mt-1">
          Update your contact details and display preferences across NAAG NOOL UP.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8 shadow-sm">
        <ProfileForm initialFullName={user.fullName || ""} email={user.email} />
      </div>
    </div>
  );
}
