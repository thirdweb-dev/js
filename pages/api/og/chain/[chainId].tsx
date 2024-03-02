/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/forbid-dom-props */
import { ImageResponse } from "@vercel/og";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextRequest } from "next/server";
import { fetchChain } from "utils/fetchChain";

// Make sure the font exists in the specified path:
export const config = {
  runtime: "edge",
};

const bgWithIcon = fetch(
  new URL("og-lib/assets/chain/bg-with-icon.png", import.meta.url),
).then((res) => res.arrayBuffer());

const bgNoIcon = fetch(
  new URL("og-lib/assets/chain/bg-no-icon.png", import.meta.url),
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

const TWLogo: React.FC = () => (
  <svg
    width="255"
    height="37"
    viewBox="0 0 255 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_4_1228)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.162424 3.11312C-0.434663 1.61668 0.67809 0 2.30651 0H12.4163C13.3662 0 14.2075 0.561163 14.5604 1.42963L22.6075 21.3643C22.8246 21.8987 22.8246 22.5 22.6075 23.0478L17.5458 35.567C16.7723 37.4777 14.0311 37.4777 13.2576 35.567L0.162424 3.11312ZM19.6905 3.04631C19.1477 1.56324 20.2604 0 21.8617 0H30.6687C31.6458 0 32.5143 0.601246 32.84 1.49643L40.1543 21.4311C40.3307 21.9254 40.3307 22.4732 40.1543 22.981L35.7575 34.9658C35.0248 36.9699 32.1479 36.9699 31.4151 34.9658L19.6905 3.04631ZM39.4623 0C37.8339 0 36.7211 1.61668 37.3182 3.11312L50.4134 35.567C51.1869 37.4777 53.9281 37.4777 54.7015 35.567L59.7632 23.0478C59.9803 22.5 59.9803 21.8987 59.7632 21.3643L51.7161 1.42963C51.3633 0.561163 50.5219 0 49.572 0H39.4623Z"
        fill="url(#paint0_linear_4_1228)"
      />
    </g>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M119.093 0.839844C116.933 0.839844 115.163 2.59497 115.163 4.83275C115.163 7.02665 116.933 8.78177 119.093 8.78177C121.252 8.78177 123.023 7.02665 123.023 4.83275C123.023 2.59497 121.252 0.839844 119.093 0.839844ZM122.548 10.8001H115.681V34.4504H122.548V10.8001ZM75.6036 1.71743H82.2975V10.8002H87.4367V17.1186H82.2975V25.4555C82.2975 26.684 83.2476 27.6494 84.4136 27.6494H87.3935V34.3627H84.4136C79.5767 34.3627 75.6036 30.3698 75.6036 25.4116V17.0747H72.4941V10.7563H75.6036V1.71743ZM103.805 10.2736C100.695 10.2736 98.2338 11.59 97.2837 13.6523V1.71743H90.4171V34.4066H97.2837V21.1554C97.2837 18.3911 99.0543 16.4605 101.559 16.4605C104.107 16.4605 105.532 18.1278 105.532 20.936V34.4505H112.399V20.0585C112.399 13.9155 109.29 10.2736 103.805 10.2736ZM132.35 10.7563V14.0033C133.387 11.6339 135.891 10.2736 139.044 10.2298C139.519 10.2298 140.124 10.2736 140.858 10.3614V16.9431C140.167 16.8115 139.39 16.7237 138.569 16.7237C134.639 16.7237 132.35 18.9615 132.35 22.8666V34.4066H125.484V10.7563H132.35ZM160.162 13.8717C159.471 11.8094 156.751 10.3614 153.253 10.3614C149.97 10.3614 147.207 11.5461 145.004 13.9155C142.845 16.2411 141.722 19.1809 141.722 22.6034C141.722 26.0259 142.845 28.9218 145.004 31.3351C147.207 33.6607 149.97 34.8454 153.253 34.8454C156.751 34.8454 159.471 33.3974 160.162 31.3351V34.4505H167.029V1.71743H160.162V13.8717ZM158.78 26.8157C157.614 27.9565 156.189 28.483 154.505 28.483C152.864 28.483 151.439 27.9126 150.316 26.8157C149.15 25.631 148.588 24.2269 148.588 22.6034C148.588 20.9799 149.15 19.5758 150.316 18.435C151.482 17.2503 152.864 16.6798 154.505 16.6798C156.232 16.6798 157.658 17.2503 158.78 18.435C159.99 19.5758 160.594 20.9799 160.594 22.6034C160.594 24.2269 159.99 25.631 158.78 26.8157ZM186.852 10.8879L193.07 22.1207L197.259 10.8001H203.997L194.409 35.8106L186.852 22.2084L179.294 35.8106L169.75 10.8001H176.487L180.633 22.1207L186.852 10.8879ZM215.311 10.2298C211.769 10.2298 208.79 11.3706 206.457 13.6523C204.169 15.89 203.003 18.8737 203.003 22.5595V22.7789C203.003 26.4646 204.169 29.4483 206.457 31.6861C208.833 33.88 211.856 35.0209 215.656 35.0209C219.197 35.0209 222.091 34.3188 224.293 32.8708V26.7718C222.134 28.3075 219.37 29.0534 216.045 29.0534C212.417 29.0534 210.042 27.2544 209.912 24.4463H226.971C227.057 23.7442 227.101 22.9544 227.101 22.1646C227.101 18.786 225.978 15.9778 223.818 13.6961C221.659 11.3706 218.766 10.2298 215.311 10.2298ZM209.912 19.9268C209.956 18.8299 210.517 17.9084 211.553 17.1625C212.633 16.4166 213.842 16.0217 215.311 16.0217C218.031 16.0217 220.148 17.8207 220.148 19.9268H209.912ZM243.469 10.3614C246.752 10.3614 249.516 11.5461 251.675 13.9155C253.877 16.2849 255 19.137 255 22.5595C255 25.982 253.877 28.8779 251.675 31.2912C249.516 33.6168 246.752 34.8015 243.469 34.8015C239.971 34.8015 237.251 33.3535 236.56 31.2912V34.4066H229.693V1.71743H236.56V13.8716C237.251 11.8094 239.971 10.3614 243.469 10.3614ZM242.217 28.483C243.858 28.483 245.24 27.9565 246.406 26.8157C247.572 25.631 248.134 24.2269 248.134 22.6034C248.134 20.9799 247.572 19.5758 246.406 18.435C245.283 17.2503 243.858 16.6798 242.217 16.6798C240.533 16.6798 239.108 17.2503 237.898 18.435C236.732 19.5758 236.128 20.9799 236.128 22.6034C236.128 24.2269 236.732 25.631 237.898 26.8157C239.064 27.9126 240.49 28.483 242.217 28.483Z"
      fill="#F1F1F1"
    />
    <defs>
      <linearGradient
        id="paint0_linear_4_1228"
        x1="30.0033"
        y1="-8.73611"
        x2="71.0412"
        y2="46.872"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F213A4" />
        <stop offset="1" stop-color="#5204BF" />
      </linearGradient>
      <clipPath id="clip0_4_1228">
        <rect width="59.9096" height="37" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
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

  const url = new URL(req.url);
  const chainId = url.pathname.split("/").at(-1);
  if (!chainId) {
    return new Response("ChainId not found", { status: 400 });
  }
  const chain = await fetchChain(chainId);
  if (!chain) {
    return new Response("Chain not found", { status: 400 });
  }

  const iconUrl = chain.icon?.url
    ? replaceAnyIpfsUrlWithGateway(chain.icon.url)
    : undefined;

  const optimizedIconUrl = iconUrl
    ? `${getAbsoluteUrl()}/_next/image?url=${encodeURIComponent(
        iconUrl,
      )}&w=256&q=75`
    : undefined;

  const [inter400, inter500, inter700, imageData] = await Promise.all([
    inter400_,
    inter500_,
    inter700_,
    iconUrl ? bgWithIcon : bgNoIcon,
  ]);

  return new ImageResponse(
    (
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

        {optimizedIconUrl && (
          <img
            alt=""
            src={optimizedIconUrl}
            tw="absolute rounded-full"
            style={{
              top: 240,
              right: -2,
              height: 150,
              width: 150,
            }}
          />
        )}

        <div tw="w-full h-full flex flex-col items-center">
          <div tw="flex flex-col my-auto">
            <h1 tw="text-6xl font-bold text-white text-center max-w-2xl mx-auto">
              {chain.name}
            </h1>
            <div tw="flex mx-auto mt-14">
              <TWLogo />
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
      ],
    },
  );
}
