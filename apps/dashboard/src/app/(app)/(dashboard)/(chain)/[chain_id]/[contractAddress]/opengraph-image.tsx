/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { useId } from "react";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isProd } from "@/constants/env-utils";
import { API_ROUTES_CLIENT_ID } from "@/constants/server-envs";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";

export const runtime = "edge";

export const size = {
  height: 630,
  width: 1200,
};

export default async function Image({
  params,
}: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  try {
    const info = await getContractPageParamsInfo({
      chainIdOrSlug: params.chain_id,
      contractAddress: params.contractAddress,
      teamId: undefined,
    });

    if (!info) {
      throw new Error();
    }

    const contractMetadata = await getContractMetadata({
      contract: info.serverContract,
    });

    if (contractMetadata.name === null) {
      throw new Error();
    }

    const contractDisplayName = `${contractMetadata.name}${
      contractMetadata.symbol ? ` (${contractMetadata.symbol})` : ""
    }`;

    return contractOGImageTemplate({
      chainName: info.chainMetadata.name,
      contractAddress: info.serverContract.address,
      displayName: contractDisplayName,
      logo: contractMetadata.image,
    });
  } catch {
    return contractOGImageTemplate({
      chainName: params.chain_id,
      contractAddress: params.contractAddress,
    });
  }
}

function shortenString(str: string) {
  return `${str.substring(0, 7)}...${str.substring(str.length - 5)}`;
}

