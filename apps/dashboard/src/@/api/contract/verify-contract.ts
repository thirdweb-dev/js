import type { ThirdwebContract } from "thirdweb";

export async function verifyContract(contract: ThirdwebContract) {
  try {
    const response = await fetch(
      "https://contract.thirdweb.com/verify/contract",
      {
        body: JSON.stringify({
          chainId: contract.chain.id,
          contractAddress: contract.address,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      console.error(`Error verifying contract: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error verifying contract: ${error}`);
  }
}
