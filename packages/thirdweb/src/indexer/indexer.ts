export async function getIndexerClient(params, body) {
  // TODO: store the url in a config file and change it based on the environment
  const url = `http://${chainId}.indexer.thirdweb-dev.com`;

  const indexerClient = (async () => {
    try {
      // TODO: add paging support
      const response = await fetch(`${url}/${params}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      return await response.json();
    } catch (error) {
      // TODO add structured error handling
      return { error: `${(error as Error)?.message}` };
    }
  })();

  return indexerClient;
}
