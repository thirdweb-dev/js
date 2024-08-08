export function InfraEngineIcon(props: { className?: string }) {
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
				d="M14.9523 11.9988C14.9523 11.9981 14.9518 11.9975 14.951 11.9975C14.9089 11.9992 14.8665 12 14.8239 12C13.0588 12 11.6278 10.5691 11.6278 8.8039C11.6278 7.03873 13.0588 5.60779 14.8239 5.60779C15.9762 5.60779 16.986 6.21756 17.5484 7.13202C17.695 7.37046 17.9908 7.48805 18.2658 7.43583C18.4057 7.40926 18.5501 7.39536 18.6978 7.39536C19.9694 7.39536 21.0001 8.42614 21.0001 9.69767C21.0001 10.9692 19.9694 12 18.6979 12C18.6979 12 18.6979 12 18.6979 12C18.6979 12 18.6979 12 18.6978 12H14.9536C14.9529 12 14.9523 11.9994 14.9523 11.9988Z"
				fill="url(#paint0_linear_195_3943)"
			/>
			<g filter="url(#filter0_bi_195_3943)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M6.18764 18.9251C6.17601 18.9253 6.16437 18.9253 6.15271 18.9253C4.41138 18.9253 2.99976 17.5137 2.99976 15.7724C2.99976 14.031 4.41138 12.6194 6.15271 12.6194C6.18301 12.6194 6.20685 12.5932 6.20379 12.563C6.18785 12.4057 6.1797 12.2463 6.1797 12.085C6.1797 9.37046 8.48997 7.16992 11.3398 7.16992C13.8545 7.16992 15.949 8.88324 16.407 11.1512C16.4682 11.4541 16.7615 11.6671 17.0697 11.6434C17.1634 11.6361 17.2581 11.6325 17.3536 11.6325C19.3675 11.6325 21 13.265 21 15.2789C21 17.2928 19.3675 18.9253 17.3536 18.9253C17.285 18.9253 17.2169 18.9234 17.1493 18.9197C17.1063 18.9234 17.0628 18.9253 17.0188 18.9253H6.20985C6.20243 18.9253 6.19503 18.9252 6.18764 18.9251Z"
					fill="#BFB5FF"
					fillOpacity="0.8"
				/>
			</g>
			<defs>
				<filter
					id="filter0_bi_195_3943"
					x="0.999756"
					y="5.16992"
					width="22.0003"
					height="15.7554"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
					<feComposite
						in2="SourceAlpha"
						operator="in"
						result="effect1_backgroundBlur_195_3943"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_backgroundBlur_195_3943"
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
						result="effect2_innerShadow_195_3943"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_195_3943"
					x1="13.1976"
					y1="10.8463"
					x2="28.7967"
					y2="2.94276"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#3F2DAF" />
					<stop offset="1" stopColor="#917FFB" />
				</linearGradient>
			</defs>
		</svg>
	);
}
