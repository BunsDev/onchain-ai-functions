<script lang="ts">
  import { Events } from "$lib/wagmi/components";
  import { targetNetwork } from "$lib/wagmi/classes";
  import { readDeploymentContractsName, type DeploymentContractName } from "$lib/wagmi/ts";

  const localStorageContractKey = "scaffoldEth2.contractSelected";

  const contractsName: DeploymentContractName[] = $derived(readDeploymentContractsName(targetNetwork.id));

  const getDefaultContractName = () => {
    const localStorageContractName = localStorage.getItem(localStorageContractKey) as DeploymentContractName;
    if (localStorageContractName && contractsName.includes(localStorageContractName)) return localStorageContractName;
    if (contractsName.length > 0) return contractsName[0];
  };

  let contractSelected = $state(getDefaultContractName());
  const setDefaultContractName = (contractName: DeploymentContractName) => {
    contractSelected = contractName;
    localStorage.setItem(localStorageContractKey, String(contractName));
  };
</script>

<div class="flex flex-col items-center justify-center gap-y-6 py-8 lg:gap-y-8 lg:py-12">
  <div class="flex w-full max-w-7xl flex-row flex-wrap gap-2 px-6 pb-1 lg:px-10">
    {#each contractsName as contractName}
      <button
        class="btn btn-secondary btn-sm font-light hover:border-transparent {contractName === contractSelected
          ? 'no-animation bg-base-300 hover:bg-base-300'
          : 'bg-base-100 hover:bg-secondary'}"
        onclick={() => setDefaultContractName(contractName)}
      >
        {contractName}
      </button>
    {:else}
      <p class="mt-14 text-3xl">No contracts found!</p>
    {/each}
  </div>
  {#if contractSelected}
    <Events contractName={contractSelected} />
  {/if}
</div>
