"use client";

import { AuthButton } from "@/components/auth/auth-button";
import { Separator } from "./ui/separator";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ReceiptJapaneseYen,
  Wallet,
  PiggyBank,
  House,
  Archive,
  BadgeJapaneseYen,
  Landmark,
  Menu,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SettlementCard } from "@/components/transactions/settlement-card";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { href: "/dashboard", label: "Dashboard", icon: House },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: ReceiptJapaneseYen,
    },
    { href: "/dashboard/accounts", label: "Accounts", icon: Wallet },
  ];

  const secondaryNav = [
    { href: "/dashboard/bills", label: "Bills", icon: Landmark },
    { href: "/dashboard/budgets", label: "Budgets", icon: BadgeJapaneseYen },
    { href: "/dashboard/categories", label: "Categories", icon: Archive },
    { href: "/dashboard/goals", label: "Goals", icon: PiggyBank },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-50 to-teal-50 md:bg-none md:bg-muted w-full md:h-full">
      {/* MOBILE: We use a grid with 3 equal columns to force absolute centering of the middle item.
          DESKTOP: Reverts to a standard column flexbox.
      */}
      <div className="grid grid-cols-3 items-center px-5 py-3 md:flex md:flex-col md:justify-between md:p-3 md:h-full md:w-full relative">
        {/* 1. LEFT SECTION (Mobile: Menu / Desktop: Logo) */}
        <div className="flex justify-start md:w-full">
          <Sheet>
            <SheetTrigger className="md:hidden p-2 hover:bg-black/5 rounded-md transition-colors">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="w-full border-none bg-emerald-800 shadow-xl justify-between px-5 py-10"
            >
              <SheetHeader className="w-full text-xl p-0">
                <SheetTitle className="flex items-center justify-center gap-2 text-left">
                  <Image
                    src="/imoni_headshot.png"
                    alt="logo"
                    width={24}
                    height={24}
                  />
                  <p className="text-white">Bank of Imoni</p>
                </SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-5 items-center justify-center">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "bg-muted flex flex-col items-center  mx-2 p-3 rounded-lg transition-colors",
                      pathname === item.href
                        ? "text-emerald-700 font-bold"
                        : "hover:text-emerald-700 font-medium",
                    )}
                  >
                    <item.icon
                      size={20}
                      strokeWidth={pathname === item.href ? 2 : 1.5}
                    />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard"
            className="hidden md:flex gap-2 md:px-4 md:py-2 items-center mb-6"
          >
            <Image
              src="/imoni_headshot.png"
              alt="logo"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
            />
            <span className="text-xl tracking-tight font-semibold">
              Bank of Imoni
            </span>
          </Link>
        </div>
        {/* 2. CENTER SECTION (The 3 Main Buttons) */}
        <div className="flex justify-center md:w-full">
          <NavigationMenu className="max-w-none md:justify-start">
            <NavigationMenuList className="flex flex-row md:flex-col items-center justify-center md:items-start gap-1 space-x-0">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href} className="md:w-full">
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center justify-start gap-3 px-3 md:w-full transition-all",
                        isActive
                          ? "bg-white md:bg-background shadow-sm text-emerald-700 font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      <item.icon size={30} strokeWidth={isActive ? 2 : 1.5} />
                      <p className="hidden md:block">{item.label}</p>
                    </Link>
                  </NavigationMenuItem>
                );
              })}

              {/* Desktop Only Sidebar Secondary Links */}
              <div className="hidden md:block w-full">
                <Separator className="my-4 opacity-50" />
                <div className="flex flex-col gap-1">
                  {secondaryNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <NavigationMenuItem key={item.href} className="w-full">
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "w-full justify-start gap-3 font-normal transition-all",
                            isActive
                              ? "text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <item.icon
                            size={20}
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                          <p>{item.label}</p>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </div>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:block w-full mt-4">
          <SettlementCard />
        </div>

        {/* 3. RIGHT SECTION (Auth Button) */}
        <div className="flex md:justify-start justify-end items-center pointer-events-none md:w-full md:mt-auto">
          <div className="pointer-events-auto">
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
