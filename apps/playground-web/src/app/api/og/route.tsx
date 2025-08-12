/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getBaseUrl } from "@/lib/env";

export const runtime = "edge";

const BASE_URL = getBaseUrl();

const width = 1200;
const height = 630;

const iconSize = 400;

const inter600 = fetch(new URL("./inter/700.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const icon = searchParams.get("icon");
  const title = searchParams.get("title");

  if (!icon || !title) {
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }

  const iconUrl = `${BASE_URL}/og/icons/${icon}.svg`;

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        alignItems: "center",
        background: "black",
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <img
        alt=""
        height={height}
        src={`${BASE_URL}/og/background-1.jpg`}
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
        width={width}
      />

      {/* Left */}
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "80px 60px",
          width: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: "60px",
            fontWeight: 600,
            marginBottom: "40px",
            wordBreak: title.includes(" ") ? "break-word" : "break-all",
          }}
        >
          {title}
        </div>
      </div>

      <img
        alt=""
        height={iconSize}
        src={iconUrl}
        style={{
          display: "flex",
          position: "absolute",
          right: width / 20,
          top: height / 2 - iconSize / 1.5,
        }}
        width={iconSize}
      />
    </div>,
    // ImageResponse options
    {
      fonts: [
        {
          data: await inter600,
          name: "Inter",
          style: "normal",
          weight: 600,
        },
      ],
      height: height,
      width: width,
    },
  );
}
