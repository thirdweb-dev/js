import { GradientBlobbie } from "@/components/blocks/Avatars/GradientBlobbie";
/* eslint-disable @next/next/no-img-element */
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { resolveAvatar } from "thirdweb/extensions/ens";
import { shortenIfAddress } from "../../../../utils/usedapp-external";
import { resolveAddressAndEns } from "./resolveAddressAndEns";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

type PageProps = {
  params: Promise<{
    addressOrEns: string;
  }>;
};

export default async function Image(props: PageProps) {
  const client = getThirdwebClient();
  const params = await props.params;
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns);

  if (!resolvedInfo) {
    notFound();
  }

  const [inter700, profileBackground] = await Promise.all([
    fetch(new URL("og-lib/fonts/inter/700.ttf", import.meta.url)).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(
      new URL("og-lib/assets/profile/background.png", import.meta.url),
    ).then((res) => res.arrayBuffer()),
  ]);

  const ensImage = resolvedInfo.ensName
    ? await resolveAvatar({
        client: client,
        name: resolvedInfo.ensName,
      })
    : null;

  const resolvedENSImageSrc = ensImage
    ? resolveSchemeWithErrorHandler({
        client: client,
        uri: ensImage,
      })
    : null;

  return new ImageResponse(
    <div
      tw="w-full h-full flex justify-center py-20 px-16"
      style={{
        background: "#0D0D12",
        fontFamily: "Inter",
      }}
    >
      <img
        // @ts-expect-error - this works fine
        src={profileBackground}
        width="1200px"
        height="630px"
        tw="absolute"
        alt=""
      />

      <div tw="w-full h-full flex flex-col justify-between">
        <div tw="flex flex-col w-full">
          {resolvedENSImageSrc ? (
            <img alt="" tw="w-32 h-32 rounded-full" src={resolvedENSImageSrc} />
          ) : (
            <GradientBlobbie
              id={resolvedInfo.address}
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "50%",
              }}
            />
          )}

          <h1 tw="text-7xl text-white font-bold my-5">
            {resolvedInfo.ensName || shortenIfAddress(resolvedInfo.address)}
          </h1>
        </div>
        <div tw="flex justify-end w-full items-end">
          <div tw="flex flex-shrink-0">
            <OgBrandIcon />
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          data: inter700,
          name: "Inter",
          weight: 700,
        },
      ],
    },
  );
}

const OgBrandIcon: React.FC = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="59"
    height="36"
    viewBox="0 0 59 36"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.157801 3.02898C-0.425237 1.57299 0.661334 0 2.25144 0H12.1233C13.0509 0 13.8725 0.545996 14.217 1.39099L22.0747 20.7869C22.2868 21.3068 22.2868 21.8918 22.0747 22.4248L17.1322 34.6058C16.3769 36.4647 13.7002 36.4647 12.9449 34.6058L0.157801 3.02898ZM19.227 2.96398C18.697 1.52099 19.7835 0 21.3471 0H29.9469C30.901 0 31.7491 0.584996 32.0671 1.45599L39.2093 20.8519C39.3816 21.3328 39.3816 21.8658 39.2093 22.3598L34.916 34.0208C34.2005 35.9707 31.3913 35.9707 30.6757 34.0208L19.227 2.96398ZM38.5336 0C36.9435 0 35.8569 1.57299 36.4399 3.02898L49.227 34.6058C49.9823 36.4647 52.659 36.4647 53.4143 34.6058L58.3569 22.4248C58.5689 21.8918 58.5689 21.3068 58.3569 20.7869L50.4991 1.39099C50.1546 0.545996 49.333 0 48.4055 0H38.5336Z"
      fill="white"
      fillOpacity="0.5"
    />
  </svg>
);
