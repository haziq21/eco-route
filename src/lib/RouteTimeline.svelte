<script lang="ts">
	import { goto } from '$app/navigation';
	import { selectedRoute } from '../routes/stores.js';
	import type { route } from 'src/types/directions.type';
	import { page } from '$app/stores';

	export let route: route;
	export let longestRoute = route.distance;
	let parentWidth: number;

	function redirect() {
		$selectedRoute = route;
		goto('route-details');
	}
</script>

<div
	class="route"
	style="width: {(route.distance / longestRoute) * 100}%"
	class:thicker={$page.path === '/route-details'}
	bind:offsetWidth={parentWidth}
	on:click={redirect}
>
	{#each route.segments as segment}
		<!-- Dont show this segment if it's too small -->
		{#if (segment.distance / route.distance) * parentWidth >= 5}
			<div
				class="segment {segment.mode} {segment.modeIdentity}"
				class:border={$page.path === '/route-details'}
				style="width: {(segment.distance / route.distance) * 100}%"
			>
				<span class="label">{segment.modeIdentity || 'walk'}</span>
			</div>
		{/if}
	{/each}
</div>

<style>
	.route {
		display: flex;
		flex-direction: row;
		height: 32px;
		line-height: 200%;
		transition: 0.3s;
	}

	.route.thicker {
		height: 36px;
		line-height: 225%;
	}

	.segment {
		border-radius: var(--border-radius-sm);
		text-align: center;
		margin-right: 2px;
		overflow: hidden;
		color: rgba(0, 0, 0, 0.4);
	}

	.segment.border {
		box-shadow: 0 0 0 2px var(--input-field) inset;
	}

	.segment::before {
		content: '';
		/* Hide the modeIdentity text when the segment is too short */
		display: inline-block;
	}

	.label {
		padding: 0 var(--space-sm);
		font-weight: bolder;
		display: inline-block;
		white-space: nowrap;
	}

	/* Route timeline segment colours */

	.walk {
		background-color: rgb(226, 226, 226);
		color: rgb(130, 142, 150);
	}

	.bus {
		color: var(--overlay);
		background-color: rgb(45, 175, 105);
	}

	.mrt {
		/* Fallback colour, in case something
		goes wrong with the line names */
		background-color: rgb(3, 89, 173);
	}

	.EW {
		background-color: var(--MRT-EW);
	}

	.NS {
		background-color: var(--MRT-NS);
	}

	.CC {
		background-color: var(--MRT-CC);
	}

	.DT {
		background-color: var(--MRT-DT);
	}
</style>
