"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	ChevronDownIcon,
	ChevronRightIcon,
	CopyIcon,
	ExternalLinkIcon,
	HomeIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OpenAPISpec {
	openapi: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	servers: Array<{
		url: string;
		description?: string;
	}>;
	paths: Record<string, Record<string, ApiEndpoint>>;
	components?: {
		schemas?: Record<string, unknown>;
	};
}

interface ApiEndpoint {
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: Parameter[];
	requestBody?: {
		content: Record<string, unknown>;
		required?: boolean;
	};
	responses: Record<
		string,
		{
			description: string;
			content?: Record<string, unknown>;
		}
	>;
}

interface Parameter {
	name: string;
	in: "query" | "path" | "header" | "cookie";
	required?: boolean;
	schema: {
		type?: string;
		format?: string;
		description?: string;
		enum?: string[];
		example?: unknown;
	};
	description?: string;
}

interface SelectedEndpoint {
	path: string;
	method: string;
	endpoint: ApiEndpoint;
}

// Helper function to generate request body example from schema
function generateRequestBodyExample(
	requestBody?: ApiEndpoint["requestBody"],
): string {
	if (!requestBody?.content) return "";

	const jsonContent = requestBody.content["application/json"] as {
		schema?: {
			example?: unknown;
			examples?: Record<string, { value?: unknown }>;
			properties?: Record<
				string,
				{
					example?: unknown;
					type?: string;
					enum?: string[];
					format?: string;
					items?: { type?: string; example?: unknown };
				}
			>;
			type?: string;
		};
	};

	if (!jsonContent?.schema) return "";

	// Use explicit example if available
	const schema = jsonContent.schema;
	if (schema.example) {
		return JSON.stringify(schema.example, null, 2);
	}

	// Use examples if available
	if (schema.examples) {
		const firstExample = Object.values(schema.examples)[0];
		if (firstExample?.value) {
			return JSON.stringify(firstExample.value, null, 2);
		}
	}

	// Generate example from schema properties
	if (schema.properties) {
		const example: Record<string, unknown> = {};
		Object.entries(schema.properties).forEach(([key, prop]) => {
			if (prop.example !== undefined) {
				example[key] = prop.example;
			} else if (prop.enum && prop.enum.length > 0) {
				example[key] = prop.enum[0];
			} else if (prop.type === "string") {
				if (prop.format === "email") {
					example[key] = "user@example.com";
				} else if (prop.format === "uri" || prop.format === "url") {
					example[key] = "https://example.com";
				} else if (prop.format === "date") {
					example[key] = "2024-01-01";
				} else if (prop.format === "date-time") {
					example[key] = "2024-01-01T00:00:00Z";
				} else {
					example[key] = `example_${key}`;
				}
			} else if (prop.type === "number" || prop.type === "integer") {
				example[key] = 123;
			} else if (prop.type === "boolean") {
				example[key] = true;
			} else if (prop.type === "array") {
				if (prop.items?.example) {
					example[key] = [prop.items.example];
				} else if (prop.items?.type === "string") {
					example[key] = ["item1", "item2"];
				} else if (prop.items?.type === "number") {
					example[key] = [1, 2, 3];
				} else {
					example[key] = [];
				}
			} else {
				example[key] = {};
			}
		});
		return JSON.stringify(example, null, 2);
	}

	// Fallback for basic types
	if (schema.type === "array") {
		return "[]";
	} else if (schema.type === "string") {
		return '"example_value"';
	} else if (schema.type === "number") {
		return "123";
	} else if (schema.type === "boolean") {
		return "true";
	}

	return '{\n  "example": "data"\n}';
}

