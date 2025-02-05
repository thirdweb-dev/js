/* eslint-disable @next/next/no-img-element */
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { ImageResponse } from "next/og";
import { isAddress } from "thirdweb";
import { download } from "thirdweb/storage";
import { shortenAddress } from "thirdweb/utils";

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

const PackageIcon: React.FC = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,.5)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const FileTextIcon: React.FC = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,.5)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,.5)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const VersionIcon: React.FC = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,.5)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const MAX_LENGTH = 190;

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
  const lastWord = words[words.length - 1];
  if (lastWord && lastWord.length < 4) {
    words = words.slice(0, -1);
  }
  if (words[words.length - 1]?.endsWith(".")) {
    return words.join(" ");
  }
  if (!shortened) {
    return words.join(" ");
  }
  return `${words.join(" ")} ...`;
}

export async function publishedContractOGImageTemplate(params: {
  title: string;
  description?: string;
  version: string;
  publisher: string;
  license: string[];
  publishDate: string;
  logo?: string;
  publisherAvatar?: string;
  extension?: string[];
}) {
  const image = fetch(
    new URL("og-lib/assets/publish/background.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const inter400_ = fetch(
    new URL("../../../../../../og-lib/fonts/inter/400.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const inter500_ = fetch(
    new URL("../../../../../../og-lib/fonts/inter/500.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const inter700_ = fetch(
    new URL("../../../../../../og-lib/fonts/inter/700.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const ibmPlexMono400_ = fetch(
    new URL(
      "../../../../../../og-lib/fonts/ibm-plex-mono/400.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());
  const ibmPlexMono500_ = fetch(
    new URL(
      "../../../../../../og-lib/fonts/ibm-plex-mono/500.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());
  const ibmPlexMono700_ = fetch(
    new URL(
      "../../../../../../og-lib/fonts/ibm-plex-mono/700.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const client = getThirdwebClient();

  const [
    inter400,
    inter500,
    inter700,
    ibmPlexMono400,
    ibmPlexMono500,
    ibmPlexMono700,
    imageData,
    logo,
    avatar,
  ] = await Promise.all([
    inter400_,
    inter500_,
    inter700_,
    ibmPlexMono400_,
    ibmPlexMono500_,
    ibmPlexMono700_,
    image,
    params.logo
      ? download({
          uri: params.logo,
          client,
        }).then((res) => res.arrayBuffer())
      : undefined,
    params.publisherAvatar
      ? download({
          uri: params.publisherAvatar,
          client,
        }).then((res) => res.arrayBuffer())
      : undefined,
  ]);

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
        src={imageData}
        width="1200px"
        height="630px"
        tw="absolute"
        alt=""
      />
      {/* the actual component starts here */}

      <div tw="w-full h-full flex flex-col justify-between">
        {/* title description and profile image */}
        <div tw="flex justify-between items-start w-full">
          <div tw="flex flex-col flex-shrink">
            <div tw="flex items-center">
              {/* @ts-expect-error - this works fine */}
              {logo && <img src={logo} tw="w-16 h-16 rounded-xl mr-4" alt="" />}
              <h1 tw="text-6xl font-bold text-white">{params.title}</h1>
            </div>
            {params?.description && (
              <p tw="text-3xl font-medium text-gray-400 max-w-4xl">
                {descriptionShortener(params.description)}
              </p>
            )}
          </div>
          <div tw="flex flex-col shrink-0 items-center">
            {avatar && (
              <img
                alt=""
                width={100}
                height={100}
                tw="w-32 h-32 rounded-full"
                // @ts-expect-error - this works fine
                src={avatar}
              />
            )}

            <h2 tw="text-2xl text-white font-medium max-w-full">
              {isAddress(params.publisher)
                ? shortenAddress(params.publisher)
                : params.publisher}
            </h2>
          </div>
        </div>
        <div tw="flex justify-between w-full items-end">
          <ul
            tw="flex-col text-white font-medium text-2xl max-w-4xl"
            style={{
              fontFamily: "IBM Plex Mono",
            }}
          >
            {params.extension?.length ? (
              <li
                tw="flex flex-row items-center overflow-hidden w-full"
                style={{ whiteSpace: "nowrap" }}
              >
                <PackageIcon />
                <span tw="ml-2">
                  {Array.isArray(params.extension)
                    ? categorizeExtensions(params.extension).map(
                        ([ext, count]) => (
                          <span key={ext} tw="flex flex-row items-center mr-3">
                            {ext}
                            <span tw="text-black px-3 h-auto font-bold m-1 rounded-full text-sm bg-white opacity-90">
                              <span tw="m-auto">{count}</span>
                            </span>
                          </span>
                        ),
                      )
                    : params.extension}
                </span>
              </li>
            ) : null}
            {params.license?.length ? (
              <li tw="flex flex-row items-center">
                <FileTextIcon />
                <span tw="ml-2">
                  {Array.isArray(params.license)
                    ? params.license.join(", ")
                    : params.license}
                </span>
              </li>
            ) : null}
            <li tw="flex flex-row items-center">
              <VersionIcon />
              <span tw="ml-2">{params.version}</span>
            </li>
            <li tw="flex flex-row items-center">
              <CalendarIcon />
              <span tw="ml-2">{params.publishDate}</span>
            </li>
          </ul>
          <div tw="flex flex-shrink-0">
            <OgBrandIcon />
          </div>
        </div>
      </div>
    </div>,
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

const ERC_CATEGORIES = ["ERC721", "ERC1155", "ERC20"] as const;

function categorizeExtensions(extensions: string[]) {
  const categoriesWithCount: Record<
    (typeof ERC_CATEGORIES)[number] | "Other",
    number
  > = {
    ERC721: 0,
    ERC1155: 0,
    ERC20: 0,
    Other: 0,
  };
  // biome-ignore lint/complexity/noForEach: FIXME
  extensions.forEach((extension) => {
    if (extension.startsWith("ERC721")) {
      categoriesWithCount.ERC721 += 1;
    } else if (extension.startsWith("ERC1155")) {
      categoriesWithCount.ERC1155 += 1;
    } else if (extension.startsWith("ERC20")) {
      categoriesWithCount.ERC20 += 1;
    } else {
      categoriesWithCount.Other += 1;
    }
  });
  return Object.entries(categoriesWithCount).filter(([, count]) => count > 0);
}
