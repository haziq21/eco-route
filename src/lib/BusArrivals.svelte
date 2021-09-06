<script lang="ts">
	import type { arrivals } from 'src/types/busArrivals.type';
	import ArrivalMarker from './ArrivalMarker.svelte';

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
		{#if service.arrivals[0]}
			<ArrivalMarker arrival={service.arrivals[0]} />
			<span class="separator">&#10148;</span>
			{#if service.arrivals[1]}
				<ArrivalMarker arrival={service.arrivals[1]} />
			{:else}
				NA
			{/if}
		{:else}
			<span class="error-message">No arrivals available</span>
		{/if}
		<!-- {#each service.arrivals as arrival}
			<ArrivalMarker {arrival} />

			{#if arrival !== service.arrivals[service.arrivals.length - 1]}
				<span class="separator">&lt;</span>
			{/if}
		{/each} -->
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
		margin: 0 28px;
		font-size: 1.5em;
		transform: scale(-1, 1);
		color: var(--icon-text);
	}

	.error-message {
		grid-column: 3 / 6;
	}

	.spacing {
		grid-column-end: spacing;
	}

	.bus-stop {
		display: grid;
		grid-template-columns: [front] min-content auto [spacing] repeat(3, min-content);
		row-gap: var(--space);
		justify-items: center;
		align-items: center;
	}
</style>
