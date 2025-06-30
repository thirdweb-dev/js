"use server";
import "server-only";
import { cache } from "react";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";
import type { Team } from "./team";

// UNTHREAD_API_KEY is used as X-Api-Key header
const UNTHREAD_API_KEY = process.env.UNTHREAD_API_KEY || "";
const UNTHREAD_BASE_URL =
	process.env.UNTHREAD_BASE_URL || "https://thirdweb.unthread.io";
const UNTHREAD_TRIAGE_CHANNEL_ID = process.env.UNTHREAD_TRIAGE_CHANNEL_ID || "";
const UNTHREAD_EMAIL_INBOX_ID = process.env.UNTHREAD_EMAIL_INBOX_ID || "";

export interface SupportTicket {
	id: string;
	title: string;
	status: "open" | "closed" | "resolved";
	createdAt: string;
	updatedAt: string;
	openedBy: string;
	customerId?: string;
	tags?: string[];
	assignee?: string;
	lastMessage?: string;
	messages?: SupportMessage[];
}

export interface SupportMessage {
	id: string;
	content: string;
	createdAt: string;
	author: {
		name: string;
		email: string;
		type: "user" | "customer";
	};
}

// internal types for Unthread API responses
interface UnthreadConversation {
	id: string;
	friendlyId?: string;
	title?: string;
	summary?: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	lastActivityAt?: string;
	customerId?: string;
	customer?: {
		id: string;
		name: string;
	};
	tags?: Array<{
		id: string;
		name: string;
	}>;
	assignedToUser?: {
		id: string;
		name: string;
	};
	initialMessage?: {
		content: string;
		sentByUser?: {
			name: string;
			email: string;
			type?: string;
		};
	};
	latestMessage?: {
		content: string;
	};
	lastMessage?: {
		content: string;
		author: {
			name: string;
			email: string;
			type?: string;
		};
	};
}

// Reusable types
interface UserInfo {
	id: string;
	email: string;
	name: string;
}

export interface CreateSupportTicketRequest {
	title: string;
	message: string;
	customerId: string; // Team's unthreadCustomerId
	onBehalfOf: UserInfo;
	attachments?: File[];
}

export interface SendMessageRequest {
	ticketId: string;
	message: string;
	onBehalfOf: UserInfo;
	attachments?: File[];
}

// Internal payload types
interface CreateConversationPayload {
	type: "triage" | "email" | "slack";
	markdown: string;
	status: "open" | "in_progress" | "on_hold" | "closed";
	assignedToUserId?: string;
	customerId?: string;
	channelId?: string;
	projectId?: string;
	triageChannelId?: string;
	notes?: string;
	title?: string;
	excludeAnalytics?: boolean;
	emailInboxId?: string;
	ticketTypeId?: string;
	onBehalfOf?: {
		email?: string;
		name?: string;
		id?: string;
	};
}

interface SendMessagePayload {
	body?: {
		type: "html" | "markdown";
		value: string;
	};
	blocks?: any[]; // Block type not defined, using any[] for now
	markdown?: string; // DEPRECATED: Use 'blocks' and/or 'body' instead
	triageThreadTs?: string;
	isPrivateNote?: boolean; // Only applicable for email and in-app chat conversations
	isAutoresponse?: boolean; // Set this to true to treat this as a bot auto-response
	onBehalfOf?: {
		email?: string;
		name?: string;
		id?: string;
	};
}

function mapUnthreadMessage(
	msg: {
		ts?: string;
		id?: string;
		text?: string;
		content?: string;
		timestamp?: string;
		createdAt?: string;
		isPrivateNote?: boolean;
		user?: {
			name: string;
			email: string;
			type?: string;
		};
		sentByUser?: {
			id: string;
			name: string;
			email: string;
			type?: string;
		} | null;
	},
	customerId?: string,
): SupportMessage | null {
	// Filter out private notes - they should not be shown to customers
	if (msg.isPrivateNote) {
		return null;
	}

	// Filter out messages without sentByUser (system messages)
	if (!msg.sentByUser) {
		return null;
	}

	const author = msg.user || msg.sentByUser;

	// Determine if this is the customer or support
	const isCustomer = customerId && msg.sentByUser.id === customerId;

	const authorType = isCustomer ? "customer" : "user";
	const authorName = isCustomer ? "" : author?.name || "Support";

	// Clean up the message content and remove /unthread send commands
	const content = (msg.text || msg.content || "")
		.replace(/\/unthread\s+send/gi, "")
		.trim();

	return {
		author: {
			email: author?.email || "",
			name: authorName,
			type: authorType,
		},
		content: content,
		createdAt: msg.timestamp || msg.createdAt || "",
		id: msg.ts || msg.id || "",
	};
}

