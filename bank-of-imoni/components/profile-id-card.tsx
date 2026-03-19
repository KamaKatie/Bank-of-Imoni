"use client";

import { useRef, useState } from "react";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { fetchFullProfile } from "@/hooks/use-profile-data";
import {
  Wallet,
  Target,
  Loader2,
  Camera,
  User as UserIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileIdCard() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const {
    data: profile,
    error,
    isLoading,
  } = useSupabaseQuery(["profile-card"], fetchFullProfile);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `${profile.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 3. Update 'profiles' table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ image: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // 4. Invalidate query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["profile-card"] });
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to update image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (error || !profile) return <div>Error loading profile</div>;

  const fullName = `${profile.first_name} ${profile.last_name || ""}`;

  return (
    <div className="w-[600px]">
      <div className="bg-amber-50/50 border border-muted rounded-3xl overflow-hidden shadow-xl">
        <div className="h-24 p-6 flex justify-end"></div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            {/* IMAGE CONTAINER WITH HOVER */}
            <div
              className="relative group w-24 h-24 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={profile.image || "/avatar-placeholder.png"}
                className={`w-24 h-24 rounded-2xl object-cover bg-white shadow-lg transition-opacity ${isUploading ? "opacity-50" : "group-hover:opacity-75"}`}
                alt="Avatar"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="pb-2 text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold leading-tight">{fullName}</h2>
            <p className="text-xs font-mono text-muted-foreground uppercase">
              ID: {profile.id}
            </p>
          </div>

          {/* Stats section remains same... */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-muted">
            {/* ... Net Worth and Goals ... */}
            <div>
              <p className="text-[10px] uppercase font-bold mb-1 text-muted-foreground">
                Net Worth
              </p>
              <p className="text-xl font-bold text-emerald-600">
                {profile.totalBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold mb-1 text-muted-foreground">
                Financial Goals
              </p>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <p className="text-xl font-bold">{profile.goalCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
