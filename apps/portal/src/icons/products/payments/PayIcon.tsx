export function PayIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<circle cx="15.9849" cy="16" r="5" fill="url(#paint0_linear_585_2)" />
			<g filter="url(#filter0_bi_585_2)">
				<path
					d="M3 4.5C3 3.67157 3.67157 3 4.5 3H17.5C18.3284 3 19 3.67157 19 4.5V13.5C19 14.3284 18.3284 15 17.5 15H4.5C3.67157 15 3 14.3284 3 13.5V4.5Z"
					fill="#B9DDFF"
					fillOpacity="0.8"
				/>
			</g>
			<rect
				x="4.98955"
				y="9.44861"
				width="3.54886"
				height="3.54886"
				rx="1"
				fill="white"
			/>
			<path d="M3.00316 5.99185H19" stroke="white" />
			<defs>
				<filter
					id="filter0_bi_585_2"
					x="1"
					y="1"
					width="20"
					height="16"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_585_2"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_585_2"
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
						result="effect2_innerShadow_585_2"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_585_2"
					x1="19.003"
					y1="15.1892"
					x2="10.8494"
					y2="17.6614"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2567FF" />
					<stop offset="1" stopColor="#22A7FF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
