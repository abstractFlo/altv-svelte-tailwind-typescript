<script lang="ts">
  import { navigate, RouterView } from '@bjornlu/svelte-router';
  import { onMount, tick } from 'svelte';
  import { AltVService } from './services';
  import { ScriptEventType } from './shared/constants';


  onMount(() => {
    AltVService.on(ScriptEventType.Webview.RouteTo, handleRouting);
  });

  /**
   * Handle routing triggered by client
   *
   * @param {string} path
   * @returns {Promise<void>}
   */
  async function handleRouting(path: string): Promise<void> {
    await tick();
    navigate(path);
  }

</script>


<RouterView />
