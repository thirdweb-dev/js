"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TabButtons } from "@/components/ui/tabs";
import {
  type AccountValidationSchema,
  accountValidationSchema,
  emailSchema,
} from "../validations";

export function LoginOrSignup(props: {
  onRequestSent: (options: { email: string; isExistingEmail: boolean }) => void;
  loginOrSignup: (input: {
    email: string;
    subscribeToUpdates?: true;
    name?: string;
  }) => Promise<void>;
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
      },
      onSuccess: () => {
        props.onRequestSent({
          email: values.email,
          isExistingEmail: false,
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
            isActive: tab === "signup",
            name: "Create account",
            onClick: () => setTab("signup"),
          },
          {
            isActive: tab === "login",
            name: "I already have an account",
            onClick: () => setTab("login"),
          },
        ]}
      />

      {tab === "signup" && (
        <SignupForm
          isSubmitting={loginOrSignup.isPending}
          key="signup"
          onSubmit={handleSubmit}
        />
      )}

      {tab === "login" && (
        <LoginForm
          isSubmitting={loginOrSignup.isPending}
          key="login"
          onSubmit={handleSubmit}
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
      email: "",
      name: "",
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
  const nameId = useId();
  const emailId = useId();
  return (
    <form className="flex w-full grow flex-col" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-4 px-4 py-6 lg:p-6">
        <FormFieldSetup
          errorMessage={
            form.getFieldState("name", form.formState).error?.message
          }
          htmlFor={nameId}
          isRequired={false}
          label="Name"
        >
          <Input
            className="bg-background"
            placeholder="Company Inc."
            type="text"
            {...form.register("name")}
            id={nameId}
          />
        </FormFieldSetup>

        <FormFieldSetup
          errorMessage={
            form.getFieldState("email", form.formState).error?.message
          }
          htmlFor={emailId}
          isRequired
          label="Email"
        >
          <Input
            className="bg-background"
            placeholder="you@company.com"
            type="email"
            {...form.register("email")}
            id={emailId}
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
          className="gap-2 px-6"
          disabled={props.isSubmitting}
          onClick={handleSubmit}
          type="button"
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
  onSubmit: (values: { email: string }) => void;
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

  const emailId = useId();
  return (
    <form className="flex w-full grow flex-col" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-4 px-4 py-6 lg:p-6">
        <FormFieldSetup
          errorMessage={
            form.getFieldState("email", form.formState).error?.message
          }
          htmlFor={emailId}
          isRequired
          label="Email"
        >
          <Input
            className="bg-background"
            placeholder="you@company.com"
            type="email"
            {...form.register("email")}
            id={emailId}
          />
        </FormFieldSetup>
      </div>

      <div className="mt-6 flex justify-end border-t px-4 py-6 lg:p-6">
        <Button
          className="gap-2 px-6"
          disabled={props.isSubmitting}
          onClick={handleSubmit}
          type="button"
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
