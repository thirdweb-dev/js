"use client";
import { AlertTriangleIcon, ExternalLinkIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
/* eslint-disable */
import { Img } from "@/components/blocks/Img";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStorageUpload } from "@/hooks/useDashboardStorageUpload";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
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

export function EcosystemHeader(props: {
  ecosystem: Ecosystem;
  ecosystemLayoutPath: string;
  teamIdOrSlug: string;
  authToken: string;
  teamId: string;
  client: ThirdwebClient;
}) {
  const { data: fetchedEcosystem } = useEcosystem({
    initialData: props.ecosystem,
    refetchInterval:
      props.ecosystem.status === "requested"
        ? 3000
        : props.ecosystem.status === "paymentFailed"
          ? 60000
          : undefined,
    refetchOnWindowFocus: false,
    slug: props.ecosystem.slug,
    teamIdOrSlug: props.teamIdOrSlug,
  });

  const ecosystem = fetchedEcosystem ?? props.ecosystem;

  const ecosystemImageLink = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: ecosystem.imageUrl,
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
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to update image";
          toast.error(message);
        },
        onSuccess: () => {
          toast.success("Ecosystem updated");
          setIsDialogOpen(false);
          router.refresh();
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
    <div className="pt-8 pb-4">
      <div className="container max-w-7xl flex flex-col gap-8">
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
                      alt={ecosystem.name}
                      className={cn(
                        "size-24",
                        "border",
                        "rounded-full",
                        "object-contain object-center",
                      )}
                      src={ecosystemImageLink}
                    />

                    {/* Upload Dialog */}
                    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          aria-label="Change logo"
                          className={cn(
                            "absolute",
                            "right-0 bottom-0",
                            "h-6 w-6",
                            "p-1",
                            "rounded-full",
                            "bg-background",
                            "hover:bg-accent",
                          )}
                          size="icon"
                          variant="ghost"
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
                            accept="image/png,image/jpeg,image/webp"
                            onUpload={(files) => {
                              if (files?.[0]) {
                                setSelectedFile(files[0]);
                              }
                            }}
                          />
                        </div>

                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button disabled={isUploading} variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            disabled={isUploading || !selectedFile}
                            onClick={handleUpload}
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
                      onOpenChange={setIsNameDialogOpen}
                      open={isNameDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          aria-label="Edit name"
                          className="ml-2 h-5 w-5 rounded-full p-1 hover:bg-accent"
                          size="icon"
                          variant="ghost"
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
                            onChange={(e) => setTempName(e.target.value)}
                            value={tempName}
                          />
                        </div>

                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button disabled={isUpdating} variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            disabled={isUpdating || !tempName.trim()}
                            onClick={handleNameSave}
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
                      className="-translate-x-2 px-2 py-0.5 text-muted-foreground"
                      copyIconPosition="right"
                      textToCopy={`ecosystem.${ecosystem.slug}`}
                      textToShow={`ecosystem.${ecosystem.slug}`}
                      tooltip="Copy Ecosystem slug"
                      variant="ghost"
                    />

                    <Button
                      asChild
                      className="-translate-x-2 h-auto w-auto gap-2 rounded-xl px-2 py-0.5 text-muted-foreground"
                      size="sm"
                      variant="ghost"
                    >
                      <Link
                        href={`https://${ecosystem.slug}.ecosystem.thirdweb.com`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {`${ecosystem.slug}.ecosystem.thirdweb.com`}
                        <ExternalLinkIcon className="size-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
