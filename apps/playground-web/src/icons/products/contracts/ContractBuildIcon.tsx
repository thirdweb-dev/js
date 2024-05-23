export function ContractBuildIcon(props: { className?: string }) {
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
				x="7"
				y="3"
				width="10"
				height="10"
				rx="1.5"
				fill="url(#paint0_linear_195_4064)"
			/>
			<g filter="url(#filter0_bi_195_4064)">
				<rect
					x="3"
					y="11"
					width="18"
					height="10"
					rx="1.5"
					fill="#EBA4D2"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_4064"
					x="1"
					y="9"
					width="22"
					height="14"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_4064"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_4064"
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
						result="effect2_innerShadow_195_4064"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_4064"
					x1="3.1486"
					y1="11.4658"
					x2="16.0459"
					y2="0.531421"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#F4009F" />
					<stop offset="1" stopColor="#F856C8" />
				</linearGradient>
			</defs>
		</svg>
	);
}