// Helper function to generate response example from schema
function generateResponseExample(response: {
	content?: Record<string, unknown>;
}): string {
	if (!response.content) return '{\n  "message": "Success"\n}';

	const jsonContent = response.content["application/json"] as {
		schema?: {
			example?: unknown;
			properties?: Record<
				string,
				{
					example?: unknown;
					type?: string;
					items?: { type?: string };
				}
			>;
		};
	};

	if (!jsonContent?.schema) return '{\n  "message": "Success"\n}';

	// Use explicit example if available
	if (jsonContent.schema.example) {
		return JSON.stringify(jsonContent.schema.example, null, 2);
	}

	// Generate example from schema properties
	if (jsonContent.schema.properties) {
		const example: Record<string, unknown> = {};
		Object.entries(jsonContent.schema.properties).forEach(([key, prop]) => {
			if (prop.example !== undefined) {
				example[key] = prop.example;
			} else if (prop.type === "string") {
				example[key] = `example_${key}`;
			} else if (prop.type === "number" || prop.type === "integer") {
				example[key] = 123;
			} else if (prop.type === "boolean") {
				example[key] = true;
			} else if (prop.type === "array") {
				example[key] =
					prop.items?.type === "string" ? ["item1", "item2"] : [{}];
			} else if (prop.type === "object") {
				example[key] = {};
			}
		});
		return JSON.stringify(example, null, 2);
	}

	return '{\n  "message": "Success"\n}';
}

// Helper function to generate query parameters string
function generateQueryParamsExample(parameters?: Parameter[]): string {
	if (!parameters?.length) return "";

	const queryParams = parameters
		.filter((p) => p.in === "query")
		.map((p) => {
			let example = p.schema?.example;

			if (example === undefined) {
				if (p.schema?.enum && p.schema.enum.length > 0) {
					example = p.schema.enum[0];
				} else if (p.schema?.type === "string") {
					if (p.schema.format === "email") {
						example = "user@example.com";
					} else if (p.schema.format === "uri" || p.schema.format === "url") {
						example = "https://example.com";
					} else if (p.schema.format === "date") {
						example = "2024-01-01";
					} else if (p.schema.format === "date-time") {
						example = "2024-01-01T00:00:00Z";
					} else {
						example = "example";
					}
				} else if (
					p.schema?.type === "number" ||
					p.schema?.type === "integer"
				) {
					example = 123;
				} else if (p.schema?.type === "boolean") {
					example = true;
				} else if (p.schema?.type === "array") {
					example = "item1,item2";
				} else {
					example = "value";
				}
			}

			return `${p.name}=${encodeURIComponent(String(example))}`;
		})
		.join("&");

	return queryParams ? `?${queryParams}` : "";
}

const getMethodColor = (method: string) => {
	switch (method.toLowerCase()) {
		case "get":
			return "text-green-800 border-green-400 bg-green-100 dark:text-green-300 dark:border-green-700 dark:bg-green-950/80";
		case "post":
			return "text-blue-800 border-blue-400 bg-blue-100 dark:text-blue-300 dark:border-blue-700 dark:bg-blue-950/80";
		case "put":
			return "text-orange-800 border-orange-400 bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:bg-orange-950/80";
		case "patch":
			return "text-purple-800 border-purple-400 bg-purple-100 dark:text-purple-300 dark:border-purple-700 dark:bg-purple-950/80";
		case "delete":
			return "text-red-800 border-red-400 bg-red-100 dark:text-red-300 dark:border-red-700 dark:bg-red-950/80";
		default:
			return "text-gray-800 border-gray-400 bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-900/80";
	}
};

// Collapsible JSON viewer component
interface JsonViewerProps {
	data: unknown;
	title: string;
	defaultOpen?: boolean;
}

function JsonViewer({ data, title, defaultOpen = false }: JsonViewerProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (!data) return null;

	return (
		<div className="border rounded-lg overflow-hidden bg-card">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full px-4 py-3 text-left bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border"
			>
				<span className="text-sm font-medium text-foreground">{title}</span>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="text-xs">
						Schema
					</Badge>
					{isOpen ? (
						<ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
					) : (
						<ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
					)}
				</div>
			</button>
			{isOpen && (
				<div className="p-4 bg-muted/20">
					<pre className="text-xs bg-background border border-border p-4 rounded-lg overflow-x-auto max-h-80 overflow-y-auto font-mono">
						<code className="text-foreground">
							{JSON.stringify(data, null, 2)}
						</code>
					</pre>
				</div>
			)}
		</div>
	);
}

