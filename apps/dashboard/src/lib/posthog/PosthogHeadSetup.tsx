const posthogHost = "https://a.thirdweb.com";

export function PosthogHeadSetup() {
  return (
    <>
      <link rel="preconnect" href={posthogHost} />
      <link rel="dns-prefetch" href={posthogHost} />
    </>
  );
}
