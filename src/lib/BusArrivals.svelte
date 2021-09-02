<script lang="ts">
	import type { arrivals } from 'src/types/busArrivals.type';
	import ArrivalMarker from './ArrivalMarker.svelte';
	import ArrivalTimeline from './ArrivalTimeline.svelte';

	export let arrivals: arrivals;
</script>

<h3>{arrivals.busStopCode}</h3>
<div class="bus-stop">
	{#each arrivals.services as service}
		<!-- Bus number -->
		<h3 class="bus-number">{service.number}</h3>
		<!-- Space between bus number and arrival timings -->
		<span class="spacing" />

		<!-- Arrival timings -->
		{#each service.arrivals as arrival}
			<ArrivalMarker {arrival} />

			<!-- Timing separator -->
			{#if arrival !== service.arrivals[service.arrivals.length - 1]}
				<span class="separator">&lt;</span>
			{/if}
		{/each}
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
		place-self: center stretch;
		grid-column-start: front;
	}

	.separator {
		margin: 0 var(--space);
	}

	.spacing {
		grid-column-end: spacing;
	}

	.bus-stop {
		display: grid;
		grid-template-columns: [front] min-content auto [spacing] repeat(5, min-content);
		row-gap: var(--space);
		justify-items: center;
		align-items: center;
	}
</style>
