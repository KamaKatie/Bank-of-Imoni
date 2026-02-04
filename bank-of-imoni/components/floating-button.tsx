import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function FloatingButton() {
  return (
    <div className="lg:hidden fixed bottom-16 end-2 z-50">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg w-14 h-14 bg-emerald-800"
      >
        <PlusIcon color="#ffffff" strokeWidth={5} />
      </Button>
    </div>
  );
}
