import { useEns, usePublisherProfile } from "../hooks";
import { MaskedAvatar, MaskedAvatarProps } from "tw-components/masked-avatar";

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
        publisherProfile.data?.avatar ||
        `https://source.boringavatars.com/marble/120/${
          ensQuery.data?.ensName || ensQuery.data?.address
        }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
      }
      {...restProps}
    />
  );
};
