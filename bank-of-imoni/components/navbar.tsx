import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export default function Navbar() {
  return (
    <nav className="flex justify-center max-h-20 text-white">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/dashboard"} className="flex gap-2">
            <Image
              src="/imoni_headshot.png"
              alt="logo"
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className="hidden md:grid text-lg">Bank of Imoni</span>
          </Link>
          <div className="flex items-center gap-2">
            <NavigationMenu className="hidden md:grid">
              <NavigationMenuList>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link href={"/transactions"}>Transactions</Link>
                </NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link href={"/accounts"}>Accounts</Link>
                </NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link href={"/goals"}>Goals</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}
