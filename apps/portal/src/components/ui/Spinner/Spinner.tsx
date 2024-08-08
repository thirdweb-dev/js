import style from "./Spinner.module.css";

export function Spinner(props: { className?: string }) {
	return (
		<svg
			viewBox="0 0 50 50"
			className={style.loader + " " + (props.className || "")}
		>
			<circle
				cx="25"
				cy="25"
				r="20"
				fill="none"
				stroke="currentColor"
				strokeWidth="4"
			/>
		</svg>
	);
}
