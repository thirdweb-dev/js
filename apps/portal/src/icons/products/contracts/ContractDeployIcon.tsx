export function ContractDeployIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<g filter="url(#filter0_i_195_4030)">
				<path
					d="M4.96973 4.5C4.96973 3.67157 5.6413 3 6.46973 3H17.0755C17.9039 3 18.5755 3.67157 18.5755 4.5V19.5C18.5755 20.3284 17.9039 21 17.0755 21H6.46973C5.6413 21 4.96973 20.3284 4.96973 19.5V4.5Z"
					fill="#EBA4D2"
					fillOpacity="0.8"
				/>
			</g>
			<path
				d="M21.5778 13.6275C22.2445 14.0124 22.2445 14.9747 21.5778 15.3596L15.6488 18.7827C14.9822 19.1676 14.1488 18.6865 14.1488 17.9167L14.1488 11.0705C14.1488 10.3007 14.9822 9.81952 15.6488 10.2044L21.5778 13.6275Z"
				fill="url(#paint0_linear_195_4030)"
			/>
			<path
				d="M8.77258 7L14.7726 7.0001"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M8.77258 10L11.7726 10.0001"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<defs>
				<filter
					id="filter0_i_195_4030"
					x="4.96973"
					y="3"
					width="13.6058"
					height="18.1"
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
						result="effect1_innerShadow_195_4030"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_4030"
					x1="12.9991"
					y1="3.95568"
					x2="26.0167"
					y2="19.3104"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#F4009F" />
					<stop offset="1" stopColor="#F856C8" />
				</linearGradient>
			</defs>
		</svg>
	);
}
