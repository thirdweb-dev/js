export function PaymentsNFTCheckoutIcon(props: { className?: string }) {
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
				d="M15.1499 8.84222L15.1499 6.68768C15.1499 4.94804 13.7396 3.53778 12 3.53778V3.53778C10.2604 3.53778 8.8501 4.94804 8.8501 6.68768L8.8501 8.84222"
				stroke="#03B29E"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<g filter="url(#filter0_bi_195_4013)">
				<path
					d="M4.91762 8.86385C4.98802 8.09138 5.63575 7.5 6.41143 7.5H17.5609C18.3356 7.5 18.9829 8.09 19.0545 8.86143L19.9822 18.8614C20.0638 19.7408 19.3718 20.5 18.4887 20.5H5.5C4.61782 20.5 3.92612 19.7424 4.00619 18.8638L4.91762 8.86385Z"
					fill="#A7FFF5"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_4013"
					x="1.99988"
					y="5.5"
					width="19.9889"
					height="17"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_4013"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_4013"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="0.2" />
					<feGaussianBlur stdDeviation="0.1" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect2_innerShadow_195_4013"
					/>
				</filter>
			</defs>
		</svg>
	);
}
