export function ContractExploreIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<g clipPath="url(#clip0_195_3911)">
				<path
					d="M10.9709 11.527C11.4283 10.7348 12.5718 10.7348 13.0292 11.527L17.4763 19.2296C17.9337 20.0218 17.3619 21.0121 16.4471 21.0121H7.55296C6.63816 21.0121 6.06641 20.0218 6.52381 19.2296L10.9709 11.527Z"
					fill="url(#paint0_linear_195_3911)"
				/>
				<g filter="url(#filter0_bi_195_3911)">
					<circle
						cx="12.0001"
						cy="10.25"
						r="7.25"
						fill="#EBA4D2"
						fillOpacity="0.8"
					/>
				</g>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_3911"
					x="2.75006"
					y="1"
					width="18.5"
					height="18.5"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_3911"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_3911"
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
						result="effect2_innerShadow_195_3911"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_3911"
					x1="-1.29787"
					y1="22.463"
					x2="18.0785"
					y2="6.03583"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#F4009F" />
					<stop offset="1" stopColor="#F856C8" />
				</linearGradient>
				<clipPath id="clip0_195_3911">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
