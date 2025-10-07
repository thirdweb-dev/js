"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	CopyIcon,
	EllipsisVerticalIcon,
	RefreshCcwIcon,
	SendIcon,
	WalletIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toWei } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
import { isAddress } from "thirdweb/utils";
import { z } from "zod";
import { sendProjectWalletTokens } from "@/actions/project-wallet/send-tokens";
import type { Project } from "@/api/project/projects";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { cn } from "@/lib/utils";

type ProjectWalletControlsProps = {
	walletAddress: string;
	label: string;
	project: Pick<Project, "id" | "publishableKey" | "teamId" | "services">;
	defaultChainId?: number;
};

export function ProjectWalletControls(props: ProjectWalletControlsProps) {
	const { walletAddress, label, project, defaultChainId } = props;
	const [isSendOpen, setIsSendOpen] = useState(false);
	const [isReceiveOpen, setIsReceiveOpen] = useState(false);
	const [selectedChainId, setSelectedChainId] = useState(defaultChainId ?? 1);

	const client = useMemo(() => getClientThirdwebClient(), []);
	const chain = useV5DashboardChain(selectedChainId);

	const engineCloudService = useMemo(
		() => project.services?.find((service) => service.name === "engineCloud"),
		[project.services],
	);
	const isManagedVault = !!engineCloudService?.encryptedAdminKey;

	const balanceQuery = useWalletBalance({
		address: walletAddress,
		chain,
		client,
	});

	const balanceDisplay = balanceQuery.data
		? `${balanceQuery.data.displayValue} ${balanceQuery.data.symbol}`
		: undefined;

	const handleCopyAddress = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(walletAddress);
			toast.success("Wallet address copied");
		} catch (error) {
			console.error("Failed to copy wallet address", error);
			toast.error("Unable to copy the address");
		}
	}, [walletAddress]);

	return (
		<div className="space-y-5">
			<div className="rounded-lg border border-dashed border-border/60 bg-background p-3">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<p className="text-muted-foreground text-xs uppercase">
								Wallet address
							</p>
							<p className="font-mono text-sm break-all">{walletAddress}</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									aria-label="Open wallet actions"
									className="h-9 w-9"
									size="icon"
									variant="outline"
								>
									<EllipsisVerticalIcon className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48 rounded-xl">
								<DropdownMenuItem
									className="flex items-center gap-2"
									onSelect={() => {
										void handleCopyAddress();
									}}
								>
									<CopyIcon className="size-4 text-muted-foreground" />
									Copy address
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="flex items-center gap-2"
									onSelect={() => setIsSendOpen(true)}
								>
									<SendIcon className="size-4 text-muted-foreground" />
									Send funds
								</DropdownMenuItem>
								<DropdownMenuItem
									className="flex items-center gap-2"
									onSelect={() => setIsReceiveOpen(true)}
								>
									<WalletIcon className="size-4 text-muted-foreground" />
									Receive funds
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs font-medium uppercase text-muted-foreground">
								Balance
							</p>
							<div className="mt-1 flex items-center gap-2">
								<WalletIcon className="size-4 text-muted-foreground" />
								{balanceQuery.isLoading ? (
									<Spinner className="size-4" />
								) : balanceDisplay ? (
									<span className="font-semibold text-lg tracking-tight">
										{balanceDisplay}
									</span>
								) : (
									<span className="text-muted-foreground text-sm">N/A</span>
								)}
								<Button
									aria-label="Refresh balance"
									className="h-8 w-8 p-0"
									disabled={balanceQuery.isFetching}
									onClick={() => balanceQuery.refetch()}
									size="icon"
									variant="outline"
								>
									<RefreshCcwIcon
										className={cn(
											"size-4",
											balanceQuery.isFetching && "animate-spin",
										)}
									/>
								</Button>
							</div>
						</div>
						<SingleNetworkSelector
							chainId={selectedChainId}
							className="w-full max-w-xs rounded-lg"
							client={client}
							disableDeprecated
							disableChainId
							onChange={setSelectedChainId}
							placeholder="Select network"
						/>
					</div>
				</div>
			</div>

			<SendProjectWalletModal
				chainId={selectedChainId}
				client={client}
				isManagedVault={isManagedVault}
				label={label}
				onClose={() => setIsSendOpen(false)}
				onSuccess={() => balanceQuery.refetch()}
				open={isSendOpen}
				publishableKey={project.publishableKey}
				teamId={project.teamId}
				walletAddress={walletAddress}
			/>

			<FundWalletModal
				checkoutWidgetTitle={`Fund ${label}`}
				client={client}
				defaultChainId={selectedChainId}
				description="Use your card or crypto to deposit into this server wallet"
				onOpenChange={setIsReceiveOpen}
				open={isReceiveOpen}
				recipientAddress={walletAddress}
				title="Fund project wallet"
			/>
		</div>
	);
}

const createSendFormSchema = (secretKeyLabel: string) =>
	z.object({
		chainId: z.number({
			required_error: "Select a network",
		}),
		toAddress: z
			.string()
			.trim()
			.min(1, "Destination address is required")
			.refine((value) => Boolean(isAddress(value)), {
				message: "Enter a valid wallet address",
			}),
		amount: z.string().trim().min(1, "Amount is required"),
		secretKey: z.string().trim().min(1, `${secretKeyLabel} is required`),
		vaultAccessToken: z.string().trim(),
	});

