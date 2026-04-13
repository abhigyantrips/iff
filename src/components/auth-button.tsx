"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoogleLogoIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import { signIn, signOut, useSession } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (!session) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => signIn.social({ provider: "google" })}
        className="gap-2"
      >
        <GoogleLogoIcon data-icon="inline-start" weight="bold" />
        Sign in with Google
      </Button>
    );
  }

  const user = session.user;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="size-6">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback className="text-xs">{initials || <UserIcon />}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
          <SignOutIcon data-icon="inline-start" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
