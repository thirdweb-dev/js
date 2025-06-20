"use client";

import { SupportForm_SelectInput } from "components/help/contact-forms/shared/SupportForm_SelectInput";
import { SupportForm_TeamSelection } from "components/help/contact-forms/shared/SupportForm_TeamSelection";
import { SupportForm_TelegramInput } from "components/help/contact-forms/shared/SupportForm_TelegramInput";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createTicketAction } from "./create-ticket.action";

const ConnectSupportForm = dynamic(
  () => import("../../../../../../components/help/contact-forms/connect"),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const EngineSupportForm = dynamic(
  () => import("../../../../../../components/help/contact-forms/engine"),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const ContractSupportForm = dynamic(
  () => import("../../../../../../components/help/contact-forms/contracts"),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const AccountSupportForm = dynamic(
  () => import("../../../../../../components/help/contact-forms/account"),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const OtherSupportForm = dynamic(
  () => import("../../../../../../components/help/contact-forms/other"),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);

const productOptions: { label: string; component: ReactElement }[] = [
  {
    component: <ConnectSupportForm />,
    label: "Connect",
  },
  {
    component: <EngineSupportForm />,
    label: "Engine",
  },
  {
    component: <ContractSupportForm />,
    label: "Contracts",
  },
  {
    component: <AccountSupportForm />,
    label: "Account",
  },
  {
    component: <OtherSupportForm />,
    label: "Other",
  },
];

function ProductAreaSelection(props: {
  productLabel: string;
  setProductLabel: (val: string) => void;
}) {
  const { productLabel, setProductLabel } = props;

  return (
    <div className="flex flex-col gap-6">
      <SupportForm_SelectInput
        formLabel="What do you need help with?"
        name="product"
        onValueChange={setProductLabel}
        options={productOptions.map((o) => o.label)}
        promptText="Select a product"
        required={true}
        value={productLabel}
      />
      {productOptions.find((o) => o.label === productLabel)?.component}
    </div>
  );
}

export function CreateTicket(props: {
  teams: {
    name: string;
    id: string;
  }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(
    props.teams[0]?.id,
  );

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
      action={formAction}
      className="rounded-lg border bg-card"
      ref={formRef}
    >
      <div className="px-4 py-6 lg:px-6">
        <h2 className="font-semibold text-2xl tracking-tight">Get Support</h2>
        <p className="text-muted-foreground">
          We are here to help. Ask product questions, report problems, or leave
          feedback.
        </p>

        <div className="h-7" />

        <div className="flex flex-col gap-6">
          {/* Don't conditionally render this - it has be rendered to submit the input values */}
          <div className={cn(props.teams.length === 1 && "hidden")}>
            <SupportForm_TeamSelection
              onChange={(teamId) => setSelectedTeamId(teamId)}
              selectedTeamId={selectedTeamId}
              teams={props.teams}
            />
          </div>

          <SupportForm_TelegramInput />

          <ProductAreaSelection
            productLabel={productLabel}
            setProductLabel={setProductLabel}
          />
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
      className="flex min-w-24 flex-row gap-2"
      disabled={pending}
      type="submit"
    >
      {pending && <Spinner className="size-4" />}
      {pending ? "Submitting" : "Submit"}
    </Button>
  );
}
