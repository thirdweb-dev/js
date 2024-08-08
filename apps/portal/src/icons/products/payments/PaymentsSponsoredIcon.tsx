export function PaymentsSponsoredIcon(props: { className?: string }) {
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.78053 7.27741C7.24996 7.74684 7.88665 8.01057 8.55054 8.01057H11.0166H13.0562H15.5223C16.1862 8.01057 16.8229 7.74684 17.2923 7.27741C17.7618 6.80797 18.0255 6.17128 18.0255 5.5074C18.0255 4.84351 17.7618 4.20682 17.2923 3.73738C16.8229 3.26795 16.1862 3.00422 15.5223 3.00422C14.5564 2.98739 13.6099 3.45605 12.8062 4.34909C12.7047 4.46187 12.606 4.58075 12.5104 4.70541C12.2781 5.00833 11.7947 5.00833 11.5624 4.70541C11.4668 4.58075 11.3682 4.46187 11.2667 4.34909C10.463 3.45605 9.51645 2.98739 8.55054 3.00422C7.88665 3.00422 7.24996 3.26795 6.78053 3.73738C6.31109 4.20682 6.04736 4.84351 6.04736 5.5074C6.04736 6.17128 6.31109 6.80797 6.78053 7.27741Z"
				fill="#03B39E"
			/>
			<g filter="url(#filter0_bi_195_4098)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.03151 6.9884C4.2618 6.9884 3.63782 7.61238 3.63782 8.3821V10.2403C3.63782 11.0101 4.2618 11.634 5.03151 11.634H5.46727V18.6025C5.46727 19.3722 6.09125 19.9962 6.86096 19.9962H17.1395C17.9092 19.9962 18.5332 19.3722 18.5332 18.6025V11.634H18.9685C19.7382 11.634 20.3621 11.0101 20.3621 10.2403V8.3821C20.3621 7.61238 19.7382 6.9884 18.9685 6.9884H5.03151Z"
					fill="#A7FFF5"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_4098"
					x="1.63782"
					y="4.9884"
					width="20.7243"
					height="17.0078"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_4098"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_4098"
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
						result="effect2_innerShadow_195_4098"
					/>
				</filter>
			</defs>
		</svg>
	);
}
