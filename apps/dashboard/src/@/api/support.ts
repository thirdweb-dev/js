"use server";
import "server-only";

// UNTHREAD_API_KEY is used as Bearer token
const UNTHREAD_API_KEY = process.env.UNTHREAD_API_KEY || "";
const UNTHREAD_BASE_URL =
	process.env.UNTHREAD_BASE_URL || "https://thirdweb.unthread.io";

export interface SupportTicket {
	id: string;
	title: string;
	status: "open" | "closed" | "resolved";
	priority?: "low" | "medium" | "high" | "urgent";
	createdAt: string;
	updatedAt: string;
	openedBy: string;
	customerId?: string;
	tags?: string[];
	assignee?: string;
	lastMessage?: string;
}

export interface UnthreadConversation {
	id: string;
	title: string;
	status: string;
	priority?: string;
	createdAt: string;
	updatedAt: string;
	customerId?: string;
	tags?: string[];
	assignee?: {
		name: string;
		email: string;
	};
	lastMessage?: {
		content: string;
		author: {
			name: string;
			email: string;
		};
	};
	onBehalfOf?: {
		name: string;
		email: string;
		id: string;
	};
}

function mapUnthreadToSupportTicket(conversation: any): SupportTicket {
	// Map status values from Unthread to our expected format
	let status: "open" | "closed" | "resolved" = "open";
	if (conversation.status === "closed" || conversation.status === "resolved") {
		status = conversation.status;
	} else if (conversation.status === "in_progress") {
		status = "open";
	}

	// Map priority from number to string (Unthread uses numeric priorities)
	let priority: "low" | "medium" | "high" | "urgent" | undefined;
	if (typeof conversation.priority === "number") {
		if (conversation.priority <= 3) {
			priority = "low";
		} else if (conversation.priority <= 6) {
			priority = "medium";
		} else if (conversation.priority <= 8) {
			priority = "high";
		} else {
			priority = "urgent";
		}
	} else if (typeof conversation.priority === "string") {
		priority = conversation.priority.toLowerCase() as
			| "low"
			| "medium"
			| "high"
			| "urgent";
	}

	return {
		id: conversation.id || conversation.friendlyId || "unknown",
		title:
			conversation.title || conversation.summary || "Untitled Support Case",
		status: status,
		priority: priority,
		createdAt: conversation.createdAt,
		updatedAt: conversation.updatedAt || conversation.lastActivityAt,
		openedBy:
			conversation.initialMessage?.sentByUser?.name ||
			conversation.customer?.name ||
			"Unknown",
		customerId: conversation.customer?.id,
		tags: conversation.tags?.map((tag: any) => tag.name || tag.id) || [],
		assignee: conversation.assignedToUser?.name,
		lastMessage:
			conversation.latestMessage?.content ||
			conversation.initialMessage?.content,
	};
}

export async function getSupportTickets(
	customerId?: string,
): Promise<SupportTicket[]> {
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
			limit: 50,
			order: ["lastActivityAt"],
			descending: true,
			select: [
				"id",
				"status",
				"title",
				"createdAt",
				"updatedAt",
				"lastActivityAt",
				"priority",
				"category",
				"assignedToUserId",
				"summary",
				"customer.id",
				"customer.name",
				"assignedToUser.id",
				"assignedToUser.name",
				"initialMessage.content",
				"initialMessage.sentByUser.name",
				"initialMessage.sentByUser.email",
				"latestMessage.content",
				"tags.id",
				"tags.name",
			],
			includeIntake: false,
			where: [
				{
					field: "status",
					operator: "in",
					value: ["open", "in_progress", "closed", "resolved"],
				},
			],
		};

		// Add customerId filter if provided
		if (customerId) {
			payload.where.push({
				field: "customerId",
				operator: "in",
				value: [customerId],
			});
		}

		const response = await fetch(url.toString(), {
			method: "POST",
			headers: {
				"X-Api-Key": UNTHREAD_API_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(payload),
			// Cache for 5 minutes to avoid excessive API calls
			next: { revalidate: 300 },
		} as RequestInit & { next?: { revalidate?: number } });

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		// The Unthread API returns conversations directly in an array or under a 'data' key
		const conversations = data.data || data || [];

		// Return empty array if no conversations found
		if (!conversations || conversations.length === 0) {
			return [];
		}

		const mappedTickets = conversations.map((conv: any) =>
			mapUnthreadToSupportTicket(conv),
		);

		return mappedTickets;
	} catch (error) {
		console.error("Error fetching support tickets:", error);
		throw error;
	}
}

export async function getSupportTicketsByTeam(
	unthreadCustomerId: string,
): Promise<SupportTicket[]> {
	// If no customer ID provided, return empty array
	if (!unthreadCustomerId) {
		return [];
	}

	// Use the existing getSupportTickets function with the customer ID filter
	return getSupportTickets(unthreadCustomerId);
}

export async function getSupportTicket(
	ticketId: string,
): Promise<SupportTicket | null> {
	// If no API key is configured, throw error
	if (!UNTHREAD_API_KEY) {
		throw new Error("UNTHREAD_API_KEY is not configured");
	}

	try {
		const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations/${ticketId}`;

		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"X-Api-Key": UNTHREAD_API_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			// Cache for 2 minutes for individual tickets
			next: { revalidate: 120 },
		} as RequestInit & { next?: { revalidate?: number } });

		if (!response.ok) {
			if (response.status === 404) {
				return null; // Ticket not found
			}
			const errorText = await response.text();
			throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
		}

		const conversation: any = await response.json();

		const mappedTicket = mapUnthreadToSupportTicket(conversation);

		return mappedTicket;
	} catch (error) {
		console.error(`Error fetching support ticket ${ticketId}:`, error);
		throw error;
	}
}
