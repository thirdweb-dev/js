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
      className="group"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        try {
          await fetch("/api/email-signup", {
            body: JSON.stringify({ email }),
            method: "POST",
          });
        } catch (e) {
          console.debug("Error subscribing");
          console.error(e);
        }
      }}
    >
      <p className="mb-3 font-semibold text-base text-foreground">
        Subscribe for the latest dev updates
      </p>
      <div className="flex">
        <Input
          className="h-12 border bg-background font-semibold duration-200 placeholder:font-semibold focus-visible:outline-none focus-visible:ring-offset-0 group-focus-within:border-foreground md:w-[230px]"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          style={{
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
          }}
          type="email"
          value={email}
        />

        <Button
          className="h-12 bg-muted font-semibold text-foreground duration-200 group-focus-within:bg-foreground group-focus-within:text-background"
          style={{
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }}
          type="submit"
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}