function mapUnthreadToSupportTicket(
	conversation: UnthreadConversation,
): SupportTicket {
	// Map status values from Unthread to our expected format
	let status: "open" | "closed" | "resolved" = "open";
	if (conversation.status === "closed" || conversation.status === "resolved") {
		status = conversation.status;
	} else if (conversation.status === "in_progress") {
		status = "open";
	}

	return {
		assignee: conversation.assignedToUser?.name,
		createdAt: conversation.createdAt,
		customerId: conversation.customer?.id,
		id: conversation.id || conversation.friendlyId || "unknown",
		lastMessage:
			conversation.latestMessage?.content ||
			conversation.initialMessage?.content,
		openedBy:
			conversation.initialMessage?.sentByUser?.name ||
			conversation.customer?.name ||
			"Unknown",
		status,
		tags: conversation.tags?.map((tag) => tag.name) || [],
		title:
			conversation.title || conversation.summary || "Untitled Support Case",
		updatedAt:
			conversation.updatedAt ||
			conversation.lastActivityAt ||
			conversation.createdAt,
	};
}

async function getSupportTickets(customerId: string): Promise<SupportTicket[]> {
	// If no API key is configured, return empty array
	if (!UNTHREAD_API_KEY) {
		throw new Error("UNTHREAD_API_KEY is not configured");
	}

	try {
		const url = new URL(
			`${UNTHREAD_BASE_URL}/api/conversations/list?useFullContent=true`,
		);

		// Build the POST payload according to Unthread API spec
		const payload = {
			descending: true,
			includeIntake: false,
			limit: 50,
			order: ["lastActivityAt"],
			select: [
				"id",
				"status",
				"title",
				"createdAt",
				"updatedAt",
				"lastActivityAt",
				"customer.id",
				"customer.name",
				"assignedToUser.name",
				"initialMessage.content",
				"initialMessage.sentByUser.name",
				"latestMessage.content",
				"tags.name",
			],
			where: [
				{
					field: "status",
					operator: "in",
					value: ["open", "in_progress", "closed", "resolved"],
				},
				{
					field: "customerId",
					operator: "in",
					value: [customerId],
				},
			],
		};

		const response = await fetch(url.toString(), {
			body: JSON.stringify(payload),
			// Disable caching to get real-time data
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-Api-Key": UNTHREAD_API_KEY,
			},
			method: "POST",
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
		}

		const data: { data?: UnthreadConversation[] } = await response.json();

		// The Unthread API returns conversations directly in an array or under a 'data' key
		const conversations = data.data || [];

		// Return empty array if no conversations found
		if (conversations.length === 0) {
			return [];
		}

		const mappedTickets = conversations.map(mapUnthreadToSupportTicket);

		return mappedTickets;
	} catch (error) {
		console.error("Error fetching support tickets:", error);
		throw error;
	}
}

export async function getSupportTicketsByTeam(
	teamSlug: string,
	authToken?: string,
): Promise<SupportTicket[]> {
	// If no team slug provided, throw error
	if (!teamSlug) {
		throw new Error("Team slug is required to fetch support tickets");
	}

	// Fetch real data, throw error on failure
	try {
		// Ensure the team has customer service setup (this is cached)
		const team = await ensureTeamCustomerService(teamSlug, authToken);

		// Get the customer ID from the team
		const customerId = team.unthreadCustomerId;
		if (!customerId) {
			throw new Error("Team does not have a customer ID set up");
		}

		const tickets = await getSupportTickets(customerId);
		return tickets;
	} catch (error) {
		console.error("Failed to fetch support tickets:", error);
		throw error;
	}
}

export async function getSupportTicket(
	ticketId: string,
): Promise<SupportTicket | null> {
	// If no API key is configured, throw error
	if (!UNTHREAD_API_KEY) {
		throw new Error("UNTHREAD_API_KEY is not configured");
	}

	try {
		// Fetch conversation details and messages in parallel
		const [conversationResponse, messagesResponse] = await Promise.all([
			fetch(`${UNTHREAD_BASE_URL}/api/conversations/${ticketId}`, {
				// Disable caching to get real-time data
				cache: "no-store",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-Api-Key": UNTHREAD_API_KEY,
				},
				method: "GET",
			}),
			fetch(
				`${UNTHREAD_BASE_URL}/api/conversations/${ticketId}/messages/list`,
				{
					body: JSON.stringify({
						descending: false,
						order: ["timestamp"], // Get messages in chronological order
					}),
					// Disable caching to get real-time data
					cache: "no-store",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Api-Key": UNTHREAD_API_KEY,
					},
					method: "POST",
				},
			),
		]);

		if (!conversationResponse.ok) {
			if (conversationResponse.status === 404) {
				return null; // Ticket not found
			}
			const errorText = await conversationResponse.text();
			throw new Error(
				`Unthread API error: ${conversationResponse.status} - ${errorText}`,
			);
		}

		const conversation: UnthreadConversation =
			await conversationResponse.json();
		const mappedTicket = mapUnthreadToSupportTicket(conversation);

		// Fetch and map messages if the messages request was successful
		if (messagesResponse.ok) {
			const messagesData: { data?: unknown[] } = await messagesResponse.json();
			const messages = messagesData.data || [];

			mappedTicket.messages = messages
				.map((msg) =>
					mapUnthreadMessage(
						msg as Parameters<typeof mapUnthreadMessage>[0],
						mappedTicket.customerId,
					),
				)
				.filter((msg): msg is SupportMessage => msg !== null);
		} else {
			console.error(
				`Failed to fetch messages for ticket ${ticketId}:`,
				messagesResponse.status,
			);
			const errorText = await messagesResponse.text();
			console.error("Messages API error:", errorText);
			// Don't throw error, just leave messages empty
			mappedTicket.messages = [];
		}

		return mappedTicket;
	} catch (error) {
		console.error(`Error fetching support ticket ${ticketId}:`, error);
		throw error;
	}
}

