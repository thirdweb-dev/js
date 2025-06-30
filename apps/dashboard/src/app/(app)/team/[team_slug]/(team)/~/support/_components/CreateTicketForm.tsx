"use client";

import { BotIcon, MessageCircleIcon, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createSupportTicket } from "@/api/support";
import type { Team } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@/hooks/useApi";
import { siwaExamplePrompts } from "../../../../../../(dashboard)/support/definitions";

// Import shared components from the new local system
import { SupportForm_SelectInput } from "./shared/SupportForm_SelectInput";
import { SupportForm_TelegramInput } from "./shared/SupportForm_TelegramInput";

// Dynamic imports for contact forms
const ConnectSupportForm = dynamic(() => import("./contact-forms/connect"), {
	loading: () => <Skeleton className="h-12" />,
	ssr: false,
});
const EngineSupportForm = dynamic(() => import("./contact-forms/engine"), {
	loading: () => <Skeleton className="h-12" />,
	ssr: false,
});
const ContractSupportForm = dynamic(() => import("./contact-forms/contracts"), {
	loading: () => <Skeleton className="h-12" />,
	ssr: false,
});
const AccountSupportForm = dynamic(() => import("./contact-forms/account"), {
	loading: () => <Skeleton className="h-12" />,
	ssr: false,
});
const OtherSupportForm = dynamic(() => import("./contact-forms/other"), {
	loading: () => <Skeleton className="h-12" />,
	ssr: false,
});

interface CreateTicketFormProps {
	team: Team;
	account: Account;
	teamSlug: string;
	authToken?: string;
}

const productOptions = [
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
				promptText="Brief description of your issue"
				required={true}
				value={productLabel}
			/>
			{productOptions.find((o) => o.label === productLabel)?.component}
		</div>
	);
}

export function CreateTicketForm({
	team,
	account,
	teamSlug,
	authToken,
}: CreateTicketFormProps) {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [productLabel, setProductLabel] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!productLabel) {
			toast.error("Please select what you need help with");
			return;
		}

		const formData = new FormData(formRef.current!);
		const description = formData.get("markdown") as string;

		if (!description?.trim()) {
			toast.error("Please provide a description");
			return;
		}

		setIsSubmitting(true);

		try {
			// Extract attachments from form data
			const attachmentFiles = formData.getAll("attachments") as File[];
			const validAttachments = attachmentFiles.filter((file) => file.size > 0);

			// Build detailed description from form data
			let detailedDescription = description;
			const extraFields = Array.from(formData.entries()).filter(([key]) =>
				key.startsWith("extraInfo_"),
			);

			if (extraFields.length > 0) {
				detailedDescription += "\n\n--- Additional Information ---";
				extraFields.forEach(([key, value]) => {
					if (value) {
						const fieldName = key.replace("extraInfo_", "").replace(/_/g, " ");
						detailedDescription += `\n${fieldName}: ${value}`;
					}
				});
			}

			await createSupportTicket({
				attachments: validAttachments.length > 0 ? validAttachments : undefined,
				customerId: team.unthreadCustomerId || "",
				message: detailedDescription,
				onBehalfOf: {
					email: team.billingEmail || account.email || "no-email@example.com",
					id: team.unthreadCustomerId || "",
					name: team.name,
				},
				title: `${productLabel} - Support Request`,
			});

			toast.success("Support ticket created successfully!");
			router.push(`/team/${teamSlug}/~/support`);
		} catch (error) {
			console.error("Error creating support ticket:", error);
			toast.error("Failed to create support ticket. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		router.push(`/team/${teamSlug}/~/support`);
	};

	const handleReset = () => {
		formRef.current?.reset();
		setProductLabel("");
	};

	return (
		<div className="min-h-screen bg-[#000000] text-white">
			<div className="container mx-auto p-6">
				<div className="mb-4 flex items-center justify-between">
					<Button
						className="border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:text-white"
						onClick={handleCancel}
						variant="outline"
					>
						← Back to Support Portal
					</Button>
					<Button
						className="border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:text-white"
						onClick={handleCancel}
						variant="outline"
					>
						<XIcon className="w-4 h-4" />
					</Button>
				</div>

				<div className="max-w-2xl mx-auto">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-white mb-2">Get Support</h1>
						<p className="text-[#737373]">
							We are here to help. Ask product questions, report problems, or
							leave feedback.
						</p>
					</div>

					{/* AI Chat Suggestion */}
					<div className="border border-[#1F1F1F] bg-[#0A0A0A] p-6 rounded-lg mb-6">
						<div className="flex items-start gap-4">
							<div className="bg-[#2663EB]/10 p-3 rounded-lg">
								<MessageCircleIcon className="w-6 h-6 text-[#2663EB]" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-medium text-white mb-2">
									Try our AI assistant first
								</h3>
								<p className="text-[#737373] mb-4">
									Get instant answers to common questions and troubleshooting
									help.
								</p>
								<div className="inline-block [&>button]:border-[#2663EB] [&>button]:bg-[#2663EB]/10 [&>button]:text-[#2663EB] [&>button]:hover:bg-[#2663EB]/20 [&>button]:hover:text-[#2663EB] [&>button]:rounded-md [&>button]:shadow-none">
									<CustomChatButton
										authToken={authToken}
										clientId={undefined}
										examplePrompts={siwaExamplePrompts}
										isFloating={false}
										isLoggedIn={!!authToken}
										label="Chat with Nebula AI"
										networks="all"
										pageType="support"
										teamId={team.id}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Support Form */}
					<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
						<div className="border border-[#1F1F1F] bg-[#0A0A0A] p-6 rounded-lg space-y-6">
							{/* Your Projects Section */}
							<div className="space-y-3">
								<SupportForm_TelegramInput />
							</div>

							{/* What do you need help with Section */}
							<ProductAreaSelection
								productLabel={productLabel}
								setProductLabel={setProductLabel}
							/>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end gap-3">
							<Button
								className="border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:text-white"
								disabled={isSubmitting}
								onClick={handleCancel}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white"
								disabled={isSubmitting}
								type="submit"
							>
								{isSubmitting ? "Creating..." : "Create Support Case"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
