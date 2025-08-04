import { LockIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { revalidatePathAction } from "@/actions/revalidate";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { createSupportTicket } from "../apis/support";
import { SupportForm_SelectInput } from "./shared/SupportForm_SelectInput";

// Dynamic imports for contact forms using named exports
const ConnectSupportForm = dynamic(
  () => import("./contact-forms/connect").then((mod) => mod.ConnectSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const EngineSupportForm = dynamic(
  () => import("./contact-forms/engine").then((mod) => mod.EngineSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const ContractSupportForm = dynamic(
  () =>
    import("./contact-forms/contracts").then((mod) => mod.ContractSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const AccountSupportForm = dynamic(
  () => import("./contact-forms/account").then((mod) => mod.AccountSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const OtherSupportForm = dynamic(
  () => import("./contact-forms/other").then((mod) => mod.OtherSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const PaymentsSupportForm = dynamic(
  () =>
    import("./contact-forms/payments").then((mod) => mod.PaymentsSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const TokensMarketplaceSupportForm = dynamic(
  () =>
    import("./contact-forms/tokens-marketplace").then(
      (mod) => mod.TokensMarketplaceSupportForm,
    ),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);

const productOptions = [
  { component: <ConnectSupportForm />, label: "Wallets" },
  { component: <EngineSupportForm />, label: "Transactions" },
  { component: <PaymentsSupportForm />, label: "Payments" },
  { component: <ContractSupportForm />, label: "Contracts" },
  {
    component: <TokensMarketplaceSupportForm />,
    label: "Tokens / Marketplace",
  },
  { component: <AccountSupportForm />, label: "Account" },
  { component: <OtherSupportForm />, label: "Other" },
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
        promptText="Brief description of your issue"
        required={true}
        value={productLabel}
      />
      {productOptions.find((o) => o.label === productLabel)?.component}
    </div>
  );
}

interface SupportTicketFormProps {
  team: Team;
  productLabel: string;
  setProductLabel: (val: string) => void;
  onSuccess?: () => void;
  conversationId?: string;
  closeForm: () => void;
}

export function SupportTicketForm({
  team,
  productLabel,
  setProductLabel,
  onSuccess,
  conversationId,
  closeForm,
}: SupportTicketFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productLabel) {
      toast.error("Please select what you need help with");
      return;
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const description = formData.get("markdown") as string;

    if (!description?.trim()) {
      toast.error("Please provide a description");
      return;
    }

    setIsSubmittingForm(true);

    try {
      // Get all extra fields from the form
      const extraFields = Array.from(formData.entries()).filter(([key]) =>
        key.startsWith("extraInfo_"),
      );

      // Format the message
      let formattedMessage = `Email: ${String(team.billingEmail ?? "-")}`;
      formattedMessage += `\nName: ${String(team.name ?? "-")}`;
      formattedMessage += `\nProduct: ${String(productLabel ?? "-")}`;

      // Add all extra fields above the message
      if (extraFields.length > 0) {
        extraFields.forEach(([key, value]) => {
          if (value) {
            const fieldName = key.replace("extraInfo_", "").replace(/_/g, " ");
            formattedMessage += `\n${fieldName}: ${String(value)}`;
          }
        });
      }

      formattedMessage += `\nMessage:\n${String(description ?? "-")}`;

      if (conversationId) {
        formattedMessage += `\n\n---\nAI Conversation ID: ${conversationId}`;
      }

      const result = await createSupportTicket({
        message: formattedMessage,
        teamSlug: team.slug,
        teamId: team.id,
        title: `${productLabel} Issue - ${team.billingEmail} (${team.billingPlan})`,
        conversationId: conversationId,
      });

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Revalidate the support page to show the newly created case
      await revalidatePathAction(`/team/${team.slug}/support`, "page");

      if (onSuccess) onSuccess();
      if (formRef.current) formRef.current.reset();
      setProductLabel("");
      toast.success("Support ticket created successfully!");
    } catch (error) {
      console.error("Error creating support ticket:", error);
      toast.error("Failed to create support ticket. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (team.billingPlan === "free") {
    return (
      <div className="relative">
        <div className="px-4 lg:px-6 py-16 z-10 relative">
          <div className="flex justify-center">
            <div className="mb-4 border rounded-full p-3 bg-background">
              <LockIcon className="size-5 text-foreground" />
            </div>
          </div>
          <p className="text-sm text-foreground text-center mb-4">
            You are currently on the free plan. <br /> Please upgrade to a paid
            plan to create a support case.
          </p>

          <div className="flex justify-center">
            <Button asChild size="sm">
              <Link
                href={`/team/${team.slug}/~/billing?showPlans=true`}
                onClick={() => {
                  closeForm();
                }}
              >
                Upgrade Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} ref={formRef}>
      <div className="p-4 lg:p-6 max-h-[60vh] overflow-y-auto">
        <ProductAreaSelection
          productLabel={productLabel}
          setProductLabel={setProductLabel}
        />
      </div>
      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 p-4 lg:p-6 border-t border-dashed">
        <Button
          type="submit"
          disabled={isSubmittingForm}
          className="gap-2 disabled:opacity-100"
        >
          {isSubmittingForm ? (
            <>
              <Spinner className="size-4" />
              Creating Support Case
            </>
          ) : (
            "Create Support Case"
          )}
        </Button>
      </div>
    </form>
  );
}
