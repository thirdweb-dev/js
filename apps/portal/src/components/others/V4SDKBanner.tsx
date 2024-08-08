import { Callout, DocLink, Paragraph } from "../Document";

export function V4SDKbanner() {
	return (
		<Callout title="Connect SDK v4" variant="info">
			<Paragraph>
				This document includes code references for Connect SDK v4. We will be
				updating this document to use
				<DocLink href="/typescript/v5"> Connect SDK v5</DocLink> soon.
			</Paragraph>
		</Callout>
	);
}
