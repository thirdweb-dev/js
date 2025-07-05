import { loginRedirect } from "@app/login/loginRedirect";
import type { AbiFunction } from "abitype";
import { notFound, redirect } from "next/navigation";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getCompilerMetadata } from "thirdweb/contract";
import { decodeFunctionData, toFunctionSelector } from "thirdweb/utils";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import type { Transaction } from "../../analytics/tx-table/types";
import {
	getSingleTransaction,
	getTransactionActivityLogs,
} from "../../lib/analytics";
import { TransactionDetailsUI } from "./transaction-details-ui";

type AbiItem =
	| AbiFunction
	| {
			type: string;
			name?: string;
	  };

export type DecodedTransactionData = {
	contractName: string;
	functionName: string;
	functionArgs: Record<string, unknown>;
} | null;

export type DecodedTransactionResult = DecodedTransactionData[];

async function decodeSingleTransactionParam(
	txParam: any,
	chainId: number,
): Promise<DecodedTransactionData> {
	try {
		if (!txParam || !txParam.to || !txParam.data) {
			return null;
		}

		// Create contract instance
		const contract = getContract({
			client: serverThirdwebClient,
			address: txParam.to,
			chain: defineChain(chainId),
		});

		// Fetch compiler metadata
		const compilerMetadata = await getCompilerMetadata(contract);

		if (!compilerMetadata || !compilerMetadata.abi) {
			return null;
		}

		const contractName = compilerMetadata.name || "Unknown Contract";
		const abi = compilerMetadata.abi;

		// Extract function selector from transaction data (first 4 bytes)
		const functionSelector = txParam.data.slice(0, 10) as `0x${string}`;

		// Find matching function in ABI
		const functions = (abi as readonly AbiItem[]).filter(
			(item): item is AbiFunction => item.type === "function",
		);
		let matchingFunction: AbiFunction | null = null;

		for (const func of functions) {
			const selector = toFunctionSelector(func);
			if (selector === functionSelector) {
				matchingFunction = func;
				break;
			}
		}

		if (!matchingFunction) {
			return null;
		}

		const functionName = matchingFunction.name;

		// Decode function data
		const decodedArgs = (await decodeFunctionData({
			contract: getContract({
				...contract,
				abi: [matchingFunction],
			}),
			data: txParam.data,
		})) as readonly unknown[];

		// Create a clean object for display
		const functionArgs: Record<string, unknown> = {};
		if (matchingFunction.inputs && decodedArgs) {
			for (let index = 0; index < matchingFunction.inputs.length; index++) {
				const input = matchingFunction.inputs[index];
				if (input) {
					functionArgs[input.name || `arg${index}`] = decodedArgs[index];
				}
			}
		}

		return {
			contractName,
			functionName,
			functionArgs,
		};
	} catch (error) {
		console.error("Error decoding transaction param:", error);
		return null;
	}
}

async function decodeTransactionData(
	transaction: Transaction,
): Promise<DecodedTransactionResult> {
	try {
		// Check if we have transaction parameters
		if (
			!transaction.transactionParams ||
			transaction.transactionParams.length === 0
		) {
			return [];
		}

		// Ensure we have a chainId
		if (!transaction.chainId) {
			return [];
		}

		const chainId = parseInt(transaction.chainId);

		// Decode all transaction parameters in parallel
		const decodingPromises = transaction.transactionParams.map((txParam) =>
			decodeSingleTransactionParam(txParam, chainId),
		);

		const results = await Promise.all(decodingPromises);
		return results;
	} catch (error) {
		console.error("Error decoding transaction:", error);
		return [];
	}
}

export default async function TransactionPage({
	params,
}: {
	params: Promise<{ team_slug: string; project_slug: string; id: string }>;
}) {
	const { team_slug, project_slug, id } = await params;

	const [authToken, project] = await Promise.all([
		getAuthToken(),
		getProject(team_slug, project_slug),
	]);

	if (!authToken) {
		loginRedirect(`/team/${team_slug}/${project_slug}/transactions/tx/${id}`);
	}

	if (!project) {
		redirect(`/team/${team_slug}`);
	}

	const [transactionData, activityLogs] = await Promise.all([
		getSingleTransaction({
			clientId: project.publishableKey,
			teamId: project.teamId,
			transactionId: id,
		}),
		getTransactionActivityLogs({
			clientId: project.publishableKey,
			teamId: project.teamId,
			transactionId: id,
		}),
	]);

	const client = getClientThirdwebClient({
		jwt: authToken,
		teamId: project.teamId,
	});

	if (!transactionData) {
		notFound();
	}

	// Decode transaction data on the server
	const decodedTransactionData = await decodeTransactionData(transactionData);

	return (
		<div className="space-y-6 p-2">
			<TransactionDetailsUI
				activityLogs={activityLogs}
				client={client}
				project={project}
				teamSlug={team_slug}
				transaction={transactionData}
				decodedTransactionData={decodedTransactionData}
			/>
		</div>
	);
}
