"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportForm_SelectInput } from "components/help/contact-forms/shared/SupportForm_SelectInput";
import dynamic from "next/dynamic";
import {
  type ReactElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createTicketAction } from "./create-ticket.action";

const ConnectSupportForm = dynamic(
  () => import("../../../../../components/help/contact-forms/connect"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12" />,
  },
);
const EngineSupportForm = dynamic(
  () => import("../../../../../components/help/contact-forms/engine"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12" />,
  },
);
const ContractSupportForm = dynamic(
  () => import("../../../../../components/help/contact-forms/contracts"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12" />,
  },
);
const AccountSupportForm = dynamic(
  () => import("../../../../../components/help/contact-forms/account"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12" />,
  },
);
const OtherSupportForm = dynamic(
  () => import("../../../../../components/help/contact-forms/other"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12" />,
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

  const [state, formAction] = useActionState(createTicketAction, {
    message: "",
    success: false,
  });
  // needed here
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!state.message) {
      return;
    }
    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-lg border bg-card"
    >
      <div className="px-4 py-6 lg:px-6">
        <h2 className="font-semibold text-2xl tracking-tight">Get Support</h2>
        <p className="text-muted-foreground">
          We are here to help. Ask product questions, report problems, or leave
          feedback.
        </p>

        <div className="h-7" />

        <div className="flex flex-col gap-6">
          <SupportForm_SelectInput
            formLabel="What do you need help with?"
            name="product"
            options={productOptions.map((o) => o.label)}
            promptText="Select a product"
            onValueChange={setProductLabel}
            value={productLabel}
            required={true}
          />
          {productOptions.find((o) => o.label === productLabel)?.component}
        </div>
      </div>

      <div className="h-7" />

      <div className="flex justify-end gap-3 border-t px-4 py-6 lg:px-6">
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
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex min-w-24 flex-row gap-2"
    >
      {pending && <Spinner className="size-4" />}
      {pending ? "Submitting" : "Submit"}
    </Button>
  );
}
