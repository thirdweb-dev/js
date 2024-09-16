import { thirdwebClient } from "@/constants/client";
import { resolveScheme } from "thirdweb/storage";
import {
  MaskedAvatar,
  type MaskedAvatarProps,
} from "tw-components/masked-avatar";
import { useEns, usePublisherProfile } from "../hooks";

interface PublisherAvatarProps extends Omit<MaskedAvatarProps, "src"> {
  address: string;
}

export const PublisherAvatar: React.FC<PublisherAvatarProps> = ({
  address,
  isLoading,
  ...restProps
}) => {
  const ensQuery = useEns(address);
  const publisherProfile = usePublisherProfile(
    ensQuery.data?.address || undefined,
  );
  return (
    <MaskedAvatar
      isLoading={isLoading || ensQuery.isLoading || publisherProfile.isLoading}
      src={
        publisherProfile.data?.avatar
          ? resolveScheme({
              uri: publisherProfile.data.avatar,
              client: thirdwebClient,
            })
          : ""
      }
      {...restProps}
    />
  );
};
