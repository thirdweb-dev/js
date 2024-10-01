"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import {
  Box,
  FormControl,
  Icon,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
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
import { useTxNotifications } from "hooks/useTxNotifications";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { BiImage } from "react-icons/bi";
import { FiEdit, FiGlobe } from "react-icons/fi";
import { HiPencilAlt } from "react-icons/hi";
import {
  getContractPublisher,
  setPublisherProfileUri,
} from "thirdweb/extensions/thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import {
  Button,
  Drawer,
  FormErrorMessage,
  FormLabel,
  Heading,
} from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

interface EditProfileProps {
  publisherProfile: ProfileMetadata;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  publisherProfile,
}) => {
  const FORM_ID = useId();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const { onSuccess, onError } = useTxNotifications(
    "Profile update successfully",
    "Error updating profile",
  );

  const trackEvent = useTrack();

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        variant="outline"
        leftIcon={<Icon as={FiEdit} />}
      >
        Edit Profile
      </Button>

      <form
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
          sendTx.mutate(tx, {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: ["releaser-profile", address],
              });
              onSuccess();
              trackEvent({
                category: "profile",
                action: "edit",
                label: "success",
              });
              onClose();
            },
            onError: (error) => {
              onError(error);
              trackEvent({
                category: "profile",
                action: "edit",
                label: "error",
                error,
              });
            },
          });
        })}
      >
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          allowPinchZoom
          preserveScrollBarGap
          size="lg"
          header={{
            children: <Heading size="title.md">Edit your profile</Heading>,
          }}
          footer={{
            children: (
              <Button
                borderRadius="md"
                position="relative"
                role="group"
                colorScheme="primary"
                type="submit"
                isLoading={sendTx.isPending}
                form={FORM_ID}
              >
                Save
              </Button>
            ),
          }}
          drawerBodyProps={{
            gap: 6,
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
          <FormControl isInvalid={!!errors.avatar}>
            <FormLabel>
              <div className="flex flex-row gap-2">
                <Icon as={BiImage} boxSize={4} />
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
                <Icon as={HiPencilAlt} boxSize={4} />
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
                <Icon as={FiGlobe} boxSize={4} />
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
        </Drawer>
      </form>
    </>
  );
};
