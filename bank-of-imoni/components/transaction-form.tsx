"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTransaction } from "@/app/transactions/actions/create-transaction";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicIcon } from "lucide-react/dynamic";

const formSchema = z.object({
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
  date: z.date(),
  paidByAccountId: z.string(),
  participantUserIds: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  accounts: {
    id: string;
    name: string;
    icon: string;
    placeholder_img: string;
  }[];
  users: { id: string; first_name: string; icon: string }[];
  categories: { id: string; name: string; icon: string }[];
  onSuccess?: () => void;
};

export function TransactionForm({
  accounts,
  users,
  categories,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      paidByAccountId: "",
      participantUserIds: [],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createTransaction(values);

      toast.success("Transaction created", { position: "top-center" });

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex gap-2 items-center">
                        <DynamicIcon name={category.icon} />
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value.toISOString().split("T")[0]}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Paid By Account */}
        <FormField
          control={form.control}
          name="paidByAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid With</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <span className="flex gap-2">
                        <Image
                          src={account.icon || account.placeholder_img}
                          alt="logo"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {account.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants */}
        <FormField
          control={form.control}
          name="participantUserIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid for</FormLabel>
              {users.map((user) => {
                const isChecked = field.value.includes(user.id);

                return (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, user.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id) => id !== user.id),
                          );
                        }
                      }}
                    />
                    <FormLabel className="font-normal">
                      {user.first_name}
                    </FormLabel>
                  </div>
                );
              })}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating..." : "Create transaction"}
        </Button>
      </form>
    </Form>
  );
}
