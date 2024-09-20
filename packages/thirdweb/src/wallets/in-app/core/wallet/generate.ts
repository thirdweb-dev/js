import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { generateWallet } from "../../web/lib/actions/generate-wallet.enclave.js";
import type { Ecosystem } from "../../web/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "../authentication/types.js";

type PhoneAccountGenerationOptions = {
	phone: string;
	strategy: "phone";
};

type EmailAccountGenerationOptions = {
	email: string;
	strategy: "email";
};

type CustomAuthGenerationOptions = {
	strategy: "custom_auth";
	userId: string;
};

type CustomJwtGenerationOptions = {
	strategy: "custom_jwt";
	userId: string;
};

type AccountGenerationOptions =
	| EmailAccountGenerationOptions
	| PhoneAccountGenerationOptions
	| CustomAuthGenerationOptions
	| CustomJwtGenerationOptions;

export async function generateInAppWallet(
	options: {
		client: ThirdwebClient;
		ecosystem: Ecosystem;
	} & AccountGenerationOptions,
) {
	const { strategy, client, ecosystem } = options;
	const clientFetch = getClientFetch(client, ecosystem);

	const url = new URL(
		`${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/pregenerate`,
	);

	switch (strategy) {
		case "email":
			url.searchParams.append("email", options.email);
			break;
		case "phone":
			url.searchParams.append("phone", options.phone);
			break;
		case "custom_auth":
			break;
		case "custom_jwt":
			url.searchParams.append("userId", options.userId);
			break;
	}

	url.searchParams.append("strategy", strategy);

	const existingUserResult = await clientFetch(url.toString(), {
		method: "GET",
	});

	if (!existingUserResult.ok) {
		const body = await existingUserResult.json();
		throw new Error(`Failed to generate account: ${body.message}`);
	}

	const { walletAddress } = await existingUserResult.json();

	// If a wallet address is returned, this user already has an account
	if (walletAddress) {
		return walletAddress;
	}

	const payload: Record<string, string> = { strategy };

	switch (strategy) {
		case "email":
			payload.email = options.email;
			break;
		case "phone":
			payload.phone = options.phone;
			break;
		case "custom_auth":
			payload.userId = options.userId;
			break;
		case "custom_jwt":
			payload.userId = options.userId;
			break;
	}
	const userGenerationResult = await clientFetch(
		`${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/pregenerate/callback`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		},
	);

	if (!userGenerationResult.ok) {
		const body = await userGenerationResult.json();
		throw new Error(`Failed to generate account: ${body.message}`);
	}

	const authResult =
		(await userGenerationResult.json()) as AuthStoredTokenWithCookieReturnType;

	const generatedWallet = await generateWallet({
		client,
		ecosystem,
		authToken: authResult.storedToken.cookieString,
	});

	return generatedWallet.address;
}
