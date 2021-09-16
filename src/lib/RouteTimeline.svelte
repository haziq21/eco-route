<script lang="ts">
	import type { route } from '$lib/types';
	import { selectedRoute } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { compressJSON } from './utilities';

	export let route: route;
	export let longestRoute = route.distance;
	let parentWidth: number;

	function redirect() {
		$selectedRoute = route;
		goto(`/route-details/${compressJSON(route)}`);
	}
</script>

<div
	class="route"
	style="width: {(route.distance / longestRoute) * 100}%"
	class:thicker={$page.path.includes('/route-details/')}
	bind:offsetWidth={parentWidth}
	on:click={redirect}
>
	{#each route.segments as segment}
		<!-- Dont show this segment if it's too small -->
		{#if (segment.distance / route.distance) * parentWidth >= 5}
			<div
				class="segment {segment.mode} {segment.modeIdentity}"
				class:border={$page.path.includes('/route-details/')}
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
		color: rgb(130, 142, 150);
	}

	.bus {
		color: var(--overlay);
	}
</style>