const OgBrandIcon: React.FC = () => {
  const gradientId = useId();
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: not needed
    <svg
      fill="none"
      height="21"
      viewBox="0 0 147 21"
      width="147"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M67.4653 0C66.2016 0 65.1654 1.03968 65.1654 2.36528C65.1654 3.66488 66.2016 4.70456 67.4653 4.70456C68.7289 4.70456 69.7651 3.66488 69.7651 2.36528C69.7651 1.03968 68.7289 0 67.4653 0ZM69.4869 5.9002H65.4685V19.9099H69.4869V5.9002ZM42.015 0.519887H45.9323V5.90025H48.9398V9.6431H45.9323V14.5816C45.9323 15.3094 46.4883 15.8812 47.1707 15.8812H48.9146V19.858H47.1707C44.3401 19.858 42.015 17.4927 42.015 14.5556V9.61711H40.1953V5.87425H42.015V0.519887ZM58.5187 5.58834C56.6991 5.58834 55.2585 6.3681 54.7025 7.58973V0.519887H50.6841V19.884H54.7025V12.0344C54.7025 10.3969 55.7387 9.25322 57.2045 9.25322C58.6957 9.25322 59.5297 10.2409 59.5297 11.9044V19.91H63.5481V11.3846C63.5481 7.74568 61.7284 5.58834 58.5187 5.58834ZM75.2238 5.87422V7.79763C75.8304 6.39406 77.2962 5.58831 79.1411 5.56232C79.4191 5.56232 79.773 5.58831 80.2026 5.64029V9.5391C79.7982 9.46113 79.3433 9.40914 78.8631 9.40914C76.5633 9.40914 75.2238 10.7347 75.2238 13.048V19.8839H71.2054V5.87422H75.2238ZM91.4997 7.71969C91.0953 6.49806 89.5031 5.64033 87.456 5.64033C85.5352 5.64033 83.9177 6.34211 82.6288 7.74568C81.3651 9.12326 80.708 10.8647 80.708 12.8921C80.708 14.9195 81.3651 16.635 82.6288 18.0645C83.9177 19.4421 85.5352 20.1439 87.456 20.1439C89.5031 20.1439 91.0953 19.2862 91.4997 18.0645V19.91H95.5181V0.519887H91.4997V7.71969ZM90.6909 15.3874C90.0086 16.0631 89.1745 16.3751 88.1889 16.3751C87.2285 16.3751 86.3945 16.0372 85.7374 15.3874C85.055 14.6856 84.7265 13.8538 84.7265 12.8921C84.7265 11.9304 85.055 11.0987 85.7374 10.4229C86.4198 9.72108 87.2285 9.38318 88.1889 9.38318C89.1998 9.38318 90.0338 9.72108 90.6909 10.4229C91.3986 11.0987 91.7524 11.9304 91.7524 12.8921C91.7524 13.8538 91.3986 14.6856 90.6909 15.3874ZM107.119 5.95218L110.758 12.6061L113.21 5.9002H117.152L111.542 20.7157L107.119 12.6581L102.696 20.7157L97.1105 5.9002H101.053L103.479 12.6061L107.119 5.95218ZM123.773 5.56232C121.701 5.56232 119.957 6.23811 118.592 7.5897C117.253 8.91529 116.57 10.6828 116.57 12.8661V12.996C116.57 15.1794 117.253 16.9468 118.592 18.2724C119.982 19.572 121.751 20.2478 123.975 20.2478C126.048 20.2478 127.741 19.832 129.03 18.9742V15.3613C127.766 16.271 126.149 16.7129 124.203 16.7129C122.08 16.7129 120.69 15.6472 120.614 13.9837H130.597C130.647 13.5679 130.673 13.1 130.673 12.6322C130.673 10.6308 130.016 8.96728 128.752 7.61569C127.488 6.23811 125.795 5.56232 123.773 5.56232ZM120.614 11.3066C120.639 10.6568 120.968 10.1109 121.574 9.66906C122.206 9.2272 122.914 8.99327 123.773 8.99327C125.365 8.99327 126.604 10.0589 126.604 11.3066H120.614ZM140.252 5.64032C142.173 5.64032 143.79 6.34211 145.054 7.74568C146.343 9.14925 147 10.8387 147 12.8661C147 14.8935 146.343 16.609 145.054 18.0385C143.79 19.4161 142.173 20.1179 140.252 20.1179C138.205 20.1179 136.613 19.2602 136.208 18.0385V19.884H132.19V0.519887H136.208V7.71969C136.613 6.49806 138.205 5.64032 140.252 5.64032ZM139.519 16.375C140.48 16.375 141.288 16.0631 141.971 15.3873C142.653 14.6856 142.982 13.8538 142.982 12.8921C142.982 11.9304 142.653 11.0987 141.971 10.4229C141.314 9.72108 140.48 9.38318 139.519 9.38318C138.534 9.38318 137.7 9.72108 136.992 10.4229C136.31 11.0987 135.956 11.9304 135.956 12.8921C135.956 13.8538 136.31 14.6856 136.992 15.3873C137.674 16.0371 138.508 16.375 139.519 16.375Z"
        fill="#F1F1F1"
        fill-rule="evenodd"
      />
      <path
        clip-rule="evenodd"
        d="M0.0899952 1.76662C-0.238847 0.917876 0.373972 0 1.27068 0H6.83785C7.36094 0 7.8242 0.318498 8.01854 0.811118L12.4499 12.1256C12.5694 12.4292 12.5694 12.7705 12.4499 13.0811L9.66249 20.1869C9.23657 21.271 7.72713 21.271 7.30112 20.1869L0.0899952 1.76662ZM10.8434 1.72899C10.5445 0.887252 11.1573 0 12.0391 0H16.8888C17.4269 0 17.9052 0.34124 18.0845 0.849609L22.1123 12.1632C22.2094 12.4441 22.2094 12.7547 22.1123 13.0435L19.6911 19.8457C19.2876 20.9831 17.7034 20.9831 17.2999 19.8457L10.8434 1.72899ZM21.7312 0C20.8345 0 20.2217 0.917876 20.5505 1.76662L27.7617 20.1869C28.1876 21.271 29.6971 21.271 30.123 20.1869L32.9103 13.0811C33.0299 12.7705 33.0299 12.4292 32.9103 12.1256L28.4791 0.811118C28.2847 0.318498 27.8215 0 27.2984 0H21.7312Z"
        fill={`url(#${gradientId})`}
        fill-rule="evenodd"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="16.5224"
          x2="40.0128"
          y1="-4.95833"
          y2="25.9245"
        >
          <stop stop-color="#F213A4" />
          <stop offset="1" stop-color="#5204BF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

function textShortener(text: string) {
  const MAX_LENGTH = 50;
  const words = [];
  let currentLength = 0;
  let shortened = false;

  const allWords = text.split(" ");

  // no shorting for one word
  if (allWords.length === 1) {
    return text;
  }

  for (const word of allWords) {
    // +1 for the space
    if (currentLength + word.length + 1 > MAX_LENGTH) {
      shortened = true;
      break;
    }
    words.push(word);
    currentLength += word.length + 1;
  }

  if (words[words.length - 1]?.endsWith(".")) {
    return words.join(" ");
  }
  if (!shortened) {
    return words.join(" ");
  }
  return `${words.join(" ")} ...`;
}

const IPFS_GATEWAY = API_ROUTES_CLIENT_ID
  ? `https://${API_ROUTES_CLIENT_ID}.${isProd ? "ipfscdn.io/ipfs/" : "thirdwebstorage-dev.com/ipfs/"}`
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

async function contractOGImageTemplate(params: {
  logo?: string;
  displayName?: string;
  contractAddress: string;
  chainName: string;
}) {
  const inter400_ = fetch(
    new URL("og-lib/fonts/inter/400.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const inter500_ = fetch(
    new URL("og-lib/fonts/inter/500.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const inter700_ = fetch(
    new URL("og-lib/fonts/inter/700.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const [inter400, inter500, inter700] = await Promise.all([
    inter400_,
    inter500_,
    inter700_,
  ]);

  const title =
    (params.displayName ? textShortener(params.displayName) : "") ||
    shortenString(params.contractAddress);

  return new ImageResponse(
    <div
      style={{
        background: "#000",
        fontFamily: "Inter",
      }}
      tw="w-full h-full flex justify-center py-8 px-8 "
    >
      {/* the actual component starts here */}

      <div tw="flex flex-col my-auto w-full">
        {/* if we have a logo render it */}
        {params.logo && (
          <img
            alt=""
            src={replaceAnyIpfsUrlWithGateway(params.logo)}
            tw="w-50 h-50 rounded-lg mb-8 flex mx-auto"
          />
        )}

        {params.displayName && params.displayName !== params.contractAddress ? (
          <h3
            style={{
              color: "#626262",
            }}
            tw="text-2xl font-bold flex text-center my-0 mb-4 mx-auto"
          >
            {shortenString(params.contractAddress)}
          </h3>
        ) : null}

        {title && (
          <h1 tw="text-6xl text-white font-bold flex text-center my-0 mx-auto">
            {title}
          </h1>
        )}

        <h2 tw="text-4xl text-white opacity-80 font-medium flex text-center my-0 mt-10 mx-auto">
          {params.chainName}
        </h2>
      </div>

      <div tw="flex flex-shrink-0 absolute bottom-8 right-8">
        <OgBrandIcon />
      </div>
    </div>,
    {
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
      ],
      height: 630,
      width: 1200,
    },
  );
}
