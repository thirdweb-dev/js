import type {
  EmbeddingModelV2,
  ImageModelV2,
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2StreamPart,
  ProviderV2,
} from "@ai-sdk/provider";
import {
  createTools,
  type MonitorTransactionInput,
  type SignSwapInput,
  type SignTransactionInput,
} from "./tools.js";
import {
  DEFAULT_BASE_URL,
  type ThirdwebConfig,
  type ThirdwebSettings,
} from "./types.js";

class ThirdwebLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = "v2" as const;
  readonly provider = "thirdweb";
  readonly modelId: string;
  readonly supportedUrls = {};

  private config: ThirdwebConfig;
  private settings: ThirdwebSettings;
  private sessionStore: SessionStore;
  private chatId: string;

  constructor(
    modelId: string,
    settings: ThirdwebSettings,
    config: ThirdwebConfig,
    sessionStore: SessionStore,
    chatId?: string,
  ) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.sessionStore = sessionStore;
    this.chatId = chatId || this.generateRandomChatId();
    if (this.chatId && settings.context?.session_id) {
      this.sessionStore.setSessionId(this.chatId, settings.context.session_id);
    }
  }

  private getHeaders() {
    if (!this.config.secretKey && !this.config.clientId) {
      throw new Error("Either secretKey, or clientId must be provided");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.walletAuthToken) {
      headers.Authorization = `Bearer ${this.config.walletAuthToken}`;
    }

    if (this.config.secretKey) {
      headers["x-secret-key"] = this.config.secretKey;
    }

    if (this.config.clientId) {
      headers["x-client-id"] = this.config.clientId;
    }

    return headers;
  }

  private getSessionId() {
    return this.sessionStore.getSessionId(this.chatId);
  }

  private setSessionId(sessionId: string) {
    this.sessionStore.setSessionId(this.chatId, sessionId);
  }

  private generateRandomChatId(): string {
    // Use crypto.randomUUID if available (modern browsers and Node.js 14.17+)
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    // Fallback for older environments - generate a random string
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    // Generate timestamp prefix for uniqueness
    const timestamp = Date.now().toString(36);

    // Add random suffix
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `chat_${timestamp}_${result}`;
  }

  private convertMessages(prompt: LanguageModelV2CallOptions["prompt"]) {
    return prompt.map((message) => {
      switch (message.role) {
        case "system":
          return {
            role: message.role,
            content: message.content,
          };
        case "user":
        case "assistant": {
          // Convert content parts to a single string for thirdweb API
          const content = message.content
            .map((part) => {
              switch (part.type) {
                case "text":
                  return part.text;
                case "file":
                  // TODO (ai): handle file uploads
                  return `[File: ${part.filename || "unknown"}]`;
                default:
                  return "";
              }
            })
            .join("");
          return {
            role: message.role,
            content,
          };
        }
        case "tool": {
          // TODO (ai): handle tool results converting it to custom message type
          // Convert tool results to string
          const toolContent = message.content
            .map((part) => {
              if (part.type === "tool-result") {
                return JSON.stringify(part);
              }
              return "";
            })
            .join("");
          return {
            role: message.role,
            content: toolContent,
          };
        }
        default:
          throw new Error(
            `Unsupported message role: ${JSON.stringify(message)}`,
          );
      }
    });
  }

  async doGenerate(options: LanguageModelV2CallOptions) {
    const { prompt, abortSignal } = options;

    const allMessages = this.convertMessages(prompt);
    const lastUserMessage = [...allMessages]
      .reverse()
      .find((m) => m.role === "user" || m.role === "tool");
    const messages =
      this.getSessionId() && lastUserMessage ? [lastUserMessage] : allMessages;

    const body = {
      messages,
      stream: false,
      context: { ...this.settings.context, session_id: this.getSessionId() },
    };

    const response = await fetch(
      `${this.config.baseURL || DEFAULT_BASE_URL}/ai/chat`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: abortSignal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Thirdweb API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      message?: string;
      request_id?: string;
      session_id?: string;
      actions?: unknown[];
    };

    // TODO (ai): handle actions

    return {
      content: [
        {
          type: "text" as const,
          text: data.message || "",
        },
      ],
      finishReason: "stop" as const,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      },
      response: {
        id: data.request_id || "",
        timestamp: new Date(),
        modelId: this.modelId,
      },
      warnings: [],
    };
  }

  async doStream(options: LanguageModelV2CallOptions) {
    const { prompt, abortSignal } = options;

    const allMessages = this.convertMessages(prompt);
    const lastUserMessage = [...allMessages]
      .reverse()
      .find((m) => m.role === "user" || m.role === "tool");
    const messages =
      this.getSessionId() && lastUserMessage ? [lastUserMessage] : allMessages;

    const body = {
      messages,
      stream: true,
      context: { ...this.settings.context, session_id: this.getSessionId() },
    };

    const response = await fetch(
      `${this.config.baseURL || DEFAULT_BASE_URL}/ai/chat`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: abortSignal,
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Thirdweb API error: ${response.status} ${response.statusText} - ${error}`,
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const self = this;

    return {
      stream: new ReadableStream<LanguageModelV2StreamPart>({
        async start(controller) {
          try {
            let buffer = "";
            let currentEvent = "";
            let textStartEmitted = false;
            let textStartId = "";
            let reasoningStartEmitted = false;
            let reasoningId = "";

            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                // Emit text-end if we had started text and the stream is ending
                if (textStartEmitted) {
                  controller.enqueue({
                    type: "text-end",
                    id: textStartId,
                  });
                }

                // Emit reasoning-end if we had started reasoning and the stream is ending
                if (reasoningStartEmitted) {
                  controller.enqueue({
                    type: "reasoning-end",
                    id: reasoningId,
                  });
                }

                controller.enqueue({
                  type: "finish",
                  finishReason: "stop",
                  usage: {
                    inputTokens: 0,
                    outputTokens: 0,
                    totalTokens: 0,
                  },
                });
                controller.close();
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");

              // Keep the last incomplete line in the buffer
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.trim() === "") continue;

                // Parse SSE format: "event: eventType" and "data: eventData"
                if (line.startsWith("event: ")) {
                  currentEvent = line.slice(7).trim();
                } else if (line.startsWith("data: ")) {
                  const data = line.slice(6).trim();

                  if (data === "[DONE]") {
                    // Emit text-end if we had started text and now we're done
                    if (textStartEmitted) {
                      controller.enqueue({
                        type: "text-end",
                        id: textStartId,
                      });
                      textStartEmitted = false;
                      textStartId = "";
                    }

                    // Emit reasoning-end if we had started reasoning and now we're done
                    if (reasoningStartEmitted) {
                      controller.enqueue({
                        type: "reasoning-end",
                        id: reasoningId,
                      });
                      reasoningStartEmitted = false;
                      reasoningId = "";
                    }

                    controller.enqueue({
                      type: "finish",
                      finishReason: "stop",
                      usage: {
                        inputTokens: 0,
                        outputTokens: 0,
                        totalTokens: 0,
                      },
                    });
                    continue;
                  }

                  try {
                    // Handle different event types based on thirdweb API spec
                    if (currentEvent === "delta") {
                      // Emit reasoning-end if we had started reasoning and now encounter a non-presence event
                      if (reasoningStartEmitted) {
                        controller.enqueue({
                          type: "reasoning-end",
                          id: reasoningId,
                        });
                        reasoningStartEmitted = false;
                        reasoningId = "";
                      }

                      const parsed = JSON.parse(data);
                      if (parsed.v) {
                        // Emit text-start on first delta encounter
                        if (!textStartEmitted) {
                          textStartId = `text-${Date.now()}`;
                          controller.enqueue({
                            type: "text-start",
                            id: textStartId,
                          });
                          textStartEmitted = true;
                        }

                        controller.enqueue({
                          type: "text-delta",
                          id: textStartId,
                          delta: parsed.v,
                        });
                      }
                    } else {
                      // Emit text-end if we had started text and now encounter a non-delta event
                      if (textStartEmitted && currentEvent !== "delta") {
                        controller.enqueue({
                          type: "text-end",
                          id: textStartId,
                        });
                        textStartEmitted = false;
                        textStartId = "";
                      }

                      if (currentEvent === "init") {
                        const parsed = JSON.parse(data);
                        if (parsed.session_id) {
                          self.setSessionId(parsed.session_id);
                          controller.enqueue({
                            type: "response-metadata",
                            id: parsed.session_id || "",
                          });
                        }
                      }

                      if (currentEvent === "presence") {
                        const parsed = JSON.parse(data);
                        if (parsed.data && typeof parsed.data === "string") {
                          // Emit reasoning-start only on the first presence event
                          if (!reasoningStartEmitted) {
                            reasoningId = `reasoning-${Date.now()}`;
                            controller.enqueue({
                              type: "reasoning-start",
                              id: reasoningId,
                            });
                            reasoningStartEmitted = true;
                          }
                          // Send the reasoning content
                          controller.enqueue({
                            type: "reasoning-delta",
                            id: reasoningId,
                            delta: `${parsed.data}. `, // TODO (ai): this should be in the backends
                          });
                        }
                      } else if (currentEvent === "action") {
                        const parsed = JSON.parse(data);
                        if (parsed.type && parsed.data) {
                          // Map thirdweb action events to AI SDK tool calls
                          const toolCallId =
                            parsed.request_id || `action-${Date.now()}`;

                          // Map action types to tool names and prepare input data
                          let toolName: string;
                          let input: unknown;

                          switch (parsed.type) {
                            case "sign_transaction":
                              toolName = "sign_transaction";
                              input = {
                                chain_id: parsed.data.chain_id,
                                to: parsed.data.to,
                                value: parsed.data.value,
                                data: parsed.data.data,
                                function: parsed.data.function,
                              } satisfies SignTransactionInput;
                              break;

                            case "sign_swap":
                              toolName = "sign_swap";
                              input = {
                                action: parsed.data.action,
                                intent: parsed.data.intent,
                                transaction: parsed.data.transaction,
                                from_token: parsed.data.from_token,
                                to_token: parsed.data.to_token,
                              } satisfies SignSwapInput;
                              break;

                            case "monitor_transaction":
                              toolName = "monitor_transaction";
                              input = {
                                transaction_id: parsed.data.transaction_id,
                              } satisfies MonitorTransactionInput;
                              break;

                            default:
                              // For unknown action types, use generic action handler
                              toolName = `thirdweb_${parsed.type}`;
                              input = parsed.data;
                              break;
                          }

                          // Emit as tool call
                          controller.enqueue({
                            type: "tool-call",
                            toolCallId,
                            toolName,
                            input: JSON.stringify(input),
                            providerExecuted: false,
                          });
                        }
                      } else if (currentEvent === "done") {
                        // Emit text-end if we had started text and now we're done
                        if (textStartEmitted) {
                          controller.enqueue({
                            type: "text-end",
                            id: textStartId,
                          });
                          textStartEmitted = false;
                          textStartId = "";
                        }

                        // Emit reasoning-end if we had started reasoning and now we're done
                        if (reasoningStartEmitted) {
                          controller.enqueue({
                            type: "reasoning-end",
                            id: reasoningId,
                          });
                          reasoningStartEmitted = false;
                          reasoningId = "";
                        }

                        controller.enqueue({
                          type: "finish",
                          finishReason: "stop",
                          usage: {
                            inputTokens: 0,
                            outputTokens: 0,
                            totalTokens: 0,
                          },
                        });
                      } else if (currentEvent === "error") {
                        const parsed = JSON.parse(data);
                        controller.error(
                          new Error(parsed.data || "Unknown error"),
                        );
                      }
                    }
                    // TODO (ai): Handle other event types (init, context, image) as needed
                    // For now, we'll ignore init, ping, etc. and only handle delta, presence, action, and done
                  } catch (e) {
                    // Skip invalid JSON or non-JSON data
                    console.warn("Failed to parse SSE data:", data, e);
                  }
                }
              }
            }
          } catch (error) {
            controller.error(error);
          } finally {
            reader.releaseLock();
          }
        },
      }),
    };
  }
}

export class ThirdwebProvider implements ProviderV2 {
  private config: ThirdwebConfig;
  private session: SessionStore;

  constructor(config: ThirdwebConfig = {}) {
    this.config = config;
    this.session = config.sessionStore || memorySessionStore;
  }

  chat(id?: string, settings: ThirdwebSettings = {}) {
    return new ThirdwebLanguageModel(
      "t0-latest",
      settings,
      this.config,
      this.session,
      id,
    );
  }

  tools() {
    return createTools(this.config);
  }

  languageModel(modelId: string, settings: ThirdwebSettings = {}) {
    return new ThirdwebLanguageModel(
      modelId,
      settings,
      this.config,
      this.session,
    );
  }

  textEmbeddingModel(_modelId: string): EmbeddingModelV2<string> {
    throw new Error(
      "Text embedding models are not supported by thirdweb AI yet",
    );
  }

  imageModel(_modelId: string): ImageModelV2 {
    throw new Error("Image models are not supported by thirdweb AI yet");
  }
}

export interface SessionStore {
  getSessionId(chatId: string): string | null;
  setSessionId(chatId: string, sessionId: string): void;
  clearSessionId(chatId: string): void;
}

class InMemorySessionStore implements SessionStore {
  private sessionId: Map<string, string> = new Map();

  getSessionId(chatId: string): string | null {
    return this.sessionId.get(chatId) || null;
  }
  setSessionId(chatId: string, sessionId: string): void {
    this.sessionId.set(chatId, sessionId);
  }
  clearSessionId(chatId: string): void {
    this.sessionId.delete(chatId);
  }
}

// singleton session store used as default if no session store is provided
const memorySessionStore = new InMemorySessionStore();

// Factory function for easier usage
export function createThirdwebAI(config: ThirdwebConfig = {}) {
  return new ThirdwebProvider(config);
}
