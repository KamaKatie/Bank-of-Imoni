import { AuthButton } from "@/components/auth-button";
import { Separator } from "./ui/separator";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ReceiptJapaneseYen,
  Wallet,
  PiggyBank,
  House,
  Archive,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export default function Sidebar() {
  return (
    <nav className="md:bg-muted w-full md:h-full">
      {/* Mobile: horizontal row, small padding 
         Desktop: vertical column, full height
      */}
      <div className="flex flex-row md:flex-col justify-between items-center md:items-start p-3 md:h-full">
        <div className="flex flex-row md:flex-col gap-2 md:gap-5 items-center md:items-start font-semibold w-full">
          {/* Logo - often hidden or simplified on mobile bottom bars */}
          <Link href={"/dashboard"} className="hidden md:flex gap-2">
            <Image
              src="/imoni_headshot.png"
              alt="logo"
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className="text-lg">Bank of Imoni</span>
          </Link>

          <NavigationMenu className="w-full">
            {/* Mobile: Row of icons 
               Desktop: Column of links 
            */}
            <NavigationMenuList className="flex flex-row md:flex-col items-center md:items-start justify-around md:justify-start w-full gap-1">
              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex flex-col md:flex-row items-center gap-2"
                  href={"/dashboard"}
                >
                  <House size={20} />
                  <p className="hidden md:grid">Dashboard</p>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex flex-col md:flex-row items-center gap-2"
                  href={"/transactions"}
                >
                  <ReceiptJapaneseYen size={20} />
                  <p className="hidden md:grid">Transactions</p>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex flex-col md:flex-row items-center gap-2"
                  href={"/accounts"}
                >
                  <Wallet size={20} />
                  <p className="hidden md:grid">Accounts</p>
                </Link>
              </NavigationMenuItem>

              {/* Separator is usually distracting on mobile bottom bars, hide it */}
              <div className="hidden md:block w-full px-2">
                <Separator className="my-2" />
              </div>

              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex flex-col md:flex-row items-center gap-2"
                  href={"/goals"}
                >
                  <PiggyBank size={20} />
                  <p className="hidden md:grid">Goals</p>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link
                  className="flex flex-col md:flex-row items-center gap-2"
                  href={"/categories"}
                >
                  <Archive size={20} />
                  <p className="hidden md:grid">Categories</p>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Hide AuthButton on mobile nav to save space, or keep it if needed */}
        <div className="hidden md:block mt-auto">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