export async function createSupportTicket(
	request: CreateSupportTicketRequest,
): Promise<SupportTicket> {
	// If no API key is configured, throw error
	if (!UNTHREAD_API_KEY) {
		throw new Error("UNTHREAD_API_KEY is not configured");
	}

	// Validate required environment variables
	if (!UNTHREAD_EMAIL_INBOX_ID) {
		throw new Error("UNTHREAD_EMAIL_INBOX_ID is not configured");
	}

	if (!UNTHREAD_TRIAGE_CHANNEL_ID) {
		throw new Error("UNTHREAD_TRIAGE_CHANNEL_ID is not configured");
	}

	try {
		const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations`;

		// Build the payload for creating a conversation
		const payload: CreateConversationPayload = {
			customerId: request.customerId,
			emailInboxId: UNTHREAD_EMAIL_INBOX_ID,
			markdown: request.message.trim(),
			onBehalfOf: request.onBehalfOf,
			status: "open",
			title: request.title,
			triageChannelId: UNTHREAD_TRIAGE_CHANNEL_ID,
			type: "email",
		};

		let body: string | FormData;
		const headers: Record<string, string> = {
			Accept: "application/json",
			"X-Api-Key": UNTHREAD_API_KEY,
		};

		// Handle file attachments
		if (request.attachments && request.attachments.length > 0) {
			const formData = new FormData();
			formData.append("json", JSON.stringify(payload));

			for (const file of request.attachments) {
				formData.append("attachments", file);
			}

			body = formData;
			// Don't set Content-Type for FormData, browser will set it with boundary
		} else {
			body = JSON.stringify(payload);
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(apiUrl, {
			body,
			headers,
			method: "POST",
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
		}

		const createdConversation = await response.json();
		// Map the created conversation to our SupportTicket format
		const mappedTicket = mapUnthreadToSupportTicket(createdConversation);

		return mappedTicket;
	} catch (error) {
		console.error("Error creating support ticket:", error);
		throw error;
	}
}

export async function sendMessageToTicket(
	request: SendMessageRequest,
): Promise<void> {
	// If no API key is configured, throw error
	if (!UNTHREAD_API_KEY) {
		throw new Error("UNTHREAD_API_KEY is not configured");
	}

	try {
		const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations/${request.ticketId}/messages`;

		// Build the payload for sending a message
		// Add /unthread send at the end to ensure the message is sent to the customer
		const messageWithSend = `${request.message.trim()}\n\n/unthread send`;

		const payload: SendMessagePayload = {
			body: {
				type: "markdown",
				value: messageWithSend,
			},
			onBehalfOf: request.onBehalfOf,
		};

		let body: string | FormData;
		const headers: Record<string, string> = {
			Accept: "application/json",
			"X-Api-Key": UNTHREAD_API_KEY,
		};

		// Handle file attachments
		if (request.attachments && request.attachments.length > 0) {
			const formData = new FormData();
			formData.append("json", JSON.stringify(payload));

			for (const file of request.attachments) {
				formData.append("attachments", file);
			}

			body = formData;
			// Don't set Content-Type for FormData, browser will set it with boundary
		} else {
			body = JSON.stringify(payload);
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(apiUrl, {
			body,
			headers,
			method: "POST",
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
		}

		// Message sent successfully, no need to return anything
	} catch (error) {
		console.error(
			`Error sending message to ticket ${request.ticketId}:`,
			error,
		);
		throw error;
	}
}

export const ensureTeamCustomerService = cache(
	async function ensureTeamCustomerService(
		teamIdOrSlug: string,
		authToken?: string,
	): Promise<Team> {
		const token = authToken || (await getAuthToken());

		if (!token) {
			throw new Error("No auth token available");
		}

		try {
			const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/ensure-customer-service`;

			const response = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: "POST",
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`API Server error: ${response.status} - ${errorText}`);
			}

			const result: { result: Team } = await response.json();
			return result.result;
		} catch (error) {
			console.error(
				`Error ensuring customer service for team ${teamIdOrSlug}:`,
				error,
			);
			throw error;
		}
	},
);
