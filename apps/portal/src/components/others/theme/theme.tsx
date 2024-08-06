export function SetStoredTheme() {
	function scriptCode() {
		try {
			const storedTheme = localStorage.getItem("website-theme");
			if (storedTheme === "dark" || storedTheme === "light") {
				document.body.dataset.theme = storedTheme;
			}
		} catch {
			// ignore
		}
	}

	return (
		<script
			suppressHydrationWarning
			dangerouslySetInnerHTML={{
				__html: `(() => { ${scriptCode.toString()}; ${scriptCode.name}(); })()`,
			}}
		/>
	);
}
