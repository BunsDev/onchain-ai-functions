<script lang="ts">
  import { targetNetwork } from "$lib/wagmi/classes";
  import { untrack } from "svelte";
  import { ArrowsRightLeft, Icon } from "svelte-hero-icons";
  import { InputBase } from "$lib/scaffold-eth/components";
  import { SIGNED_NUMBER_REGEX, type CommonInputProps } from "$lib/scaffold-eth/ts";

  const MAX_DECIMALS_USD = 2;

  function etherValueToDisplayValue(usdMode: boolean, etherValue: string, price: number) {
    if (usdMode && price) {
      const parsedEthValue = parseFloat(etherValue);
      if (Number.isNaN(parsedEthValue)) {
        return etherValue;
      } else {
        // We need to round the value rather than use toFixed,
        // since otherwise a user would not be able to modify the decimal value
        return (Math.round(parsedEthValue * price * 10 ** MAX_DECIMALS_USD) / 10 ** MAX_DECIMALS_USD).toString();
      }
    } else {
      return etherValue;
    }
  }

  function displayValueToEtherValue(usdMode: boolean, displayValue: string, price: number) {
    if (usdMode && price) {
      const parsedDisplayValue = parseFloat(displayValue);
      if (Number.isNaN(parsedDisplayValue)) {
        // Invalid number.
        return displayValue;
      } else {
        // Compute the ETH value if a valid number.
        return (parsedDisplayValue / price).toString();
      }
    } else {
      return displayValue;
    }
  }

  let {
    value = $bindable(),
    name,
    placeholder,
    onchange,
    disabled,
    usdMode
  }: CommonInputProps & { usdMode?: boolean } = $props();

  let internalUsdMode = $state(targetNetwork.nativeCurrencyPrice > 0 ? Boolean(usdMode) : false);
  let transitoryDisplayValue = $state<string | undefined>();

  const displayValue = $derived.by(() => {
    const newDisplayValue = etherValueToDisplayValue(internalUsdMode, value, targetNetwork.nativeCurrencyPrice);
    if (transitoryDisplayValue && parseFloat(newDisplayValue) === parseFloat(transitoryDisplayValue)) {
      return transitoryDisplayValue;
    }

    untrack(() => {
      // Clear any transitory display values that might be set
      transitoryDisplayValue = undefined;
    });

    return newDisplayValue;
  });

  const handleChangeNumber = (newValue: string) => {
    if (newValue && !SIGNED_NUMBER_REGEX.test(newValue)) {
      return;
    }

    // Following condition is a fix to prevent usdMode from experiencing different display values
    // than what the user entered. This can happen due to floating point rounding errors that are introduced in the back and forth conversion
    if (internalUsdMode) {
      const decimals = newValue.split(".")[1];
      if (decimals && decimals.length > MAX_DECIMALS_USD) {
        return;
      }
    }

    // Since the display value is a derived state (calculated from the ether value), usdMode would not allow introducing a decimal point.
    // This condition handles a transitory state for a display value with a trailing decimal sign
    if (newValue.endsWith(".") || newValue.endsWith(".0")) {
      transitoryDisplayValue = newValue;
    } else {
      transitoryDisplayValue = undefined;
    }

    const newEthValue = displayValueToEtherValue(internalUsdMode, newValue, targetNetwork.nativeCurrencyPrice);
    value = newEthValue;
    onchange?.(newEthValue);
  };

  const toggleMode = () => {
    if (targetNetwork.nativeCurrencyPrice > 0) {
      internalUsdMode = !internalUsdMode;
    }
  };
</script>

<InputBase {name} value={displayValue} {placeholder} onchange={handleChangeNumber} {disabled}>
  {#snippet prefix()}
    <span class="-mr-2 self-center pl-4 text-accent">{internalUsdMode ? "$" : "Ξ"}</span>
  {/snippet}
  {#snippet suffix()}
    <div
      class={targetNetwork.nativeCurrencyPrice > 0
        ? ""
        : "tooltip tooltip-secondary before:left-auto before:right-[-10px] before:transform-none before:content-[attr(data-tip)]"}
      data-tip="Unable to fetch price"
    >
      <button
        class="btn btn-primary h-[2.2rem] min-h-[2.2rem]"
        onclick={toggleMode}
        disabled={!internalUsdMode && !targetNetwork.nativeCurrencyPrice}
      >
        <Icon src={ArrowsRightLeft} class="h-3 w-3 cursor-pointer" aria-hidden="true" />
      </button>
    </div>
  {/snippet}
</InputBase>
