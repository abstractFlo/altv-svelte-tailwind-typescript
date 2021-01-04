import { initHashRouter } from '@bjornlu/svelte-router';

initHashRouter([
  {path: '/', component: () => import('./pages/Home.svelte').then(m => m)}
])
