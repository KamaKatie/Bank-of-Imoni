import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ReceiptJapaneseYen, Wallet, PiggyBank } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export default function Navbar() {
  return (
    <nav className="flex justify-center max-h-20 text-white">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
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
          <NavigationMenu className="md:grid">
            <NavigationMenuList>
              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex items-center gap-2"
                  href={"/transactions"}
                >
                  <ReceiptJapaneseYen />
                  <p className="hidden md:grid">Transactions</p>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link className="flex items-center gap-2" href={"/accounts"}>
                  <Wallet />
                  <p className="hidden md:grid">Accounts</p>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link className="flex items-center gap-2" href={"/goals"}>
                  <PiggyBank />
                  <p className="hidden md:grid">Goals</p>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}
