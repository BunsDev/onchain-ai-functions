import { targetNetwork } from "$lib/wagmi/classes";
import scaffoldConfig from "$lib/scaffold.config";
import { fetchPriceFromUniswap } from "$lib/scaffold-eth/ts";

const enablePolling = false;

export const createNativeCurrencyPrice = () => {
  let nativeCurrencyPrice = $state(0);

  const getPrice = async () => {
    const price = await fetchPriceFromUniswap(targetNetwork.chain);
    nativeCurrencyPrice = price;
  };

  $effect(() => {
    getPrice();
  });

  $effect(() => {
    if (enablePolling) {
      setInterval(getPrice, scaffoldConfig.pollingInterval);
    }
  });

  return {
    get nativeCurrencyPrice() {
      return nativeCurrencyPrice;
    }
  };
};
