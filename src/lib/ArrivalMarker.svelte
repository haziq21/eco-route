<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { busArrival } from '$lib/types';

	export let arrival: busArrival;
</script>

<span class="info" class:arr={!arrival.minutesToArrival}>
	{#key arrival.minutesToArrival}
		<span class="number" transition:fade|local>
			{arrival.minutesToArrival ? arrival.minutesToArrival : 'Arr'}
		</span>
	{/key}

	{#if arrival.minutesToArrival}
		<span class="time-unit">min</span>
	{/if}

	<span class="icons">
		<span class="material-icons">
			{{ SEA: 'person', SDA: 'group', LSD: 'groups' }[arrival.occupancy]}
		</span>
		<span class="decks">{arrival.type[0] + arrival.type[1].toLowerCase()}</span>
		<!-- <span class="material-icons"> directions_bus </span> -->
	</span>
</span>

<style>
	.decks {
		color: var(--text);
		font-weight: bold;
	}

	.info {
		/* background-color: aqua; */
		display: grid;
		grid-template-columns: min-content min-content;
		grid-template-areas: 'number icons' 'time-unit icons';
		justify-items: center;

		gap: 0 var(--space-sm);
	}

	.info.arr {
		justify-items: center;
		grid-template-areas: 'number icons' 'number icons';
	}

	.number {
		display: flex;
		align-items: center;
		grid-area: number;
		font-weight: bolder;
		font-size: 1.3rem;
	}

	.time-unit {
		grid-area: time-unit;
		font-size: 0.9rem;
	}

	.icons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		vertical-align: center;
		grid-area: icons;
	}
</style>
