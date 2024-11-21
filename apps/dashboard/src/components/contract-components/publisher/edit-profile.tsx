"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import {
  DASHBOARD_ENGINE_RELAYER_URL,
  DASHBOARD_FORWARDER_ADDRESS,
} from "constants/misc";
import type { ProfileMetadata, ProfileMetadataInput } from "constants/schemas";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { EditIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getContractPublisher,
  setPublisherProfileUri,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { upload } from "thirdweb/storage";
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
        <Button variant="outline" className="gap-2">
          <EditIcon className="size-4" /> Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto md:min-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-left">Edit your profile</SheetTitle>
        </SheetHeader>
        <form
          className="mt-6 flex flex-col gap-5"
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
              success: "Profile updated successfully",
              error: "Failed to update profile",
            });
          })}
        >
          <FormFieldSetup
            errorMessage={errors?.avatar?.message}
            htmlFor="avatar"
            isRequired={false}
            label="Avatar"
          >
            <FileInput
              accept={{ "image/*": [] }}
              value={resolveSchemeWithErrorHandler({
                client,
                uri: imageUrl,
              })}
              showUploadButton
              setValue={(file) => setValue("avatar", file)}
              className="max-w-[250px] rounded border border-border transition-all"
              renderPreview={(fileUrl) => (
                <MaskedAvatar className="h-full w-full" src={fileUrl} />
              )}
              previewMaxWidth="200px"
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={errors?.bio?.message}
            htmlFor="bio"
            isRequired={false}
            label="Bio"
          >
            <Textarea
              {...register("bio")}
              autoFocus
              placeholder="Tell us about yourself"
              id="bio"
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={errors?.github?.message}
            htmlFor="github"
            isRequired={false}
            label="GitHub"
          >
            <Input
              {...register("github")}
              placeholder="https://github.com/yourname"
              id="github"
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={errors?.twitter?.message}
            htmlFor="twitter"
            isRequired={false}
            label="Twitter"
          >
            <Input
              {...register("twitter")}
              placeholder="https://twitter.com/yourname"
              id="twitter"
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={errors?.website?.message}
            htmlFor="website"
            isRequired={false}
            label="Website"
          >
            <Input
              {...register("website")}
              placeholder="https://yourwebsite.com"
              id="website"
            />
          </FormFieldSetup>

          <FormFieldSetup
            errorMessage={errors?.discord?.message}
            htmlFor="discord"
            isRequired={false}
            label="Discord"
          >
            <Input
              {...register("discord")}
              placeholder="https://discord.gg/yourserver"
              id="discord"
            />
          </FormFieldSetup>

          <div className="mt-6 flex flex-row justify-end gap-3">
            <Button
              className="gap-2"
              variant="primary"
              type="submit"
              disabled={sendTx.isPending}
              form={FORM_ID}
            >
              {sendTx.isPending && <Spinner className="size-4" />}
              Update Profile
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
