export function ContractPublishIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<path
				d="M5.64838 4.5C5.64838 3.67157 6.31995 3 7.14838 3H16.8411C18.0294 3 18.7459 4.31597 18.101 5.31406L8.40826 20.315C7.59677 21.571 5.64838 20.9963 5.64838 19.501V4.5Z"
				fill="url(#paint0_linear_195_3964)"
			/>
			<g filter="url(#filter0_bi_195_3964)">
				<path
					d="M18.3516 4.5C18.3516 3.67157 17.6801 3 16.8516 3H7.15889C5.97057 3 5.2541 4.31597 5.899 5.31406L15.5917 20.315C16.4032 21.571 18.3516 20.9963 18.3516 19.501V4.5Z"
					fill="#EBA4D2"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_3964"
					x="3.65643"
					y="1"
					width="16.6952"
					height="22.0037"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_3964"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_3964"
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
						result="effect2_innerShadow_195_3964"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_3964"
					x1="0.758951"
					y1="18.2415"
					x2="21.4914"
					y2="5.84722"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#F4009F" />
					<stop offset="1" stopColor="#F856C8" />
				</linearGradient>
			</defs>
		</svg>
	);
}
