import { createTargetNetworkId } from "$lib/runes/global.svelte";
import type { Address, Abi } from "abitype";
import { createConfig } from "./config.svelte";
import { readContract } from "@wagmi/core";
import { type ReadContractReturnType } from "@wagmi/core";

const createReadContract = ({
  address,
  abi,
  functionName,
  args = []
}: {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: unknown[];
}) => {
  const config = $derived.by(createConfig());

  let data: ReadContractReturnType = $state();
  (async () => {
    try {
      data = await readContract(config, { address, abi, functionName, args });
    } catch (e: unknown) {
      console.error("readContract ~ error", e);
    }
  })();

  $inspect("createReadContract", { address, abi, functionName, args });
  return {
    get data() {
      return data;
    }
  };
};

export { createReadContract };
