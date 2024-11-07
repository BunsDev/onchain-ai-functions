import { setTargetNetwork, targetNetwork } from "./global.svelte";
import { createAccount } from "$lib/wagmi/runes";
import scaffoldConfig from "$lib/scaffold.config";
import { NETWORKS_EXTRA_DATA, type ChainWithAttributes } from "$lib/scaffold-eth/ts";

export const createTargetNetwork = (): (() => ChainWithAttributes) => {
  const { account } = $derived(createAccount());
  const { chain } = $derived(account);

  $effect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find((targetNetwork) => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  });

  return () => ({
    ...targetNetwork.targetNetwork,
    ...NETWORKS_EXTRA_DATA[targetNetwork.targetNetwork.id]
  });
};
