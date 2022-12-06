import { useEns, useReleaserProfile } from "../hooks";
import { MaskedAvatar, MaskedAvatarProps } from "tw-components/masked-avatar";

export interface ReleaserAvatarProps extends Omit<MaskedAvatarProps, "src"> {
  address: string;
}

export const ReleaserAvatar: React.FC<ReleaserAvatarProps> = ({
  address,
  isLoading,
  ...restProps
}) => {
  const ensQuery = useEns(address);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  return (
    <MaskedAvatar
      isLoading={isLoading || ensQuery.isLoading || releaserProfile.isLoading}
      src={
        releaserProfile.data?.avatar ||
        `https://source.boringavatars.com/marble/120/${
          ensQuery.data?.ensName || ensQuery.data?.address
        }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
      }
      {...restProps}
    />
  );
};
