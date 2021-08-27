<script lang="ts">
	import type { arrivals } from 'src/types/busArrivals.type';
	import ArrivalTimeline from './ArrivalTimeline.svelte';

	export let arrivals: arrivals;
</script>

<h3>{arrivals.busStopCode}</h3>
<div class="bus-stop">
	{#each arrivals.services as service}
		<h3 class="bus-number">{service.number}</h3>
		<ArrivalTimeline arrivals={service.arrivals} />
	{/each}
</div>

<style>
	.bus-number {
		padding: 3px 9px;
		margin: 0;
		border-radius: var(--border-radius-sm);
		background-color: var(--header);
		color: var(--overlay);
		text-align: center;
	}

	.bus-stop {
		display: grid;
		grid-template-columns: min-content auto;
		gap: var(--space);
	}
</style>
