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
      <p className="mb-2 text-sm text-foreground font-medium text-right">
        Subscribe for the latest dev updates
      </p>
      <div className="flex">
        <Input
          className="rounded-r-none border-r-0 w-64"
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

        <Button type="submit" variant="secondary" className="rounded-l-none">
          Subscribe
        </Button>
      </div>
    </form>
  );
}
