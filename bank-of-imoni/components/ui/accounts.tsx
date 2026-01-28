"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";



type Account = {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | string;
  balance: number;
  image_url: string | null;
};

export default function Accounts() {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchAccounts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("accounts")
      .select("id, name, type, balance, image_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();

    const channel = supabase
      .channel("accounts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "accounts" },
        fetchAccounts,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAccount = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const balance = Number(formData.get("balance"));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("accounts").insert({
      user_id: user.id,
      name,
      type,
      balance,
    });

    setOpen(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Accounts</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={account.image_url ?? undefined} />
                <AvatarFallback>
                  {account.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-base">{account.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="flex gap-1">
                    {accountIcon(account.type)}
                    {account.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(account.balance)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
