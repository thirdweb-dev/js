"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TabButtons } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { TrackingParams } from "hooks/analytics/useTrack";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  type AccountValidationSchema,
  accountValidationSchema,
  emailSchema,
} from "../validations";

export function LoginOrSignup(props: {
  onRequestSent: (options: {
    email: string;
    isExistingEmail: boolean;
  }) => void;
  loginOrSignup: (input: {
    email: string;
    subscribeToUpdates?: true;
    name?: string;
  }) => Promise<void>;
  trackEvent: (params: TrackingParams) => void;
}) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const loginOrSignup = useMutation({
    mutationFn: props.loginOrSignup,
  });

  function handleSubmit(values: {
    email: string;
    subscribeToUpdates?: true;
    name?: string;
  }) {
    loginOrSignup.mutate(values, {
      onSuccess: (data) => {
        props.onRequestSent({
          email: values.email,
          isExistingEmail: false,
        });
        props.trackEvent({
          category: "onboarding",
          action: "update",
          label: "success",
          data,
        });
      },
      onError: (error) => {
        if (error?.message.match(/email address already exists/)) {
          props.onRequestSent({
            email: values.email,
            isExistingEmail: true,
          });
          return;
        } else if (error.message.includes("INVALID_EMAIL_ADDRESS")) {
          toast.error("Invalid Email Address");
        } else {
          toast.error("Failed to send confirmation email");
        }

        console.error(error);
        props.trackEvent({
          category: "account",
          action: "update",
          label: "error",
          error: error.message,
          fromOnboarding: true,
        });
      },
    });
  }

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <TabButtons
        tabContainerClassName="px-4 lg:px-6 pt-3 pb-0.5"
        tabs={[
          {
            name: "Create account",
            onClick: () => setTab("signup"),
            isActive: tab === "signup",
          },
          {
            name: "I already have an account",
            onClick: () => setTab("login"),
            isActive: tab === "login",
          },
        ]}
      />

      {tab === "signup" && (
        <SignupForm
          key="signup"
          onSubmit={handleSubmit}
          isSubmitting={loginOrSignup.isPending}
        />
      )}

      {tab === "login" && (
        <LoginForm
          key="login"
          onSubmit={handleSubmit}
          isSubmitting={loginOrSignup.isPending}
        />
      )}
    </div>
  );
}

function SignupForm(props: {
  onSubmit: (values: {
    name: string;
    email: string;
    subscribeToUpdates?: true;
  }) => void;
  isSubmitting: boolean;
}) {
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(true);
  const form = useForm<AccountValidationSchema>({
    resolver: zodResolver(accountValidationSchema),
    values: {
      name: "",
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    props.onSubmit({
      ...values,
      ...(subscribeToUpdates
        ? {
            subscribeToUpdates: subscribeToUpdates,
          }
        : {}),
    });
  });

  return (
    <form onSubmit={handleSubmit} className="flex w-full grow flex-col">
      <div className="flex w-full flex-col gap-4 px-4 py-6 lg:p-6">
        <FormFieldSetup
          errorMessage={
            form.getFieldState("name", form.formState).error?.message
          }
          label="Name"
          htmlFor="name"
          isRequired={false}
        >
          <Input
            placeholder="Company Inc."
            className="bg-background"
            type="text"
            {...form.register("name")}
            id="name"
          />
        </FormFieldSetup>

        <FormFieldSetup
          isRequired
          htmlFor="email"
          errorMessage={
            form.getFieldState("email", form.formState).error?.message
          }
          label="Email"
        >
          <Input
            placeholder="you@company.com"
            className="bg-background"
            type="email"
            {...form.register("email")}
            id="email"
          />
        </FormFieldSetup>

        <CheckboxWithLabel>
          <Checkbox
            checked={subscribeToUpdates}
            onCheckedChange={(v) => setSubscribeToUpdates(!!v)}
          />
          Subscribe to new features and key product updates
        </CheckboxWithLabel>
      </div>

      <div className="mt-8 flex justify-end border-t px-4 py-6 lg:p-6">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={props.isSubmitting}
          className="gap-2 px-6"
        >
          Get Started
          {props.isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
        </Button>
      </div>
    </form>
  );
}

const loginFormSchema = z.object({
  email: emailSchema,
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

function LoginForm(props: {
  onSubmit: (values: {
    email: string;
  }) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    values: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    props.onSubmit(values);
  });

  return (
    <form onSubmit={handleSubmit} className="flex w-full grow flex-col">
      <div className="flex w-full flex-col gap-4 px-4 py-6 lg:p-6">
        <FormFieldSetup
          isRequired
          htmlFor="email"
          errorMessage={
            form.getFieldState("email", form.formState).error?.message
          }
          label="Email"
        >
          <Input
            placeholder="you@company.com"
            type="email"
            className="bg-background"
            {...form.register("email")}
            id="email"
          />
        </FormFieldSetup>
      </div>

      <div className="mt-6 flex justify-end border-t px-4 py-6 lg:p-6">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={props.isSubmitting}
          className="gap-2 px-6"
        >
          Login
          {props.isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
