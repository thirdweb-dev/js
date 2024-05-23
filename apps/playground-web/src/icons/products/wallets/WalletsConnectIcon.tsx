export function WalletsConnectIcon(props: { className?: string }) {
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
				x="3"
				y="17.9988"
				width="14.9988"
				height="10.6499"
				rx="2"
				transform="rotate(-90 3 17.9988)"
				fill="url(#paint0_linear_195_4047)"
			/>
			<g filter="url(#filter0_bi_195_4047)">
				<path
					d="M3 9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9Z"
					fill="#B9DDFF"
					fillOpacity="0.8"
				/>
			</g>
			<path
				d="M18.3004 12.6995V12.6995C17.5822 13.4177 17.5822 14.5822 18.3004 15.3004V15.3004"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<defs>
				<filter
					id="filter0_bi_195_4047"
					x="1"
					y="5"
					width="22"
					height="18"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_4047"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_4047"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="0.2" />
					<feGaussianBlur stdDeviation="0.05" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect2_innerShadow_195_4047"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_4047"
					x1="15.026"
					y1="22.4602"
					x2="3.73188"
					y2="27.2831"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2567FF" />
					<stop offset="1" stopColor="#22A7FF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
