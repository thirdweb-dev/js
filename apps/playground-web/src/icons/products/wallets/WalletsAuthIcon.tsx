export function WalletsAuthIcon(props: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
		>
			<g clipPath="url(#clip0_195_4118)">
				<path
					d="M10.2679 4.7887C11.0377 3.45536 12.9622 3.45536 13.732 4.7887L20.7756 16.9886C21.5454 18.3219 20.5832 19.9886 19.0436 19.9886H4.95635C3.41675 19.9886 2.4545 18.3219 3.2243 16.9886L10.2679 4.7887Z"
					fill="url(#paint0_linear_195_4118)"
				/>
				<g filter="url(#filter0_i_195_4118)">
					<path
						d="M11.1341 13.3799C11.519 12.7132 12.4812 12.7132 12.8661 13.3799L15.811 18.4806C16.1959 19.1473 15.7148 19.9806 14.945 19.9806H9.05519C8.28539 19.9806 7.80426 19.1473 8.18916 18.4806L11.1341 13.3799Z"
						fill="#B9DDFF"
						fillOpacity="0.8"
					/>
				</g>
			</g>
			<defs>
				<filter
					id="filter0_i_195_4118"
					x="8.0537"
					y="12.8799"
					width="7.89278"
					height="7.20072"
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
						result="effect1_innerShadow_195_4118"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_4118"
					x1="3.35198"
					y1="20.82"
					x2="21.8618"
					y2="12.4792"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2567FF" />
					<stop offset="1" stopColor="#22A7FF" />
				</linearGradient>
				<clipPath id="clip0_195_4118">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
