<script lang="ts">
	import type { busArrival } from '$lib/types';

	export let arrival: busArrival;
</script>

<span class="info" class:arr={!arrival.minutesToArrival}>
	<span class="number">
		{arrival.minutesToArrival ? arrival.minutesToArrival : 'Arr'}
	</span>

	{#if arrival.minutesToArrival}
		<span class="time-unit">min</span>
	{/if}

	<span class="icons">
		<span class="material-icons">
			{{ SEA: 'person', SDA: 'group', LSD: 'groups' }[arrival.occupancy]}
		</span>
		<!-- <span>{arrival.type}</span> -->
		<span class="material-icons"> directions_bus </span>
	</span>
</span>

<style>
	.info {
		/* background-color: aqua; */
		display: grid;
		grid-template-columns: min-content min-content;
		grid-template-areas: 'number icons' 'time-unit icons';
		justify-items: center;

		gap: 0 var(--space-sm);
	}

	.info.arr {
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
