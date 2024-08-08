export function ContractInteractIcon(props: { className?: string }) {
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
				d="M3.66284 8.02624V4.9941C3.66284 3.30429 5.62864 2.37603 6.93354 3.44965L19.6081 13.8777C20.0698 14.2576 20.3374 14.8242 20.3374 15.4221V18.8923C20.3374 20.6011 18.3329 21.5229 17.0356 20.4107L4.36111 9.54463C3.91791 9.16466 3.66284 8.61002 3.66284 8.02624Z"
				fill="url(#paint0_linear_195_4132)"
			/>
			<g filter="url(#filter0_bi_195_4132)">
				<path
					d="M20.3372 8.02624V4.9941C20.3372 3.30429 18.3714 2.37603 17.0665 3.44965L4.39195 13.8777C3.93019 14.2576 3.66265 14.8242 3.66265 15.4221V18.8923C3.66265 20.6011 5.66708 21.5229 6.96439 20.4107L19.6389 9.54463C20.0821 9.16466 20.3372 8.61002 20.3372 8.02624Z"
					fill="#EBA4D2"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_4132"
					x="1.66265"
					y="0.990295"
					width="20.6745"
					height="21.9059"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_4132"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_4132"
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
						result="effect2_innerShadow_195_4132"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_4132"
					x1="-2.75917"
					y1="19.7919"
					x2="23.7308"
					y2="3.1356"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#F4009F" />
					<stop offset="1" stopColor="#F856C8" />
				</linearGradient>
			</defs>
		</svg>
	);
}
