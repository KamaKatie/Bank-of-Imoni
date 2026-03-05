import Link from "next/link";
import { Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AuthButton } from "@/components/auth/auth-button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="flex w-full">
        <nav className="flex w-full items-center justify-between p-6">
          <div className="flex flex-row items-baseline gap-5">
            <h1 className="text-2xl font-semibold">Bank of Imoni</h1>
            <ul className="flex flex-row gap-5 text-emerald-700">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
          <AuthButton />
        </nav>
      </header>

      <div className="mx-auto items-center justify-center h-full">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Track your spending.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Image
                  src="/categories_screenshot.png"
                  alt="Bank of Imoni"
                  width={800}
                  height={800}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>

      <footer className="p-6 flex flex-row justify-between w-full items-center text-sm text-muted-foreground">
        <p>By Katie</p>
        <Link
          href="https://github.com/KamaKatie/bank-of-imoni"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub Repository</span>
        </Link>
      </footer>
    </div>
  );
}
