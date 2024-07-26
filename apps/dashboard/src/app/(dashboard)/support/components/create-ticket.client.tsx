"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { SupportForm_SelectInput } from "components/help/contact-forms/shared/SupportForm_SelectInput";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createTicketAction } from "./create-ticket.action";

const ConnectSupportForm = dynamic(
  () => import("../../../../components/help/contact-forms/connect"),
  {
    ssr: false,
  },
);
const EngineSupportForm = dynamic(
  () => import("../../../../components/help/contact-forms/engine"),
  {
    ssr: false,
  },
);
const ContractSupportForm = dynamic(
  () => import("../../../../components/help/contact-forms/contracts"),
  {
    ssr: false,
  },
);
const AccountSupportForm = dynamic(
  () => import("../../../../components/help/contact-forms/account"),
  {
    ssr: false,
  },
);
const OtherSupportForm = dynamic(
  () => import("../../../../components/help/contact-forms/other"),
  {
    ssr: false,
  },
);

const productOptions: { label: string; component: ReactElement }[] = [
  {
    label: "Connect",
    component: <ConnectSupportForm />,
  },
  {
    label: "Engine",
    component: <EngineSupportForm />,
  },
  {
    label: "Contracts",
    component: <ContractSupportForm />,
  },
  {
    label: "Account",
    component: <AccountSupportForm />,
  },
  {
    label: "Other",
    component: <OtherSupportForm />,
  },
];

export function CreateTicket() {
  const formRef = useRef<HTMLFormElement>(null);
  const [productLabel, setProductLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useFormState(createTicketAction, {
    message: "",
    success: false,
  });
  const { user } = useLoggedInUser();
  // needed here
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!state.message) {
      return;
    }
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          formRef.current?.reset();
          setProductLabel("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="primary" className="mt-6" size="lg">
          Get Support
        </Button>
      </DialogTrigger>

      {/* Check this */}
      <DialogContent>
        <form ref={formRef} action={formAction}>
          <DialogHeader>
            <DialogTitle>Get in touch</DialogTitle>
            <DialogDescription>
              We are here to help. Ask product questions, report problems, or
              leave feedback.
            </DialogDescription>
          </DialogHeader>

          {/* render the form */}
          {user?.jwt ? (
            <>
              <div className="py-4 flex flex-col gap-4 mt-3">
                <SupportForm_SelectInput
                  formLabel="What do you need help with?"
                  name="product"
                  options={productOptions.map((o) => o.label)}
                  promptText="Select a product"
                  onValueChange={setProductLabel}
                  value={productLabel}
                  required={true}
                />
                {
                  productOptions.find((o) => o.label === productLabel)
                    ?.component
                }
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    formRef.current?.reset();
                    setProductLabel("");
                  }}
                  variant="outline"
                >
                  Reset
                </Button>
                <SubmitButton />
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col gap-2 py-4 mt-4">
              <Button variant="default" asChild size="lg">
                <Link href={`/login?next=${encodeURIComponent("/support")}`}>
                  Sign In
                </Link>
              </Button>
              <p className="text-center text-xs text-warning-foreground">
                Please sign in to create a ticket
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex flex-row gap-2">
      {pending && <Spinner className="size-4" />}
      {pending ? "Submitting" : "Submit"}
    </Button>
  );
}