const SECRET_KEY_LABEL = "Project secret key";

type SendFormValues = z.infer<ReturnType<typeof createSendFormSchema>>;

function SendProjectWalletModal(props: {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	walletAddress: string;
	publishableKey: string;
	teamId: string;
	chainId: number;
	label: string;
	client: ReturnType<typeof getClientThirdwebClient>;
	isManagedVault: boolean;
}) {
	const {
		open,
		onClose,
		onSuccess,
		walletAddress,
		publishableKey,
		teamId,
		chainId,
		label,
		client,
		isManagedVault,
	} = props;

	const secretKeyLabel = SECRET_KEY_LABEL;
	const secretKeyPlaceholder = "Enter your project secret key";
	const secretKeyHelper =
		"Your project secret key was generated when you created your project. If you lost it, regenerate one from Project settings.";
	const vaultAccessTokenHelper =
		"Vault access tokens are optional credentials with server wallet permissions. Manage them in Vault settings.";

	const formSchema = useMemo(() => createSendFormSchema(SECRET_KEY_LABEL), []);

	const form = useForm<SendFormValues>({
		defaultValues: {
			amount: "0",
			chainId,
			secretKey: "",
			vaultAccessToken: "",
			toAddress: "",
		},
		mode: "onChange",
		resolver: zodResolver(formSchema),
	});

	const selectedChain = useV5DashboardChain(form.watch("chainId"));

	// eslint-disable-next-line no-restricted-syntax -- form submission chainId must track selector state
	useEffect(() => {
		form.setValue("chainId", chainId);
	}, [chainId, form]);

	// eslint-disable-next-line no-restricted-syntax -- reset cached inputs when modal closes to avoid leaking state
	useEffect(() => {
		if (!open) {
			const currentValues = form.getValues();
			form.reset({
				amount: "0",
				chainId,
				secretKey: currentValues.secretKey ?? "",
				vaultAccessToken: currentValues.vaultAccessToken ?? "",
				toAddress: "",
			});
		}
	}, [open, chainId, form]);

	const sendMutation = useMutation({
		mutationFn: async (values: SendFormValues) => {
			const quantityWei = toWei(values.amount).toString();
			const secretKeyValue = values.secretKey.trim();
			const vaultAccessTokenValue = values.vaultAccessToken.trim();

			const result = await sendProjectWalletTokens({
				chainId: values.chainId,
				publishableKey,
				quantityWei,
				recipientAddress: values.toAddress,
				teamId,
				walletAddress,
				secretKey: secretKeyValue,
				...(vaultAccessTokenValue
					? { vaultAccessToken: vaultAccessTokenValue }
					: {}),
			});

			if (!result.ok) {
				const errorMessage =
					typeof result.error === "string"
						? result.error
						: "Failed to send funds";
				throw new Error(errorMessage);
			}

			return result.transactionIds;
		},
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (transactionIds) => {
			toast.success("Transfer submitted", {
				description:
					transactionIds && transactionIds.length > 0
						? `Transaction ID: ${transactionIds[0]}`
						: undefined,
			});
			onSuccess();
			onClose();
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					onClose();
				}
			}}
			open={open}
		>
			<DialogContent className="gap-0 p-0">
				<DialogHeader className="p-4 lg:p-6">
					<DialogTitle>Send from {label}</DialogTitle>
					<DialogDescription>
						Execute a one-off transfer using your server wallet.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							void sendMutation.mutateAsync(values);
						})}
					>
						<div className="space-y-4 px-4 pb-8 lg:px-6">
							<FormField
								control={form.control}
								name="chainId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Network</FormLabel>
										<FormControl>
											<SingleNetworkSelector
												chainId={field.value}
												className="bg-card"
												client={client}
												disableDeprecated
												onChange={(nextChainId) => {
													field.onChange(nextChainId);
												}}
												placeholder="Select network"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="toAddress"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Send to</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												placeholder="0x..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												inputMode="decimal"
												min="0"
												step="any"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Sending native token
											{selectedChain?.nativeCurrency?.symbol
												? ` (${selectedChain.nativeCurrency.symbol})`
												: ""}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="secretKey"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{secretKeyLabel}</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												autoCorrect="off"
												placeholder={secretKeyPlaceholder}
												spellCheck={false}
												type="password"
												{...field}
											/>
										</FormControl>
										<FormDescription>{secretKeyHelper}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{!isManagedVault && (
								<FormField
									control={form.control}
									name="vaultAccessToken"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Vault access token
												<span className="text-muted-foreground">
													{" "}
													(optional)
												</span>
											</FormLabel>
											<FormControl>
												<Input
													autoComplete="off"
													autoCorrect="off"
													placeholder="Enter a vault access token (optional)"
													spellCheck={false}
													type="password"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												{vaultAccessTokenHelper}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6">
							<Button onClick={onClose} type="button" variant="outline">
								Cancel
							</Button>
							<Button
								className="gap-2"
								disabled={!form.formState.isValid || sendMutation.isPending}
								type="submit"
							>
								{sendMutation.isPending && <Spinner className="size-4" />}
								Submit transfer
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
