export function InfraRPCIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<rect
				x="12.0015"
				y="12.5007"
				width="8.99854"
				height="8.99854"
				rx="1.5"
				fill="url(#paint0_linear_195_3994)"
			/>
			<g filter="url(#filter0_i_195_3994)">
				<path
					d="M5 18C3.89543 18 3 17.1046 3 16L3 5C3 3.89543 3.89543 3 5 3L16 3C17.1046 3 18 3.89543 18 5L18 16C18 17.1046 17.1046 18 16 18L5 18Z"
					fill="#BFB5FF"
					fillOpacity="0.8"
				/>
			</g>
			<path
				d="M6.10608 9.20007C7.27946 8.04993 8.85702 7.4057 10.5001 7.4057C12.1431 7.4057 13.7207 8.04993 14.8941 9.20007"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.30289 11.3971C8.88958 10.822 9.67836 10.4999 10.4999 10.4999C11.3214 10.4999 12.1102 10.822 12.6969 11.3971"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.5 13.5941H10.5058"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<defs>
				<filter
					id="filter0_i_195_3994"
					x="3"
					y="3"
					width="15"
					height="15.2764"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="0.276368" />
					<feGaussianBlur stdDeviation="0.138184" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect1_innerShadow_195_3994"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_3994"
					x1="13.5087"
					y1="19.8752"
					x2="30.3227"
					y2="14.0648"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#3F2DAF" />
					<stop offset="1" stopColor="#917FFB" />
				</linearGradient>
			</defs>
		</svg>
	);
}
