"use client";
/* eslint-disable */
import { Img } from "@/components/blocks/Img";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { useDashboardStorageUpload } from "@3rdweb-sdk/react/hooks/useDashboardStorageUpload";
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useEcosystemList } from "../../../hooks/use-ecosystem-list";
import type { Ecosystem } from "../../../types";
import { useUpdateEcosystem } from "../configuration/hooks/use-update-ecosystem";
import { useEcosystem } from "../hooks/use-ecosystem";

function EcosystemAlertBanner({ ecosystem }: { ecosystem: Ecosystem }) {
  switch (ecosystem.status) {
    case "requested": {
      return (
        <Alert variant="info">
          <Spinner className="h-4 w-4" />
          <AlertTitle>Ecosystem spinning up!</AlertTitle>
          <AlertDescription>
            Your payment is being processed and ecosystem is being created.
            Please wait.
          </AlertDescription>
        </Alert>
      );
    }
    case "paymentFailed": {
      return (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Payment failed!</AlertTitle>
          <AlertDescription>
            Your payment failed. Please update your payment method and contact
            support@thirdweb.com
          </AlertDescription>
        </Alert>
      );
    }
    default: {
      return null;
    }
  }
}

function EcosystemSelect(props: {
  ecosystem: Ecosystem;
  ecosystemLayoutPath: string;
  teamIdOrSlug: string;
}) {
  const { data: ecosystems, isPending } = useEcosystemList({
    teamIdOrSlug: props.teamIdOrSlug,
  });

  return isPending ? (
    <Skeleton className="h-10 w-full md:w-[160px]" />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative flex w-full justify-start truncate pr-8 pl-3 md:w-48"
        >
          <div className="truncate">{props.ecosystem?.name}</div>
          <ChevronsUpDownIcon className="absolute right-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full md:w-48">
        <DropdownMenuGroup>
          {ecosystems?.map((ecosystem) => (
            <DropdownMenuItem key={ecosystem.id} asChild>
              <Link
                href={`${props.ecosystemLayoutPath}/${ecosystem.slug}`}
                className="relative flex cursor-pointer items-center pr-3 pl-8"
              >
                {ecosystem.slug === props.ecosystem.slug && (
                  <CheckIcon className="absolute left-2 h-4 w-4 text-foreground" />
                )}
                <div className="truncate">{ecosystem.name}</div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href={`${props.ecosystemLayoutPath}/create`} className="">
          <DropdownMenuItem className="relative flex cursor-pointer items-center pr-3 pl-8">
            <PlusCircleIcon className="absolute left-2 h-4 w-4" />
            <div className="truncate">New Ecosystem</div>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EcosystemHeader(props: {
  ecosystem: Ecosystem;
  ecosystemLayoutPath: string;
  teamIdOrSlug: string;
  authToken: string;
  teamId: string;
  client: ThirdwebClient;
}) {
  const { data: fetchedEcosystem } = useEcosystem({
    teamIdOrSlug: props.teamIdOrSlug,
    slug: props.ecosystem.slug,
    refetchInterval:
      props.ecosystem.status === "requested"
        ? 3000
        : props.ecosystem.status === "paymentFailed"
          ? 60000
          : undefined,
    refetchOnWindowFocus: false,
    initialData: props.ecosystem,
  });

  const ecosystem = fetchedEcosystem ?? props.ecosystem;

  const ecosystemImageLink = resolveSchemeWithErrorHandler({
    uri: ecosystem.imageUrl,
    client: props.client,
  });

  // ------------------- Image Upload Logic -------------------
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Name editing state
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState(ecosystem.name);

  const storageUpload = useDashboardStorageUpload({
    client: props.client,
  });
  const router = useDashboardRouter();

  const { mutateAsync: updateEcosystem, isPending: isUpdating } =
    useUpdateEcosystem(
      {
        authToken: props.authToken,
        teamId: props.teamId,
      },
      {
        onSuccess: () => {
          toast.success("Ecosystem updated");
          setIsDialogOpen(false);
          router.refresh();
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to update image";
          toast.error(message);
        },
      },
    );

  const isUploading = storageUpload.isPending || isUpdating;

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Only PNG, JPG or WEBP images are allowed");
      return;
    }

    try {
      const [uri] = await storageUpload.mutateAsync([selectedFile]);
      await updateEcosystem({
        ...ecosystem,
        imageUrl: uri,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  }

  async function handleNameSave() {
    const trimmed = tempName.trim();
    if (!trimmed || trimmed === ecosystem.name) {
      setIsNameDialogOpen(false);
      return;
    }
    try {
      await updateEcosystem({
        ...ecosystem,
        name: trimmed,
      });
      setIsNameDialogOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name");
    }
  }

  return (
    <div className="border-b py-8">
      <div className="container flex flex-col gap-8">
        <EcosystemAlertBanner ecosystem={ecosystem} />
        <header className="flex flex-col gap-12">
          <div className="flex flex-col justify-between gap-4 md:grid-cols-4 md:flex-row">
            <div className="flex items-center gap-4">
              {!ecosystem.imageUrl ? (
                <Skeleton className="size-24" />
              ) : (
                ecosystemImageLink && (
                  <div className="relative">
                    <Img
                      src={ecosystemImageLink}
                      alt={ecosystem.name}
                      className={cn(
                        "size-24",
                        "border",
                        "rounded-full",
                        "object-contain object-center",
                      )}
                    />

                    {/* Upload Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "absolute",
                            "right-0 bottom-0",
                            "h-6 w-6",
                            "p-1",
                            "rounded-full",
                            "bg-background",
                            "hover:bg-accent",
                          )}
                          aria-label="Change logo"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[480px]">
                        <DialogHeader>
                          <DialogTitle>Update Ecosystem Logo</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 py-2">
                          <ImageUpload
                            onUpload={(files) => {
                              if (files?.[0]) {
                                setSelectedFile(files[0]);
                              }
                            }}
                            accept="image/png,image/jpeg,image/webp"
                          />
                        </div>

                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isUploading}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleUpload}
                            disabled={isUploading || !selectedFile}
                          >
                            {isUploading ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              "Upload"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              )}
              <div className="flex flex-col gap-2">
                {!ecosystem.name ? (
                  <Skeleton className="h-12 w-[225px]" />
                ) : (
                  <h2 className="font-semibold text-3xl text-foreground tracking-tight">
                    {ecosystem.name}
                    <Dialog
                      open={isNameDialogOpen}
                      onOpenChange={setIsNameDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-5 w-5 rounded-full p-1 hover:bg-accent"
                          aria-label="Edit name"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-[480px]">
                        <DialogHeader>
                          <DialogTitle>Edit Ecosystem Name</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 py-2">
                          <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                          />
                        </div>

                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isUpdating}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleNameSave}
                            disabled={isUpdating || !tempName.trim()}
                          >
                            {isUpdating ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </h2>
                )}
                {!ecosystem.slug ? (
                  <Skeleton className="h-6 w-[300px]" />
                ) : (
                  <div>
                    <CopyTextButton
                      textToCopy={`ecosystem.${ecosystem.slug}`}
                      textToShow={`ecosystem.${ecosystem.slug}`}
                      copyIconPosition="right"
                      tooltip="Copy Ecosystem slug"
                      variant="ghost"
                      className="-translate-x-2 px-2 py-0.5 text-muted-foreground"
                    />

                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="-translate-x-2 h-auto w-auto gap-2 rounded-xl px-2 py-0.5 text-muted-foreground"
                    >
                      <Link
                        href={`https://${ecosystem.slug}.ecosystem.thirdweb.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${ecosystem.slug}.ecosystem.thirdweb.com`}
                        <ExternalLinkIcon className="size-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 md:items-end">
              <EcosystemSelect
                ecosystem={ecosystem}
                ecosystemLayoutPath={props.ecosystemLayoutPath}
                teamIdOrSlug={props.teamIdOrSlug}
              />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
