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
  BadgeJapaneseYen,
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

      <div className="flex flex-row md:flex-col md:justify-between items-center md:p-3 p-2 md:h-full md:w-full">
        <div className="flex flex-row md:flex-col gap-2 md:gap-5 justify-center items-start font-semibold w-full">

        <Link
            href={"/dashboard"}
            className="hidden md:flex gap-2 md:px-4 md:py-2"
          >
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
            <NavigationMenuList className="flex flex-row md:flex-col items-center justify-center md:items-start md:justify-start w-full gap-1">
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

              <div className="hidden md:block w-full">
                <Separator className="my-2" />
              </div>
              <div className="hidden md:flex flex-col">
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link
                    className="flex flex-col md:flex-row items-center gap-2"
                    href={"/goals"}
                  >
                    <PiggyBank size={20} strokeWidth={1} />
                    <p className="hidden md:grid font-light">Goals</p>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link
                    className="flex flex-col md:flex-row items-center gap-2"
                    href={"/categories"}
                  >
                    <Archive size={20} strokeWidth={1} />
                    <p className="hidden md:grid font-light">Categories</p>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                  <Link
                    className="flex flex-col md:flex-row items-center gap-2"
                    href={"/budgets"}
                  >
                    <BadgeJapaneseYen size={20} strokeWidth={1} />
                    <p className="hidden md:grid font-light">Budgets</p>
                  </Link>
                </NavigationMenuItem>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="absolute md:relative b-0 flex items-center w-full pr-5 md:pr-0">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
