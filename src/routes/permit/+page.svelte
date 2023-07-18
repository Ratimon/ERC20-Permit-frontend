<script lang="ts">  
    import { chain, fallback, flow, wallet } from '$lib/blockchain/wallet';
    import WalletAccess from '$lib/blockchain/WalletAccess.svelte';
    import NavButton from '$lib/components/styled/navigation/NavButton.svelte';

  </script>
  
  <section class="py-2 px-4 text-center">
    <div class="max-w-md mx-auto pt-1 mt-5 space-y-3 md:mt-8 md:space-y-5">

    <!-- <slot /> -->
  
      <WalletAccess>
  
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
            Connect to Open the Position
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