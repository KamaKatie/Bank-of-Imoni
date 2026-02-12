"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { createTransaction } from "@/app/transactions/actions/create-transaction";

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
import { Checkbox } from "@/components/ui/checkbox";

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
  accounts: { id: string; name: string }[];
  users: { id: string; first_name: string }[];
  categories: { id: string; name: string }[];
};

export function TransactionForm({ accounts, users, categories }: Props) {
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
    await createTransaction({
      ...values,
    });

    form.reset();
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
                <Input type="number" step="0.01" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
                  value={field.value.toISOString().slice(0, 10)}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants Multi Select */}
        <FormField
          control={form.control}
          name="participantUserIds"
          render={() => (
            <FormItem>
              <FormLabel>Split Between</FormLabel>
              {users.map((user) => (
                <FormField
                  key={user.id}
                  control={form.control}
                  name="participantUserIds"
                  render={({ field }) => (
                    <FormItem
                      key={user.id}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(user.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, user.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== user.id,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {user.first_name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Transaction
        </Button>
      </form>
    </Form>
  );
}
