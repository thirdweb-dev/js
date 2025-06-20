"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleStopIcon,
  CopyIcon,
  PaperclipIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
  useActiveWallet,
  WalletIcon,
  WalletName,
  WalletProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import type { Wallet } from "thirdweb/wallets";
import { ChainIconClient } from "@/components/blocks/ChainIcon";
import { Img } from "@/components/blocks/Img";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { ImageUploadButton } from "@/components/ui/image-upload-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useAllChainsData } from "@/hooks/chains";
import { cn } from "@/lib/utils";
import type { NebulaContext } from "../api/chat";
import type { NebulaUserMessage } from "../api/types";

export type WalletMeta = {
  walletId: Wallet["id"];
  address: string;
};

const maxAllowedImagesPerMessage = 4;

function showSigninToUploadImagesToast() {
  toast.error("Sign in to upload images to Nebula", {
    position: "top-right",
  });
}

export function ChatBar(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
  prefillMessage: string | undefined;
  className?: string;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  showContextSelector: boolean;
  client: ThirdwebClient;
  connectedWallets: WalletMeta[];
  setActiveWallet: (wallet: WalletMeta) => void;
  isConnectingWallet: boolean;
  allowImageUpload: boolean;
  onLoginClick: undefined | (() => void);
  placeholder: string;
}) {
  const [message, setMessage] = useState(props.prefillMessage || "");
  const selectedChainIds = props.context?.chainIds?.map((x) => Number(x)) || [];
  const firstChainId = selectedChainIds[0];
  const [images, setImages] = useState<
    Array<{ file: File; b64: string | undefined }>
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleSubmit(message: string) {
    const userMessage: NebulaUserMessage = {
      content: [{ text: message, type: "text" }],
      role: "user",
    };
    if (images.length > 0) {
      for (const image of images) {
        if (image.b64) {
          userMessage.content.push({
            b64: image.b64,
            image_url: null,
            type: "image",
          });
        }
      }
    }
    props.sendMessage(userMessage);
    setMessage("");
    setImages([]);
  }

  const uploadImageMutation = useMutation({
    mutationFn: async (image: File) => {
      return toBase64(image);
    },
  });

  const supportedFileTypes = ["image/jpeg", "image/png", "image/webp"];

  async function handleImageUpload(files: File[]) {
    const totalFiles = files.length + images.length;

    if (totalFiles > maxAllowedImagesPerMessage) {
      toast.error(
        `You can only upload up to ${maxAllowedImagesPerMessage} images at a time`,
        {
          position: "top-right",
        },
      );
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (!supportedFileTypes.includes(file.type)) {
        toast.error("Unsupported file type", {
          description: `File: ${file.name}`,
          position: "top-right",
        });
        continue;
      }

      if (file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
      } else {
        toast.error("Image is larger than 5MB", {
          description: `File: ${file.name}`,
          position: "top-right",
        });
      }
    }

    try {
      const urls = await Promise.all(
        validFiles.map(async (image) => {
          const b64 = await uploadImageMutation.mutateAsync(image);
          return { b64: b64, file: image };
        }),
      );

      setImages((prev) => [...prev, ...urls]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload image", {
        position: "top-right",
      });
    }
  }

  return (
    <DynamicHeight transition="height 200ms ease">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: TODO */}
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card transition-colors",
          isDragOver && "border-nebula-pink-foreground bg-nebula-pink/5",
          props.className,
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
          if (!props.allowImageUpload) {
            return;
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!props.allowImageUpload) {
            return;
          }
          // Only set drag over to false if we're leaving the container entirely
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
          if (!props.allowImageUpload) {
            return;
          }
        }}
        onDrop={(e) => {
          setIsDragOver(false);
          e.preventDefault();
          if (!props.allowImageUpload) {
            showSigninToUploadImagesToast();
            return;
          }
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) handleImageUpload(files);
        }}
      >
        {images.length > 0 && (
          <ImagePreview
            images={images}
            isUploading={uploadImageMutation.isPending}
            onRemove={(index) => {
              setImages((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        )}

        <div className="p-2">
          <div className="max-h-[200px] overflow-y-auto">
            <AutoResizeTextarea
              className="min-h-[60px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={props.isChatStreaming}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                // ignore if shift key is pressed to allow entering new lines
                if (e.shiftKey) {
                  return;
                }
                if (e.key === "Enter" && !props.isChatStreaming) {
                  e.preventDefault();
                  handleSubmit(message);
                }
              }}
              onPaste={(e) => {
                const files = Array.from(e.clipboardData.files);
                if (files.length > 0) {
                  e.preventDefault();
                  if (!props.allowImageUpload) {
                    showSigninToUploadImagesToast();
                    return;
                  }
                  handleImageUpload(files);
                }
              }}
              placeholder={props.placeholder}
              value={message}
            />
          </div>

          <div className="flex items-end justify-between gap-3 px-2 pb-2">
            {/* left */}
            <div className="grow">
              {props.showContextSelector && (
                <div className="flex flex-wrap gap-2 [&>*]:w-auto">
                  {props.connectedWallets.length > 1 &&
                    !props.isConnectingWallet && (
                      <WalletSelector
                        client={props.client}
                        onClick={(walletMeta) => {
                          props.setActiveWallet(walletMeta);
                          props.setContext({
                            chainIds: props.context?.chainIds || [],
                            networks: props.context?.networks || null,
                            walletAddress: walletMeta.address,
                          });
                        }}
                        selectedAddress={
                          props.context?.walletAddress || undefined
                        }
                        wallets={props.connectedWallets}
                      />
                    )}

                  {props.isConnectingWallet && (
                    <Badge
                      className="h-auto w-auto shrink-0 gap-1.5 px-2 py-1.5"
                      variant="outline"
                    >
                      <Spinner className="size-3" />
                      <span>Connecting Wallet</span>
                    </Badge>
                  )}

                  <MultiNetworkSelector
                    align="start"
                    client={props.client}
                    customTrigger={
                      <Button
                        className="h-auto w-full p-0 hover:bg-transparent "
                        variant="ghost"
                      >
                        {selectedChainIds.length > 0 && firstChainId && (
                          <ChainBadge
                            chainId={firstChainId}
                            client={props.client}
                            plusMore={selectedChainIds.length - 1}
                          />
                        )}

                        {selectedChainIds.length === 0 && (
                          <Badge
                            className="flex h-auto gap-1 px-2 py-1.5 hover:bg-accent"
                            variant="outline"
                          >
                            Select Chains
                            <ChevronDownIcon className="size-3 text-muted-foreground" />
                          </Badge>
                        )}
                      </Button>
                    }
                    disableChainId
                    hideTestnets
                    onChange={(values) => {
                      props.setContext({
                        chainIds: values.map((x) => x.toString()),
                        networks: props.context?.networks || null,
                        walletAddress: props.context?.walletAddress || null,
                      });
                    }}
                    popoverContentClassName="!w-[calc(100vw-80px)] lg:!w-[320px]"
                    priorityChains={[
                      1, // ethereum
                      56, // bnb smart chain mainnet (bsc)
                      42161, // arbitrum one mainnet
                      8453, // base mainnet
                      43114, // avalanche mainnet
                      146, // sonic
                      137, // polygon
                      80094, // berachain mainnet
                      10, // optimism
                    ]}
                    selectedChainIds={selectedChainIds}
                    showSelectedValuesInModal={true}
                    side="top"
                  />
                </div>
              )}
            </div>

            {/* right */}
            <div className="flex items-center gap-2">
              {props.allowImageUpload ? (
                <ImageUploadButton
                  accept={supportedFileTypes.join(",")}
                  className="!h-auto w-auto shrink-0 gap-2 p-2"
                  multiple
                  onChange={(files) => {
                    handleImageUpload(files);
                  }}
                  value={undefined}
                  variant="ghost"
                >
                  <ToolTipLabel label="Attach Image">
                    <PaperclipIcon className="size-4" />
                  </ToolTipLabel>
                </ImageUploadButton>
              ) : props.onLoginClick ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="!h-auto w-auto shrink-0 gap-2 p-2"
                      variant="ghost"
                    >
                      <ToolTipLabel label="Attach Image">
                        <PaperclipIcon className="size-4" />
                      </ToolTipLabel>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div>
                      <p className="mb-3 text-muted-foreground text-sm">
                        Get access to image uploads by signing in to Nebula
                      </p>
                      <Button
                        className="w-full"
                        onClick={props.onLoginClick}
                        variant="default"
                      >
                        Sign in
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : null}

              {/* Send / Stop */}
              {props.isChatStreaming ? (
                <Button
                  className="!h-auto w-auto shrink-0 gap-2 p-2"
                  onClick={() => {
                    props.abortChatStream();
                  }}
                  variant="default"
                >
                  <CircleStopIcon className="size-4" />
                  Stop
                </Button>
              ) : (
                <Button
                  aria-label="Send"
                  className="!h-auto w-auto border border-nebula-pink-foreground p-2 disabled:opacity-100"
                  disabled={
                    (message.trim() === "" && images.length === 0) ||
                    props.isConnectingWallet
                  }
                  onClick={() => {
                    if (message.trim() === "" && images.length === 0) return;
                    handleSubmit(message);
                  }}
                  variant="pink"
                >
                  <ArrowUpIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DynamicHeight>
  );
}

async function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // includes "data:<mime-type>;base64," prefix
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = (error) => reject(error);
  });
}

