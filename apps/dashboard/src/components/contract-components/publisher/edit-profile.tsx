"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { Box, FormControl, Input, Textarea } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { DiscordIcon } from "components/icons/brand-icons/DiscordIcon";
import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { XIcon } from "components/icons/brand-icons/XIcon";
import { FileInput } from "components/shared/FileInput";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import type { ProfileMetadata, ProfileMetadataInput } from "constants/schemas";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { EditIcon, GlobeIcon, ImageIcon, PencilIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getContractPublisher,
  setPublisherProfileUri,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { FormErrorMessage, FormLabel } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

interface EditProfileProps {
  publisherProfile: ProfileMetadata;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  publisherProfile,
}) => {
  const FORM_ID = useId();
  const client = useThirdwebClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileMetadataInput>({
    defaultValues: publisherProfile,
    values: publisherProfile,
  });

  const imageUrl = useImageFileOrUrl(watch("avatar"));

  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();
  const sendTx = useSendAndConfirmTransaction({
    gasless: {
      experimentalChainlessSupport: true,
      provider: "engine",
      relayerUrl: DASHBOARD_ENGINE_RELAYER_URL,
      relayerForwarderAddress: DASHBOARD_FORWARDER_ADDRESS,
    },
  });
  const trackEvent = useTrack();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <EditIcon className="mr-2 size-4" /> Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
        <SheetHeader>
          <SheetTitle className="text-left">Edit your profile</SheetTitle>
        </SheetHeader>
        <form
          className="mt-6 flex flex-col gap-6"
          id={FORM_ID}
          onSubmit={handleSubmit((d) => {
            if (!address) {
              return;
            }
            trackEvent({
              category: "profile",
              action: "edit",
              label: "attempt",
            });
            try {
              const tx = setPublisherProfileUri({
                contract: getContractPublisher(client),
                asyncParams: async () => {
                  return {
                    publisher: address,
                    uri: await upload({
                      files: [d],
                      client,
                    }),
                  };
                },
              });
              const promise = sendTx.mutateAsync(tx, {
                onSuccess: async () => {
                  await queryClient.invalidateQueries({
                    queryKey: ["releaser-profile", address],
                  });
                  trackEvent({
                    category: "profile",
                    action: "edit",
                    label: "success",
                  });
                  setOpen(false);
                },
                onError: (error) => {
                  trackEvent({
                    category: "profile",
                    action: "edit",
                    label: "error",
                    error,
                  });
                },
              });

              toast.promise(promise, {
                loading: "Updating profile",
                success: "Profile updated successfully",
                error: "Failed to update profile",
              });
            } catch (err) {
              console.error(err);
              toast.error("Failed to update profile");
            }
          })}
        >
          <FormControl isInvalid={!!errors.avatar}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <ImageIcon className="size-4" />
                Avatar
              </div>
            </FormLabel>
            <Box width={{ base: "auto", md: "250px" }}>
              <FileInput
                accept={{ "image/*": [] }}
                value={imageUrl}
                showUploadButton
                setValue={(file) => setValue("avatar", file)}
                className="rounded border border-border transition-all"
                renderPreview={(fileUrl) => (
                  <MaskedAvatar className="h-full w-full" src={fileUrl} />
                )}
              />
            </Box>
            <FormErrorMessage>
              {errors?.avatar?.message as unknown as string}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.bio}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <PencilIcon className="size-4" />
                Bio
              </div>
            </FormLabel>
            <Textarea
              {...register("bio")}
              autoFocus
              placeholder="Tell us about yourself"
            />
            <FormErrorMessage>{errors?.bio?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.github}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <GithubIcon className="size-4" />
                GitHub
              </div>
            </FormLabel>
            <Input
              {...register("github")}
              placeholder="https://github.com/yourname"
            />
            <FormErrorMessage>{errors?.github?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.twitter}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <XIcon className="size-4" />
                Twitter
              </div>
            </FormLabel>
            <Input
              {...register("twitter")}
              placeholder="https://twitter.com/yourname"
            />
            <FormErrorMessage>{errors?.twitter?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.website}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <GlobeIcon className="size-4" />
                Website
              </div>
            </FormLabel>
            <Input
              {...register("website")}
              placeholder="https://yourwebsite.com"
            />
            <FormErrorMessage>{errors?.website?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.discord}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <DiscordIcon className="size-4" />
                Discord
              </div>
            </FormLabel>
            <Input
              {...register("discord")}
              placeholder="https://discord.gg/yourserver"
            />
            <FormErrorMessage>{errors?.discord?.message}</FormErrorMessage>
          </FormControl>
          <div className="mt-6 flex flex-row justify-end gap-3">
            <Button
              className="relative rounded-md"
              variant="primary"
              type="submit"
              disabled={sendTx.isPending}
              form={FORM_ID}
            >
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
