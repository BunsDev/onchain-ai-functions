<script lang="ts">
  import { targetNetwork } from "$lib/wagmi/classes";
  import BuidlGuidlLogo from "./assets/BuidlGuidlLogo.svelte";
  import { CurrencyDollar, Heart, Icon, MagnifyingGlass } from "svelte-hero-icons";
  import Faucet from "./core/Faucet.svelte";
  import SwitchTheme from "./SwitchTheme.svelte";
  import { anvil } from "viem/chains";

  let isLocalNetwork = $derived(targetNetwork.id == anvil.id);
</script>

<div class="mb-11 min-h-0 px-1 py-5 lg:mb-0">
  <div>
    <div class="pointer-events-none fixed bottom-0 left-0 z-10 flex w-full items-center justify-between p-4">
      <div class="pointer-events-auto flex flex-col gap-2 md:flex-row">
        {#if targetNetwork.nativeCurrencyPrice > 0}
          <div>
            <div class="btn btn-primary btn-sm cursor-auto gap-1 font-normal">
              <Icon src={CurrencyDollar} class="h-4 w-4" />
              <span>{targetNetwork.nativeCurrencyPrice}</span>
            </div>
          </div>
        {/if}
        {#if isLocalNetwork}
          <Faucet />
          <a href="/blockexplorer" class="btn btn-primary btn-sm gap-1 font-normal">
            <Icon src={MagnifyingGlass} class="h-4 w-4" />
            <span>Block Explorer</span>
          </a>
        {/if}
      </div>
      <SwitchTheme class="pointer-events-auto {isLocalNetwork && 'self-end md:self-auto'}" />
    </div>
  </div>
  <div class="w-full">
    <ul class="menu menu-horizontal w-full">
      <div class="flex w-full items-center justify-center gap-2 text-sm">
        <div class="text-center">
          <a href="https://github.com/kredeum/onchain-ai" target="_blank" rel="noreferrer" class="link"> Fork me </a>
        </div>
        <span>·</span>
        <div class="flex items-center justify-center gap-2">
          <p class="m-0 text-center">
            Built with <Icon src={Heart} class="inline-block h-4 w-4" /> at
          </p>
          <a
            class="flex items-center justify-center gap-1"
            href="https://www.kredeum.com/"
            target="_blank"
            rel="noreferrer"
          >
            <BuidlGuidlLogo class="h-5 w-3 pb-1" />
            <span class="link">Kredeum Labs</span>
          </a>
        </div>
        <span>·</span>
        <div class="text-center">
          <a href="https://discord.gg/Vz5AyU2Nfx" target="_blank" rel="noreferrer" class="link"> Support </a>
        </div>
      </div>
    </ul>
  </div>
</div>
