import { ethers, type Wallet } from "ethers";
import { readChainLinkConfig } from "@onchain-ai/common";
import { getWallet } from "./getWallet";

const setVersion = async (
  chainId: number,
  address: string,
  version: number,
  signer?: Wallet
): Promise<number> => {
  signer ||= await getWallet(chainId);

  const abi = ["function setDonHostedSecretsVersion(uint64) external"];
  const { explorer } = readChainLinkConfig(chainId);

  const onChainAI = new ethers.Contract(address, abi, signer);

  // update onchain `donHostedSecretsVersion`
  const tx = await onChainAI.setDonHostedSecretsVersion(version);
  console.log(`setDonHostedSecretsVersion ${explorer}/tx/${tx.hash}`);

  const res = await tx.wait();
  return res?.status || 0;
};

export { setVersion };
