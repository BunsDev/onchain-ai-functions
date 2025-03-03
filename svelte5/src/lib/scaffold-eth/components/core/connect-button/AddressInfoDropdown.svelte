<script lang="ts">
  import { anvil } from "viem/chains";
  import { getAddress, type Address } from "viem";
  import {
    Icon,
    ChevronDown,
    CheckCircle,
    DocumentDuplicate,
    QrCode,
    ArrowTopRightOnSquare,
    ArrowLeftOnRectangle,
    ArrowsRightLeft
  } from "svelte-hero-icons";
  import { goto } from "$app/navigation";
  import { getTargetNetworks } from "$lib/scaffold-eth/ts";
  import { createOutsideClick } from "$lib/scaffold-eth/runes";
  import { targetNetwork } from "$lib/wagmi/classes";
  import { BlockChain } from "$lib/wagmi/classes";
  import { Account } from "$lib/wagmi/classes";
  import { BlockieAvatar, NetworkOptions } from "$lib/scaffold-eth/components";
  import scaffoldConfig from "$lib/scaffold.config";
  import { isEns } from "$lib/wagmi/ts";

  const {
    address,
    ensAvatar,
    displayName,
    blockExplorerAddressLink
  }: {
    address: Address;
    blockExplorerAddressLink: string | undefined;
    displayName: string;
    ensAvatar?: string;
  } = $props();

  let isLocalNetwork = $derived(targetNetwork.id == anvil.id);

  const account = new Account();
  const switchEnabled = $derived(
    getTargetNetworks().length > 1 && !(account.connectorId === "burnerWallet" && scaffoldConfig.onlyLocalBurnerWallet)
  );

  let dropdown: HTMLElement | undefined = undefined;
  createOutsideClick(
    () => dropdown,
    () => {
      selectingNetwork = false;
      dropdown?.removeAttribute("open");
    }
  );

  const blockChain = new BlockChain();

  const checksumAddress = $derived(getAddress(address));

  let addressCopied = $state(false);
  let selectingNetwork = $state(false);

  const gotoExplorer = () => {
    if (isLocalNetwork) goto(blockExplorerAddressLink || "");
    else window.open(blockExplorerAddressLink || "", "_blank");
  };
</script>

<details id="address-info-dropdown" class="dropdown dropdown-end leading-3" bind:this={dropdown}>
  <summary tabIndex={0} class="dropdown-toggle btn btn-secondary btn-sm !h-auto gap-0 pl-0 pr-2 shadow-md">
    <BlockieAvatar address={checksumAddress} size={30} ensImage={ensAvatar} />
    <span class="ml-2 mr-1">
      {isEns(displayName) ? displayName : checksumAddress?.slice(0, 6) + "..." + checksumAddress?.slice(-4)}
    </span>
    <Icon src={ChevronDown} class="ml-2 h-6 w-4 sm:ml-0" />
  </summary>
  <ul
    tabIndex={0}
    class="menu dropdown-content z-[2] mt-2 gap-1 rounded-box bg-base-200 p-2 shadow-center shadow-accent"
  >
    <NetworkOptions hidden={!selectingNetwork} />
    <li class={selectingNetwork ? "hidden" : ""}>
      <button
        onclick={() => {
          if (addressCopied) return;

          navigator.clipboard.writeText(checksumAddress);

          addressCopied = true;
          setTimeout(() => {
            addressCopied = false;
          }, 800);
        }}
        class="btn-sm flex gap-3 !rounded-xl py-3"
      >
        {#if addressCopied}
          <Icon src={CheckCircle} class="ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0" aria-hidden="true" />
        {:else}
          <Icon
            src={DocumentDuplicate}
            class="ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0"
            aria-hidden="true"
          />
        {/if}
        <span class=" whitespace-nowrap">Copy address</span>
      </button>
    </li>
    <li class={selectingNetwork ? "hidden" : ""}>
      <label for="qrcode-modal" class="btn-sm flex gap-3 !rounded-xl py-3">
        <Icon src={QrCode} class="ml-2 h-6 w-4 sm:ml-0" />
        <span class="whitespace-nowrap">View QR Code</span>
      </label>
    </li>
    <li class={selectingNetwork ? "hidden" : ""}>
      <button onclick={gotoExplorer} class="menu-item btn-sm flex gap-3 whitespace-nowrap !rounded-xl py-3">
        <Icon src={ArrowTopRightOnSquare} class="ml-2 h-6 w-4 sm:ml-0" />
        View on Block Explorer
      </button>
    </li>
    {#if switchEnabled}
      <li class={selectingNetwork ? "hidden" : ""}>
        <button
          id="switch-network"
          class="btn-sm flex gap-3 !rounded-xl py-3"
          type="button"
          onclick={() => {
            selectingNetwork = true;
          }}
        >
          <Icon src={ArrowsRightLeft} class="ml-2 h-6 w-4 sm:ml-0" />
          <span>Switch Network</span>
        </button>
      </li>
    {/if}
    <li class={selectingNetwork ? "hidden" : ""}>
      <button
        id="disconnect-wallet"
        class="menu-item btn-sm flex gap-3 !rounded-xl py-3 text-error"
        type="button"
        onclick={() => blockChain?.disconnect()}
      >
        <Icon src={ArrowLeftOnRectangle} class="ml-2 h-6 w-4 sm:ml-0" /> <span>Disconnect</span>
      </button>
    </li>
  </ul>
</details>