function ImagePreview(props: {
  images: Array<{ file: File; b64: string | undefined }>;
  isUploading: boolean;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="fade-in-0 flex animate-in flex-wrap items-center gap-2 border-b border-dashed bg-background p-3">
      {props.images.map((image, index) => {
        return (
          <div
            className="relative flex items-center gap-2 rounded-lg border bg-card p-1"
            key={image.file.name}
          >
            <Img
              className="size-8 rounded"
              skeleton={
                <div className="flex items-center justify-center rounded border">
                  <Spinner className="size-4 text-muted-foreground" />
                </div>
              }
              src={image.b64}
            />
            <div className="w-[100px] lg:w-[120px]">
              <p className="truncate text-muted-foreground text-xs">
                {props.isUploading ? "Uploading..." : image.file.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {Math.round(image.file.size / 1024)} kB
              </p>
            </div>

            <ToolTipLabel label="Remove Image">
              <Button
                className="-top-1.5 -right-1.5 absolute h-auto w-auto rounded-full bg-card p-0.5"
                onClick={() => props.onRemove(index)}
                variant="outline"
              >
                <XIcon className="size-2.5" />
              </Button>
            </ToolTipLabel>
          </div>
        );
      })}
    </div>
  );
}

function ChainBadge(props: {
  chainId: number;
  plusMore: number;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(props.chainId);

  return (
    <Badge
      className="flex h-auto gap-1.5 px-1.5 py-1.5 hover:bg-accent"
      variant="outline"
    >
      <ChainIconClient
        className="size-3.5"
        client={props.client}
        src={chain?.icon?.url}
      />
      {chain?.name ? shortenChainName(chain.name) : `Chain #${props.chainId}`}
      {props.plusMore > 0 && (
        <span className="text-foreground"> +{props.plusMore}</span>
      )}
      <ChevronDownIcon className="size-3 text-muted-foreground/70" />
    </Badge>
  );
}

function shortenChainName(chainName: string) {
  return chainName.replace("Mainnet", "").trim();
}

function WalletSelector(props: {
  wallets: WalletMeta[];
  onClick: (wallet: WalletMeta) => void;
  client: ThirdwebClient;
  selectedAddress: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const activeWallet = useActiveWallet();

  const accountBlobbie = <AccountBlobbie className="size-3 rounded-full" />;
  const accountAvatarFallback = (
    <WalletIcon
      className="size-3 rounded-lg"
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  if (!props.selectedAddress || !activeWallet) {
    return null;
  }

  // show smart account first
  const sortedWallets = props.wallets.sort((a, b) => {
    if (a.walletId === "smart") return -1;
    if (b.walletId === "smart") return 1;
    return 0;
  });

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="flex h-auto items-center gap-1 rounded-full px-2 py-1.5 text-xs"
          variant="outline"
        >
          <WalletProvider id={activeWallet.id}>
            <AccountProvider
              address={props.selectedAddress}
              client={props.client}
            >
              <AccountAvatar
                className="size-3 rounded-full"
                fallbackComponent={accountAvatarFallback}
                loadingComponent={accountAvatarFallback}
              />
              <AccountName
                className="text-xs"
                fallbackComponent={
                  <span className="text-xs">
                    {shortenAddress(props.selectedAddress)}
                  </span>
                }
                loadingComponent={
                  <span className="text-xs">
                    {shortenAddress(props.selectedAddress)}
                  </span>
                }
              />
              <ChevronDownIcon className="size-3 text-muted-foreground/70" />
            </AccountProvider>
          </WalletProvider>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[350px] overflow-hidden border p-0 shadow-xl lg:w-[350px]"
        sideOffset={10}
      >
        <div className="border-b p-3 py-4">
          <p className="text-muted-foreground text-sm">
            Select account to use for executing transactions
          </p>
        </div>

        <div className="[&>*:not(:last-child)]:border-b">
          {sortedWallets.map((wallet) => {
            const accountBlobbie = (
              <AccountBlobbie className="size-8 rounded-full" />
            );
            const accountAvatarFallback = (
              <WalletIcon
                className="size-8 rounded-lg"
                fallbackComponent={accountBlobbie}
                loadingComponent={accountBlobbie}
              />
            );

            return (
              <div
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-4 hover:bg-accent/50",
                  props.selectedAddress === wallet.address && "bg-accent/50",
                )}
                key={wallet.address}
                onClick={() => {
                  setOpen(false);
                  props.onClick(wallet);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpen(false);
                    props.onClick(wallet);
                  }
                }}
                // biome-ignore lint/a11y/useSemanticElements: TODO
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2">
                  <WalletProvider id={wallet.walletId}>
                    <AccountProvider
                      address={wallet.address}
                      client={props.client}
                    >
                      <WalletProvider id={wallet.walletId}>
                        <div className="flex items-center gap-2.5">
                          <AccountAvatar
                            className="size-8 rounded-full"
                            fallbackComponent={accountAvatarFallback}
                            loadingComponent={accountAvatarFallback}
                          />

                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <AccountName
                                className="text-sm"
                                fallbackComponent={
                                  <span className="text-sm">
                                    {shortenAddress(wallet.address)}
                                  </span>
                                }
                                loadingComponent={
                                  <span className="text-sm">
                                    {shortenAddress(wallet.address)}
                                  </span>
                                }
                              />

                              <CopyButton address={wallet.address} />

                              {wallet.walletId === "smart" && (
                                <Badge
                                  className="bg-card px-2"
                                  variant="outline"
                                >
                                  Gasless
                                </Badge>
                              )}
                            </div>

                            <div className="text-muted-foreground text-sm">
                              {wallet.walletId === "smart" ? (
                                "Smart Account"
                              ) : (
                                <WalletName
                                  fallbackComponent={
                                    <span> Your Account </span>
                                  }
                                  loadingComponent={
                                    <Skeleton className="h-3.5 w-40" />
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </WalletProvider>
                    </AccountProvider>
                  </WalletProvider>
                </div>

                {props.selectedAddress === wallet.address && (
                  <CheckIcon className="size-4 text-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CopyButton(props: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      className="h-auto w-auto p-1.5 text-muted-foreground"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(props.address);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
      variant="ghost"
    >
      {copied ? (
        <CheckIcon className="size-3 text-green-500" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  );
}
