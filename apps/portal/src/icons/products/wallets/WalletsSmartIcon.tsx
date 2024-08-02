export function WalletsSmartIcon(props: { className?: string }) {
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
				x="11.6693"
				y="16.9566"
				width="13.4583"
				height="9.33069"
				rx="1.49536"
				transform="rotate(-90 11.6693 16.9566)"
				fill="url(#paint0_linear_195_3925)"
			/>
			<g filter="url(#filter0_bi_195_3925)">
				<path
					d="M8.18321 21.2503C8.7189 21.581 9.37914 21.581 9.91484 21.2503C11.5871 20.2182 15.098 17.6396 15.098 14.1832V10.2763C15.098 9.44263 14.5809 8.69639 13.8003 8.40366L9.75127 6.88528C9.2985 6.71549 8.79955 6.71549 8.34678 6.88528L4.29775 8.40366C3.51715 8.69639 3 9.44263 3 10.2763V14.1832C3 17.6396 6.51095 20.2182 8.18321 21.2503Z"
					fill="#B9DDFF"
					fillOpacity="0.8"
				/>
			</g>
			<path
				d="M9.04903 14.4024C9.98975 14.4024 10.7524 13.6398 10.7524 12.6991C10.7524 11.7583 9.98975 10.9957 9.04903 10.9957C8.10831 10.9957 7.3457 11.7583 7.3457 12.6991C7.3457 13.6398 8.10831 14.4024 9.04903 14.4024Z"
				fill="white"
			/>
			<path
				d="M9.04906 13.6652C9.3792 13.6652 9.6472 13.9415 9.6472 14.2828V16.7528C9.6472 17.0937 9.37954 17.3704 9.04906 17.3704C8.71893 17.3704 8.45093 17.094 8.45093 16.7528V14.2828C8.45093 13.9419 8.71859 13.6652 9.04906 13.6652Z"
				fill="white"
			/>
			<defs>
				<filter
					id="filter0_bi_195_3925"
					x="1"
					y="4.75793"
					width="16.098"
					height="18.7404"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_3925"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_3925"
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
						result="effect2_innerShadow_195_3925"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_3925"
					x1="22.4602"
					y1="20.8654"
					x2="12.4019"
					y2="25.2643"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2567FF" />
					<stop offset="1" stopColor="#22A7FF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