// Code example component with copy functionality and syntax highlighting
function CodeExample({
	code,
	title,
	language = "javascript",
}: {
	code: string;
	title: string;
	language?: string;
}) {
	const [copied, setCopied] = useState(false);
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const { theme } = useTheme();

	useEffect(() => {
		const highlightCode = async () => {
			try {
				const html = await codeToHtml(code, {
					lang: language,
					theme: theme === "light" ? "github-light" : "github-dark",
				});
				setHighlightedCode(html);
			} catch {
				// Fallback to plain text if highlighting fails
				setHighlightedCode(`<pre><code>${code}</code></pre>`);
			}
		};
		highlightCode();
	}, [code, language, theme]);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className="relative">
			<div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
				<span className="text-sm font-medium text-foreground">{title}</span>
				<Button
					variant="outline"
					size="sm"
					onClick={copyToClipboard}
					className="h-6 px-2 text-xs"
				>
					<CopyIcon className="h-3 w-3 mr-1" />
					{copied ? "Copied!" : "Copy"}
				</Button>
			</div>
			{highlightedCode ? (
				<div
					className="text-xs bg-background p-4 overflow-x-auto max-h-80 overflow-y-auto border-l border-r border-b border-border rounded-b-lg [&_pre]:m-0 [&_pre]:bg-transparent [&_code]:bg-transparent"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML for syntax highlighting
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
				/>
			) : (
				<pre className="text-xs bg-background p-4 overflow-x-auto max-h-80 overflow-y-auto font-mono border-l border-r border-b border-border rounded-b-lg">
					<code className="text-foreground">{code}</code>
				</pre>
			)}
		</div>
	);
}

const queryClient = new QueryClient();

export default function ModernApiReference() {
	return (
		<QueryClientProvider client={queryClient}>
			<ModernApiReferenceContent />
		</QueryClientProvider>
	);
}

