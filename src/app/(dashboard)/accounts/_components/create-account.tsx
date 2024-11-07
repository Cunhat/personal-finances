import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import CreateAccountForm from "./create-account-form";

export default function CreateAccount() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="size-8">
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Add Account</SheetTitle>
          <SheetDescription>Add a new account.</SheetDescription>
        </SheetHeader>
        <CreateAccountForm />
      </SheetContent>
    </Sheet>
  );
}
