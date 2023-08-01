<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type {BigNumber} from '@ethersproject/bignumber';
    import { chain, fallback, flow, wallet } from '$lib/blockchain/wallet';
    import WalletAccess from '$lib/blockchain/WalletAccess.svelte';
    import NavButton from '$lib/components/styled/navigation/NavButton.svelte';

    // todo (remove relevant file) in case jason file 
    import { contractsInfos } from '$lib/blockchain/contracts';
    // import _contractsInfos from '$lib/blockchain/data/contracts';

    import GetPermitPresenter from "./GetPermit.presenter";
    import SignPermitPresenter from "./SignPermit.presenter";

    let contractAddress: string;
    let currentAccount: string;
    
    let spender: string;
    let valueToApproveInETH: BigNumber| Number | undefined;
  
    let getPermitPresenter = new GetPermitPresenter();
    let signPermitPresenter = new SignPermitPresenter();

    $: {
      if (
        ($contractsInfos.contracts.TestToken && $wallet.state === 'Ready') ||
        $fallback.state === 'Ready' ||
        $chain.state === 'Ready'
      ) {
        refresh();
      } else {
        console.log({
          wallet: $wallet.state,
          fallback: $fallback.state
        });
      }
    }

    let timeout: NodeJS.Timeout | undefined;

  async function refresh() {
    await getPermitPresenter.load(generatedViewModel => {
        contractAddress = generatedViewModel.contractAddress;
        currentAccount = generatedViewModel.currentAccount;
      });
  }

  async function refreshAgainAndAgain() {
    await refresh();
    timeout = setTimeout(refreshAgainAndAgain, 2000);
  }

  onMount(async () => {
    await refreshAgainAndAgain();
  });

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  });


  async function permit() {
    await signPermitPresenter.permit(spender, valueToApproveInETH);
  }

  function formatError(error): string {
    try {
      return JSON.stringify(error, null, '  ');
    } catch (e) {
      return e.message || e;
    }
  }

  </script>
  
  <section class="py-2 px-4 text-center">
    <div class="max-w-md mx-auto pt-1 mt-5 space-y-3 md:mt-8 md:space-y-5">


  
      <WalletAccess>

        {#if ($chain.state === 'Ready' || $fallback.state === 'Ready') && $wallet.address && $wallet.state === 'Ready'}
        <!-- {#if ($chain.state === 'Ready' || $fallback.state === 'Ready')} -->
        <form class="w-full max-w-sm" method="POST" action="?/permit">
          <div class="flex items-center border-b border-pink-600 py-2">
            <input
              class="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2
                      leading-tight focus:outline-none"
              type="text"
              placeholder="Please fill spender"
              aria-label="spender"
              bind:value={spender}
              name="spender"
            />
          </div>
          <div class="flex items-center border-b border-pink-600 py-2">
            <input
              class="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2
                      leading-tight focus:outline-none"
              type="number"
              placeholder="0.0 ETH"
              aria-label="value to approve"
              bind:value={valueToApproveInETH}
              name="valueToApproveInETH"
            />
          </div>

          <div class="flex items-center">
            <NavButton
              label="permit"
              class="big secondary"
              disabled={!valueToApproveInETH || valueToApproveInETH === 0 || typeof valueToApproveInETH != 'number' || !spender}
              on:click={permit}
            >
              Permit
            </NavButton>

          </div>
        </form>
  
  
        {:else}
          <p class="m-6 text-gray-800 dark:text-gray-300 text-xl">
            waiting chain to be ready
          </p>
  
        {/if}




  
        {#if $wallet.address && $wallet.state === 'Ready'}
          <form class="mt-5 w-full max-w-sm">
            <div class="flex items-center">
              <NavButton
                label="Disconnect"
                disabled={$wallet.unlocking || $chain.connecting}
                on:click={() => wallet.disconnect()}
              >
                Disconnect
              </NavButton>
            </div>
          </form>
        {:else}
          <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Connect to Permit
          </h2>
  
          <form class="mt-5 w-full max-w-sm">
            <div class="flex items-center">
              <NavButton
                label="Connect"
                disabled={$wallet.unlocking || $chain.connecting}
                on:click={() => flow.connect()}
              >
                Connect
              </NavButton>
            </div>
          </form>
        {/if}
  
      </WalletAccess>
  
    </div>
  </section>