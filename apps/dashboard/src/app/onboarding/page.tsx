"use client";
import { FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FormLabel } from "tw-components";

export default function OnboardingPage() {
  const form = useForm<{
    email: string;
    userType: string;
    teamName: string;
    role: string;
    industry: string;
    interests: string[];
  }>();

  return (
    <div className="relative flex h-screen place-items-center bg-muted/30 md:flex-row">
      <main className="z-10 flex flex-col gap-6">
        {/* Left Panel */}
        <div className="w-full p-12">
          <div className="flex space-y-2">
            <h1>Tell us about you.</h1>
            <h3>This will help us personalize your experience.</h3>
          </div>
          <form className="my-8">
            <FormControl>
              <FormLabel>What's your email?</FormLabel>
              <Input
                id="email"
                type="text"
                placeholder="user@example.com"
                {...form.register("email")}
              />
              {/* <FormErrorMessage>
                {form.formState.errors.amount?.message}
              </FormErrorMessage> */}
            </FormControl>
          </form>
        </div>
      </main>
    </div>
  );
}
