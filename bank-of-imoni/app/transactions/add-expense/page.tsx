import Form from "next/form";
import { createTransaction } from "../actions/create-transaction";

export default function Page() {
  return (
    <div className="bg-muted w-full h-full flex items-center justify-center">
      <Form
        action={createTransaction}
        className="flex flex-col gap-2 border-2 p-4"
      >
        <input type="text" name="amount" />
        <input type="text" name="description" />
        <input type="text" name="category" />
        <input type="text" name="date" />
        <input type="text" name="paidByAccountId" />
        <input type="text" name="participantUserIds" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
