import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import Accounts from "@/components/accounts";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Bank of Imoni</Link>
              <div className="flex items-center gap-2"></div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-7xl px-8">
            <div className="h-full grid grid-cols-3 grid-rows-2 gap-6">
              <Card className="row-span-2 rounded-xl flex items-center justify-center">
                <h3>Accounts</h3>
                <Accounts />
              </Card>

              <Card className="col-span-2 rounded-xl flex items-center justify-center" />

              <Card className="rounded-xl flex items-center justify-center" />

              <Card className="rounded-xl flex items-center justify-center" />
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
