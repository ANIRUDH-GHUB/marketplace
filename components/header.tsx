"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">Agent Marketplace</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/register")}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Register Agent
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}