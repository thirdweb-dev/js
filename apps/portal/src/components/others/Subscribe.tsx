"use client";

import { BadgeCheckIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Subscribe() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  if (isSubmitted) {
    return (
      <p className="fade-in-0 flex animate-in gap-2 font-semibold text-base text-foreground duration-500 md:h-24 md:items-center">
        <BadgeCheckIcon />
        Thank you for subscribing!
      </p>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        try {
          await fetch("/api/email-signup", {
            method: "POST",
            body: JSON.stringify({ email }),
          });
        } catch (e) {
          console.debug("Error subscribing");
          console.error(e);
        }
      }}
      className="group"
    >
      <p className="mb-3 font-semibold text-base text-foreground">
        Subscribe for the latest dev updates
      </p>
      <div className="flex">
        <Input
          className="h-12 border bg-background font-semibold duration-200 placeholder:font-semibold focus-visible:outline-none focus-visible:ring-offset-0 group-focus-within:border-foreground md:w-[230px]"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />

        <Button
          type="submit"
          className="h-12 bg-muted font-semibold text-foreground duration-200 group-focus-within:bg-foreground group-focus-within:text-background"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}
