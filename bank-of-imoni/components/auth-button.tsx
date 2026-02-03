"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AuthButton() {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const displayName = profile?.first_name || user.email?.split("@")[0];

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex bg-emerald-50 text-black items-center rounded-full border-2 lg:px-2 gap-2">
            <Image
              src={profile?.image || "/avatar-placeholder.png"}
              alt={displayName}
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="hidden lg:block truncate max-w-[120px]">
              {displayName}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem>
            <UserIcon />
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOutIcon />
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