function ModernApiReferenceContent() {
	const [spec, setSpec] = useState<OpenAPISpec | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedEndpoint, setSelectedEndpoint] =
		useState<SelectedEndpoint | null>(null);
	const [endpointLoading, setEndpointLoading] = useState(false);
	const [showIntroduction, setShowIntroduction] = useState(true);
	const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
		{},
	);

	const toggleGroup = (tag: string) => {
		setExpandedGroups((prev) => ({
			...prev,
			[tag]: !prev[tag],
		}));
	};

	useEffect(() => {
		const fetchSpec = async () => {
			try {
				const response = await fetch("https://api.thirdweb.com/openapi.json");
				const data = await response.json();
				setSpec(data);

				// Start with all groups collapsed
				setExpandedGroups({});

				// Don't auto-select any endpoint - let user choose
			} catch (error) {
				console.error("Failed to fetch OpenAPI spec:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSpec();
	}, []);

	// Group endpoints by tags
	const groupedEndpoints = useMemo(() => {
		if (!spec) return {};

		const groups: Record<
			string,
			Array<{
				path: string;
				method: string;
				endpoint: ApiEndpoint;
			}>
		> = {};

		Object.entries(spec.paths).forEach(([path, methods]) => {
			Object.entries(methods).forEach(([method, endpoint]) => {
				const tag = endpoint.tags?.[0] || "Other";
				if (!groups[tag]) groups[tag] = [];
				groups[tag].push({ path, method, endpoint });
			});
		});

		return groups;
	}, [spec]);

	if (loading) {
		return (
			<div className="container max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_400px] gap-8">
					{/* Sidebar Skeleton */}
					<div className="w-full">
						<div className="space-y-4">
							<div className="h-8 bg-muted rounded animate-pulse" />
							<div className="h-4 bg-muted/70 rounded animate-pulse w-3/4" />
							<div className="h-10 bg-muted/50 rounded animate-pulse" />
							{Array.from({ length: 5 }, (_, i) => {
								const groupId = `skeleton-group-${Date.now()}-${i}`;
								return (
									<div key={groupId} className="space-y-2">
										<div className="h-6 bg-muted/60 rounded animate-pulse w-1/2" />
										<div className="ml-4 space-y-1">
											{Array.from({ length: 3 }, (_, j) => {
												const itemId = `skeleton-item-${Date.now()}-${i}-${j}`;
												return (
													<div
														key={itemId}
														className="h-8 bg-muted/40 rounded animate-pulse"
													/>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Main Content Skeleton */}
					<div className="flex-1">
						<div className="space-y-4">
							<div className="h-8 bg-muted rounded animate-pulse w-1/3" />
							<div className="h-4 bg-muted/70 rounded animate-pulse w-2/3" />
							<div className="h-32 bg-muted/50 rounded animate-pulse" />
						</div>
					</div>

					{/* Right Column Skeleton */}
					<div className="hidden xl:block">
						<div className="space-y-4">
							<div className="h-6 bg-muted rounded animate-pulse w-1/2" />
							<div className="h-24 bg-muted/50 rounded animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!spec) {
		return (
			<div className="container max-w-7xl mx-auto px-4 py-8">
				<div className="text-center py-16">
					<h2 className="text-xl font-semibold mb-2">
						Failed to load API reference
					</h2>
					<p className="text-muted-foreground">
						Could not fetch the OpenAPI specification
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="container text-muted-foreground relative flex flex-col gap-4 xl:grid xl:grid-cols-[220px_1fr]"
			style={{ minHeight: "calc(100vh - var(--sticky-top-height))" }}
		>
			{/* Sidebar */}
			<aside className="sticky top-sticky-top-height h-sidebar-height flex-col overflow-y-auto no-scrollbar hidden xl:flex">
				<div className="py-4">
					{/* Introduction Tab */}
					<div className="mb-4">
						<button
							type="button"
							onClick={() => {
								setSelectedEndpoint(null);
								setShowIntroduction(true);
							}}
							className={`flex items-center w-full px-3 py-1.5 text-sm transition-colors duration-300 rounded-lg border ${
								showIntroduction && !selectedEndpoint
									? "font-medium text-foreground bg-violet-800/25 border-violet-800"
									: "text-muted-foreground hover:text-foreground hover:bg-violet-800/15 border-transparent hover:border-violet-800/50"
							}`}
						>
							<HomeIcon className="h-4 w-4 mr-2" />
							Introduction
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex flex-col text-muted-foreground text-sm">
						{Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
							<div key={tag} className="mb-3">
								{/* Collapsible Group Title */}
								<button
									type="button"
									onClick={() => toggleGroup(tag)}
									className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-violet-800/20 rounded-lg hover:border-violet-800/50 border border-transparent transition-colors duration-300 mb-1"
								>
									{expandedGroups[tag] ? (
										<ChevronDownIcon className="h-4 w-4 mr-2 text-muted-foreground" />
									) : (
										<ChevronRightIcon className="h-4 w-4 mr-2 text-muted-foreground" />
									)}
									<span className="text-foreground text-sm font-medium">
										{tag}
									</span>
									<Badge
										variant="secondary"
										className="ml-auto text-xs px-1.5 py-0.5"
									>
										{endpoints.length}
									</Badge>
								</button>

								{/* Conditionally Visible Endpoints */}
								{expandedGroups[tag] && (
									<div className="flex flex-col space-y-0.5">
										{endpoints.map(({ path, method, endpoint }) => (
											<button
												key={`${method}-${path}`}
												type="button"
												onClick={() => {
													setEndpointLoading(true);
													setShowIntroduction(false);
													// Small delay to show loading state
													setTimeout(() => {
														setSelectedEndpoint({
															path,
															method,
															endpoint,
														});
														setEndpointLoading(false);
													}, 100);
												}}
												className={`flex items-start w-full px-3 py-1.5 text-sm rounded-lg transition-colors duration-300 border ${
													selectedEndpoint?.path === path &&
													selectedEndpoint?.method === method
														? "font-medium text-foreground bg-violet-800/25 border-violet-800"
														: "text-muted-foreground hover:text-foreground hover:bg-violet-800/15 border-transparent hover:border-violet-800/50"
												}`}
											>
												<Badge
													variant="outline"
													className={`mr-2 text-xs font-mono uppercase flex-shrink-0 ${getMethodColor(
														method,
													)}`}
												>
													{method}
												</Badge>
												<div className="flex-1 min-w-0">
													<div className="text-xs font-mono text-muted-foreground truncate mb-0.5">
														{path}
													</div>
													{endpoint.summary && (
														<div className="text-xs text-muted-foreground/80 line-clamp-2">
															{endpoint.summary}
														</div>
													)}
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						))}
					</nav>
				</div>
			</aside>

			{/* Main Content */}
			<main className="relative flex w-full flex-col overflow-hidden">
				<div className="grow xl:mt-6">
					{showIntroduction && !selectedEndpoint ? (
						<div className="max-w-4xl mx-auto py-4">
							{/* Scalar-style Introduction */}
							<div className="space-y-8">
								{/* Header */}
								<div className="text-center space-y-4">
									<p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
										thirdweb API provides a unified interface for Web3
										development. Build scalable blockchain applications with
										easy-to-use endpoints for wallet management, transaction
										processing, signatures, and smart contract interactions.
									</p>
								</div>

								{/* Key Features */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
									<div className="text-center space-y-3 p-6 rounded-lg border border-border bg-card/30">
										<div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
											<svg
												className="w-6 h-6 text-blue-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-label="Wallet security icon"
											>
												<title>Security</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
												/>
											</svg>
										</div>
										<h3 className="text-lg font-semibold">Secure & Reliable</h3>
										<p className="text-sm text-muted-foreground">
											Built with enterprise-grade security and reliability in
											mind. Your data and transactions are protected.
										</p>
									</div>

									<div className="text-center space-y-3 p-6 rounded-lg border border-border bg-card/30">
										<div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
											<svg
												className="w-6 h-6 text-green-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-label="Fast performance icon"
											>
												<title>Performance</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
										<h3 className="text-lg font-semibold">Lightning Fast</h3>
										<p className="text-sm text-muted-foreground">
											Optimized for speed with global CDN and caching.
											Experience blazing fast response times.
										</p>
									</div>

									<div className="text-center space-y-3 p-6 rounded-lg border border-border bg-card/30">
										<div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
											<svg
												className="w-6 h-6 text-purple-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-label="Easy integration icon"
											>
												<title>Integration</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</div>
										<h3 className="text-lg font-semibold">Easy Integration</h3>
										<p className="text-sm text-muted-foreground">
											Simple RESTful API with comprehensive documentation. Get
											up and running in minutes.
										</p>
									</div>
								</div>

								{/* Getting Started */}
								<div className="mt-16 p-8 rounded-lg border border-border bg-muted/30">
									<h2 className="text-2xl font-bold mb-4">Quick Start</h2>
									<p className="text-muted-foreground mb-6">
										Get started with the thirdweb API in just a few steps:
									</p>
									<ol className="space-y-4 text-sm">
										<li className="flex items-start gap-3">
											<div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
												1
											</div>
											<div>
												<strong>Get your API key</strong> from the thirdweb
												dashboard
											</div>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
												2
											</div>
											<div>
												<strong>Choose an endpoint</strong> from the sidebar
												navigation
											</div>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
												3
											</div>
											<div>
												<strong>Make your first API call</strong> using the
												provided examples
											</div>
										</li>
									</ol>
								</div>

								{/* API Information */}
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
									<div className="space-y-4">
										<h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
											Ready to get started?
										</h2>
										<p className="text-blue-700 dark:text-blue-200">
											Explore the API endpoints in the sidebar to discover all
											available functionality. Each endpoint includes detailed
											documentation, request/response examples, and parameter
											specifications.
										</p>
										<div className="flex flex-wrap gap-3">
											<Button
												variant="default"
												onClick={() => {
													window.open(
														"https://thirdweb.com/create-api-key",
														"_blank",
													);
												}}
											>
												Get API Key
											</Button>
											<Button
												variant="outline"
												onClick={() => {
													window.open(
														"https://api.thirdweb.com/reference",
														"_blank",
													);
												}}
											>
												Full API Reference
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : endpointLoading ? (
						<div className="space-y-6 animate-pulse">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="h-5 w-16 bg-muted rounded" />
									<div className="h-5 w-48 bg-muted rounded" />
								</div>
								<div className="h-6 w-64 bg-muted rounded" />
								<div className="h-3 w-96 bg-muted rounded" />
							</div>
							<div className="space-y-3">
								<div className="h-5 w-32 bg-muted rounded" />
								<div className="h-24 bg-muted rounded" />
							</div>
						</div>
					) : selectedEndpoint && !showIntroduction ? (
						<div className="space-y-8">
							{/* Endpoint Header */}
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Badge
										variant="outline"
										className={`text-xs font-mono uppercase font-semibold px-2 py-1 ${getMethodColor(
											selectedEndpoint.method,
										)}`}
									>
										{selectedEndpoint.method}
									</Badge>
									<code className="text-lg font-mono text-foreground bg-muted/50 px-3 py-1.5 rounded-md border">
										{selectedEndpoint.path}
									</code>
								</div>

								{selectedEndpoint.endpoint.summary && (
									<h1 className="text-xl font-bold tracking-tight leading-tight">
										{selectedEndpoint.endpoint.summary}
									</h1>
								)}

								{selectedEndpoint.endpoint.description && (
									<div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
										<MarkdownRenderer
											markdownText={selectedEndpoint.endpoint.description}
										/>
									</div>
								)}

								{/* Action Button */}
								<div className="flex items-center gap-3 pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											// Build the correct URL format based on the method and path
											const tagFromEndpoint =
												selectedEndpoint.endpoint.tags?.[0]?.toLowerCase() ||
												"default";
											const methodLower = selectedEndpoint.method.toLowerCase();
											const pathForUrl = selectedEndpoint.path.replace(
												/\//g,
												"",
											);
											window.open(
												`https://api.thirdweb.com/reference#tag/${tagFromEndpoint}/${methodLower}${pathForUrl}`,
												"_blank",
											);
										}}
									>
										<ExternalLinkIcon className="h-4 w-4 mr-2" />
										View in API Reference
									</Button>
								</div>
							</div>

							{/* Content Tabs */}
							<div className="bg-background border border-border rounded-lg overflow-hidden">
								<Tabs defaultValue="request" className="w-full">
									<div className="border-b border-border bg-muted/20">
										<TabsList className="grid w-full grid-cols-2 max-w-sm bg-transparent border-none p-1 h-auto">
											<TabsTrigger
												value="request"
												className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border border-border rounded-md py-2 text-sm"
											>
												<span className="h-2 w-2 rounded-full bg-blue-500"></span>
												Request
											</TabsTrigger>
											<TabsTrigger
												value="response"
												className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:border border-border rounded-md py-2 text-sm"
											>
												<span className="h-2 w-2 rounded-full bg-green-500"></span>
												Response
											</TabsTrigger>
										</TabsList>
									</div>

									<TabsContent value="request" className="p-6 space-y-6 m-0">
										{/* Parameters Section */}
										{selectedEndpoint.endpoint.parameters &&
											selectedEndpoint.endpoint.parameters.length > 0 && (
												<div className="space-y-4">
													<h3 className="text-lg font-semibold">Parameters</h3>
													<div className="space-y-3">
														{selectedEndpoint.endpoint.parameters.map(
															(param, index) => (
																<div
																	key={`${param.name}-${index}`}
																	className="border border-border rounded-lg p-4 bg-card/30"
																>
																	<div className="flex items-center gap-2 mb-3">
																		<code className="text-sm font-mono bg-muted px-2 py-1 rounded-md font-semibold">
																			{param.name}
																		</code>
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{param.in}
																		</Badge>
																		{param.required && (
																			<Badge
																				variant="destructive"
																				className="text-xs"
																			>
																				required
																			</Badge>
																		)}
																		{param.schema?.type && (
																			<Badge
																				variant="outline"
																				className="text-xs"
																			>
																				{param.schema.type}
																			</Badge>
																		)}
																	</div>
																	{param.description && (
																		<div className="prose prose-sm max-w-none mb-3 text-muted-foreground">
																			<MarkdownRenderer
																				markdownText={param.description}
																			/>
																		</div>
																	)}
																	{param.schema && (
																		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
																			{param.schema.format && (
																				<div>
																					<span className="font-medium text-muted-foreground">
																						Format:
																					</span>{" "}
																					<code className="bg-muted px-2 py-1 rounded">
																						{param.schema.format}
																					</code>
																				</div>
																			)}
																			{param.schema.enum && (
																				<div>
																					<span className="font-medium text-muted-foreground">
																						Values:
																					</span>{" "}
																					<code className="bg-muted px-2 py-1 rounded">
																						{param.schema.enum.join(", ")}
																					</code>
																				</div>
																			)}
																			{param.schema.example !== undefined && (
																				<div className="md:col-span-2">
																					<span className="font-medium text-muted-foreground">
																						Example:
																					</span>{" "}
																					<code className="bg-muted px-2 py-1 rounded">
																						{JSON.stringify(
																							param.schema.example,
																						)}
																					</code>
																				</div>
																			)}
																		</div>
																	)}
																</div>
															),
														)}
													</div>
												</div>
											)}

										{/* Request Body Schema */}
										{selectedEndpoint.endpoint.requestBody && (
											<div className="space-y-4">
												<h3 className="text-lg font-semibold">Request Body</h3>
												<JsonViewer
													data={selectedEndpoint.endpoint.requestBody}
													title="Request Body Schema"
													defaultOpen={false}
												/>
											</div>
										)}

										{/* Request Examples */}
										<div className="space-y-6">
											<h3 className="text-xl font-semibold">Examples</h3>
											<div className="space-y-6">
												<div className="bg-card border border-border rounded-lg overflow-hidden">
													<CodeExample
														code={`curl -X ${selectedEndpoint.method.toUpperCase()} "${spec?.servers?.[0]?.url || "https://api.thirdweb.com"}${selectedEndpoint.path}${generateQueryParamsExample(selectedEndpoint.endpoint.parameters)}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <api_key>"${selectedEndpoint.endpoint.requestBody ? ` \\\n  -d '${generateRequestBodyExample(selectedEndpoint.endpoint.requestBody)}'` : ""}`}
														title="cURL"
														language="bash"
													/>
												</div>
												<div className="bg-card border border-border rounded-lg overflow-hidden">
													<CodeExample
														code={`const response = await fetch('${spec?.servers?.[0]?.url || "https://api.thirdweb.com"}${selectedEndpoint.path}${generateQueryParamsExample(selectedEndpoint.endpoint.parameters)}', {
  method: '${selectedEndpoint.method.toUpperCase()}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <api_key>'
  }${selectedEndpoint.endpoint.requestBody ? `,\n  body: JSON.stringify(${generateRequestBodyExample(selectedEndpoint.endpoint.requestBody)})` : ""}
});

const data = await response.json();
console.log(data);`}
														title="JavaScript (Fetch)"
														language="javascript"
													/>
												</div>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="response" className="p-6 space-y-6 m-0">
										{/* Response Examples */}
										{selectedEndpoint.endpoint.responses && (
											<div className="space-y-4">
												<h3 className="text-lg font-semibold">
													Response Examples
												</h3>
												<div className="space-y-4">
													{Object.entries(
														selectedEndpoint.endpoint.responses,
													).map(([status, response]) => (
														<div key={status} className="space-y-3">
															<div className="flex items-center gap-2">
																<Badge
																	variant={
																		status.startsWith("2")
																			? "default"
																			: status.startsWith("4")
																				? "destructive"
																				: "secondary"
																	}
																	className="font-mono text-xs px-2 py-1"
																>
																	{status}
																</Badge>
																<span className="text-sm font-medium text-muted-foreground">
																	{response.description}
																</span>
															</div>
															{status.startsWith("2") && (
																<div className="bg-card border border-border rounded-lg overflow-hidden">
																	<CodeExample
																		code={generateResponseExample(response)}
																		title={`${status} Response Example`}
																		language="json"
																	/>
																</div>
															)}
															{response.content && (
																<JsonViewer
																	data={response.content}
																	title={`${status} Response Schema`}
																	defaultOpen={false}
																/>
															)}
														</div>
													))}
												</div>
											</div>
										)}
									</TabsContent>
								</Tabs>
							</div>
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								Select an endpoint from the sidebar to view its documentation.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
