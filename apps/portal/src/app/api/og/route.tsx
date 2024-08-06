/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getBaseUrl } from "../../../lib/getBaseUrl";

export const runtime = "edge";

const BAST_URL = getBaseUrl();

const width = 1200;
const height = 630;

const iconSize = 300;

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

	const iconUrl = `${BAST_URL}/og/icons/${icon}.svg`;

	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					background: "black",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
				}}
			>
				<img
					src={`${BAST_URL}/og/background-1.png`}
					alt=""
					width={width}
					height={height}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
					}}
				/>

				{/* Left */}
				<div
					style={{
						color: "white",
						width: "50%",
						padding: "80px 60px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							display: "flex",
							gap: "10px",
							alignItems: "center",
							marginBottom: "40px",
						}}
					>
						<img
							src={`${BAST_URL}/icons/thirdweb-logo.svg`}
							alt=""
							width={300 / 1.7}
							height={50 / 1.7}
							style={{
								display: "flex",
							}}
						/>

						<div
							style={{
								fontSize: "26px",
								fontFamily: "Inter",
								fontWeight: 600,
								color: "white",
								marginTop: "2px",
							}}
						>
							Docs
						</div>
					</div>

					<div
						style={{
							fontSize: "60px",
							fontFamily: "Inter",
							fontWeight: 600,
							display: "flex",
							marginBottom: "40px",
							wordBreak: title.includes(" ") ? "break-word" : "break-all",
						}}
					>
						{title}
					</div>

					<div
						style={{
							display: "flex",
						}}
					>
						<div
							style={{
								background: "white",
								padding: "14px 20px",
								fontSize: "24px",
								color: "black",
								fontFamily: "Inter",
								fontWeight: 600,
								borderRadius: "10px",
							}}
						>
							Read More
						</div>
					</div>
				</div>

				<img
					src={iconUrl}
					alt=""
					width={iconSize}
					height={iconSize}
					style={{
						display: "flex",
						position: "absolute",
						right: width / 6.6,
						top: height / 2 - iconSize / 2 + 10,
					}}
				/>
			</div>
		),
		// ImageResponse options
		{
			width: width,
			height: height,
			fonts: [
				{
					name: "Inter",
					data: await inter600,
					style: "normal",
					weight: 600,
				},
			],
		},
	);
}
