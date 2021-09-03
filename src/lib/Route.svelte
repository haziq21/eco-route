<script lang="ts">
	import { goto } from '$app/navigation';
	import type { route } from 'src/types/directions.type';

	export let route: route;
	export let longestRoute: number;
	let parentWidth: number;

	function redirect() {
		goto('route-details');
	}
</script>

<div
	class="route"
	style="width: {(route.distance / longestRoute) * 100}%"
	bind:offsetWidth={parentWidth}
	on:click={redirect}
>
	{#each route.segments as segment}
		<!-- Dont show this segment if it's too small -->
		{#if (segment.distance / route.distance) * parentWidth >= 5}
			<div
				class="segment {segment.mode}"
				style="width: {(segment.distance / route.distance) * 100}%"
			>
				<h4>{segment.modeIdentity ? segment.modeIdentity : 'walk'}</h4>
			</div>
		{/if}
	{/each}
</div>

<style>
	.route {
		display: flex;
		flex-direction: row;
		/* margin-bottom: var(--space); */
	}

	.segment {
		border-radius: var(--border-radius-sm);
		height: 35px;
		text-align: center;
		line-height: 200%;
		margin-right: 2px;
		overflow: hidden;
	}

	.segment::before {
		content: '';
		display: inline-block;
	}

	h4 {
		padding: 0 var(--space-sm);
		margin: 0;
		display: inline-block;
		white-space: nowrap;
	}

	.walk {
		background-color: #d2d2d2;
		color: rgb(150, 160, 170);
	}

	.bus {
		background-color: rgb(230, 180, 50);
		color: var(--overlay);
	}

	.mrt {
		background-color: #0359ad;
		color: var(--overlay);
	}
</style>
