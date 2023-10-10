/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { ProfileOG } from "og-lib/url-utils";

// Make sure the font exists in the specified path:
export const config = {
  runtime: "edge",
};

const image = fetch(
  new URL("og-lib/assets/profile/background.png", import.meta.url),
).then((res) => res.arrayBuffer());

const inter400_ = fetch(
  new URL(`og-lib/fonts/inter/400.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());
const inter500_ = fetch(
  new URL(`og-lib/fonts/inter/500.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());
const inter700_ = fetch(
  new URL(`og-lib/fonts/inter/700.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());

const ibmPlexMono400_ = fetch(
  new URL(`og-lib/fonts/ibm-plex-mono/400.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());
const ibmPlexMono500_ = fetch(
  new URL(`og-lib/fonts/ibm-plex-mono/500.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());
const ibmPlexMono700_ = fetch(
  new URL(`og-lib/fonts/ibm-plex-mono/700.ttf`, import.meta.url),
).then((res) => res.arrayBuffer());

const OgBrandIcon: React.FC = () => (
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

const PackageIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,.5)"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const MAX_LENGTH = 320;

function descriptionShortener(description: string) {
  let words = [];
  let currentLength = 0;
  let shortened = false;
  for (const word of description.split(" ")) {
    // +1 for the space
    if (currentLength + word.length + 1 > MAX_LENGTH) {
      shortened = true;
      break;
    }
    words.push(word);
    currentLength += word.length + 1;
  }
  if (words[words.length - 1].length < 4) {
    words = words.slice(0, -1);
  }
  if (words[words.length - 1].endsWith(".")) {
    return words.join(" ");
  }
  if (!shortened) {
    return words.join(" ");
  }
  return `${words.join(" ")} ...`;
}

const IPFS_GATEWAY = process.env.API_ROUTES_CLIENT_ID
  ? `https://${process.env.API_ROUTES_CLIENT_ID}.ipfscdn.io/ipfs/`
  : "https://ipfs.io/ipfs/";

function replaceAnyIpfsUrlWithGateway(url: string) {
  if (url.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}${url.slice(7)}`;
  }
  if (url.includes("/ipfs/")) {
    const [, after] = url.split("/ipfs/");
    return `${IPFS_GATEWAY}${after}`;
  }
  return url;
}

export default async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const profileData = ProfileOG.fromUrl(new URL(req.url));

  const [
    inter400,
    inter500,
    inter700,
    ibmPlexMono400,
    ibmPlexMono500,
    ibmPlexMono700,
    imageData,
  ] = await Promise.all([
    inter400_,
    inter500_,
    inter700_,
    ibmPlexMono400_,
    ibmPlexMono500_,
    ibmPlexMono700_,
    image,
  ]);

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex justify-center py-20 px-16"
        // eslint-disable-next-line react/forbid-dom-props
        style={{
          background: "#0D0D12",
          fontFamily: "Inter",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          // @ts-expect-error - this works fine
          src={imageData}
          width="1200px"
          height="630px"
          tw="absolute object-cover"
        />
        {/* the actual component starts here */}

        <div tw="w-full h-full flex flex-col justify-between">
          {/* title description and profile image */}
          <div tw="flex flex-col w-full">
            <img
              alt=""
              tw="w-32 h-32 rounded-full"
              src={
                profileData.avatar
                  ? replaceAnyIpfsUrlWithGateway(profileData.avatar)
                  : `https://source.boringavatars.com/marble/120/${profileData.displayName}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
              }
            />
            <h1 tw="text-7xl text-white font-bold my-3">
              {profileData.displayName}
            </h1>
            {profileData.bio && (
              <p tw="font-medium text-3xl text-opacity-90 text-white">
                {descriptionShortener(profileData.bio)}
              </p>
            )}
          </div>
          <div tw="flex justify-between w-full items-end">
            <div
              tw="flex flex-row text-white font-medium text-3xl max-w-4xl items-center text-opacity-75"
              // eslint-disable-next-line react/forbid-dom-props
              style={{
                fontFamily: "IBM Plex Mono",
              }}
            >
              <PackageIcon />
              <span tw="ml-4">
                {profileData.publishedCnt || 0} published contract
                {profileData.publishedCnt === "1" ? "" : "s"}
              </span>
            </div>
            <div tw="flex flex-shrink-0">
              <OgBrandIcon />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: inter400,
          name: "Inter",
          weight: 400,
        },
        {
          data: inter500,
          name: "Inter",
          weight: 500,
        },
        {
          data: inter700,
          name: "Inter",
          weight: 700,
        },
        {
          data: ibmPlexMono400,
          name: "IBM Plex Mono",
          weight: 400,
        },
        {
          data: ibmPlexMono500,
          name: "IBM Plex Mono",
          weight: 500,
        },
        {
          data: ibmPlexMono700,
          name: "IBM Plex Mono",
          weight: 700,
        },
      ],
    },
  );
}
