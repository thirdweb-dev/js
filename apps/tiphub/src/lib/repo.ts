export async function doesRepoExist(slug: string) {
  // TODO: handle branches other than `main`
  // TODO: switch to proper github API for this
  return await fetch(`https://raw.githubusercontent.com/${slug}/main/README.md`)
    .then((res) => res.ok)
    .catch(() => false);
}

export async function getFundingData(slug: string) {
  try {
    // TODO: handle branches other than `main`
    // TODO: switch to proper github API for this
    const res = await fetch(
      `https://raw.githubusercontent.com/${slug}/main/FUNDING.json`,
    );
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as {
      drips?: {
        ethereum?: {
          ownedBy?: string;
        };
      };
    };
  } catch (e) {
    console.error("Error fetching funding data");
    return null;
  }
}
