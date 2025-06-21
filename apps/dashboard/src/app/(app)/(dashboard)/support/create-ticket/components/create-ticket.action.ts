"use server";
import "server-only";

import { getTeamById } from "@/api/team";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";

type State = {
  success: boolean;
  message: string;
};

const UNTHREAD_API_KEY = process.env.UNTHREAD_API_KEY || "";

const planToCustomerId = {
  accelerate: process.env.UNTHREAD_ACCELERATE_TIER_ID as string,
  free: process.env.UNTHREAD_FREE_TIER_ID as string,
  growth: process.env.UNTHREAD_GROWTH_TIER_ID as string,
  pro: process.env.UNTHREAD_PRO_TIER_ID as string,
  scale: process.env.UNTHREAD_SCALE_TIER_ID as string,
  // treat starter as free
  starter: process.env.UNTHREAD_FREE_TIER_ID as string,
} as const;

function isValidPlan(plan: string): plan is keyof typeof planToCustomerId {
  return plan in planToCustomerId;
}

function prepareEmailTitle(
  product: string,
  problemArea: string,
  email: string,
  name: string,
) {
  const title =
    product && problemArea
      ? `${product}: ${problemArea} (${email})`
      : `New ticket from ${name} (${email})`;
  return title;
}

function prepareEmailBody(props: {
  product: string;
  markdownInput: string;
  email: string;
  name: string;
  extraInfoInput: Record<string, string>;
  walletAddress: string;
  telegramHandle: string;
}) {
  const {
    extraInfoInput,
    email,
    walletAddress,
    product,
    name,
    markdownInput,
    telegramHandle,
  } = props;
  // Update `markdown` to include the infos from the form
  const extraInfo = Object.keys(extraInfoInput)
    .filter((key) => key.startsWith("extraInfo_"))
    .map((key) => {
      const prettifiedKey = `# ${key
        .replace("extraInfo_", "")
        .replaceAll("_", " ")}`;
      return `${prettifiedKey}: ${extraInfoInput[key] ?? "N/A"}\n`;
    })
    .join("");
  const markdown = `# Email: ${email}
  # Name: ${name}
  # Telegram: ${telegramHandle}
  # Wallet address: ${walletAddress}
  # Product: ${product}
  ${extraInfo}
  # Message:
  ${markdownInput}
  `;
  return markdown;
}

export async function createTicketAction(
  _previousState: State,
  formData: FormData,
) {
  const teamId = formData.get("teamId")?.toString();

  if (!teamId) {
    return {
      message: "teamId is required",
      success: false,
    };
  }

  const team = await getTeamById(teamId);

  if (!team) {
    return {
      message: `Team with id "${teamId}" not found`,
      success: false,
    };
  }

  const [walletAddress, account] = await Promise.all([
    getAuthTokenWalletAddress(),
    getRawAccount(),
  ]);

  if (!walletAddress || !account) {
    loginRedirect("/support");
  }

  const customerId = isValidPlan(team.supportPlan)
    ? // fall back to "free" tier
      planToCustomerId[team.supportPlan] || planToCustomerId.free
    : // fallback to "free" tier
      planToCustomerId.free;

  const product = formData.get("product")?.toString() || "";
  const problemArea = formData.get("extraInfo_Problem_Area")?.toString() || "";
  const telegramHandle = formData.get("telegram")?.toString() || "";

  const title = prepareEmailTitle(
    product,
    problemArea,
    account.email || "",
    account.name || "",
  );

  const keyVal: Record<string, string> = {};
  for (const key of formData.keys()) {
    keyVal[key] = formData.get(key)?.toString() || "";
  }

  const markdown = prepareEmailBody({
    email: account.email || "",
    extraInfoInput: keyVal,
    markdownInput: keyVal.markdown || "",
    name: account.name || "",
    product,
    telegramHandle: telegramHandle,
    walletAddress: walletAddress,
  });

  const content = {
    customerId,
    emailInboxId: process.env.UNTHREAD_EMAIL_INBOX_ID,
    markdown,
    onBehalfOf: {
      email: account.email,
      id: account.id,
      name: account.name,
    },
    status: "open",
    title,
    triageChannelId: process.env.UNTHREAD_TRIAGE_CHANNEL_ID,
    type: "email",
  };

  // check files
  const files = formData.getAll("files") as File[];

  if (files.length > 10) {
    return { message: "You can only attach 10 files at once.", success: false };
  }
  if (files.some((file) => file.size > 10 * 1024 * 1024)) {
    return { message: "The max file size is 20MB.", success: false };
  }

  // add the content
  formData.append("json", JSON.stringify(content));

  const KEEP_FIELDS = ["attachments", "json"];
  const keys = [...formData.keys()];
  // delete everything except attachments off of the form data
  for (const key of keys) {
    if (!KEEP_FIELDS.includes(key)) {
      formData.delete(key);
    }
  }

  // actually create the ticket
  const res = await fetch("https://api.unthread.io/api/conversations", {
    body: formData,
    headers: {
      "X-Api-Key": UNTHREAD_API_KEY,
    },
    method: "POST",
  });
  if (!res.ok) {
    console.error(
      "Failed to create ticket",
      res.status,
      res.statusText,
      await res.text(),
    );
    return {
      message: "Failed to create ticket, please try again later.",
      success: false,
    };
  }

  return {
    message: "Ticket created successfully",
    success: true,
  };
}
