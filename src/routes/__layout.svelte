<!-- <script context="module">
	export const ssr = false;
</script> -->
<script lang="ts">
	import EmphasisedBox from '$lib/EmphasisedBox.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { selectedRoute, destinationQuery, originQuery, currentPlace } from './_stores';

	function hours(seconds: number) {
		return Math.floor(seconds / 3600);
	}

	function minutes(seconds: number) {
		return Math.floor((seconds - hours(seconds) * 3600) / 60);
	}
</script>

{#if $page.path !== '/ringing-alarm'}
	<div class="box">
		<!-- "Go somewhere" homepage header -->
		{#if $page.path === '/'}
			<span class="header-layout" out:slide>
				<h1 out:fade>Go somewhere</h1>
			</span>
		{/if}

		<div class="header-layout" transition:slide>
			<!-- Hide back button on homepage -->
			{#if $page.path !== '/'}
				<!-- Back button -->
				<a
					href={$page.path !== '/route-details' ? '/' : '/suggested-routes'}
					class="material-icons back-button"
				>
					arrow_back_ios
				</a>
			{:else}
				<Chip icon="home" redirect="/ringing-alarm">Home</Chip>
				<Chip icon="work">Work</Chip>
			{/if}

			<!-- Don't show searchbars on route details page -->
			{#if $page.path !== '/route-details'}
				<div class="searchbar-layout">
					<!-- Origin searchbar -->
					{#if $page.path === '/suggested-routes' || $page.params.endpoint == 'origin'}
						<Searchbar
							placeholder="Enter your origin"
							bind:text={$originQuery.name}
							name="origin"
						/>
					{/if}

					<!-- Destination searchbar -->
					{#if $page.params.endpoint !== 'origin'}
						<Searchbar
							placeholder={$page.path === '/' ? 'Search' : 'Enter your destination'}
							bind:text={$destinationQuery.name}
							name="destination"
						/>
					{/if}
				</div>
			{:else}
				<div class="searchbar-layout">
					<RouteTimeline route={$selectedRoute} />
					<div class="route-layout">
						<span class="extra">
							Leave now, arrive at
							<span class="number">
								{new Date($selectedRoute.arriveTime).toLocaleString('en', {
									hour: 'numeric',
									minute: 'numeric'
								})}.
							</span>
						</span>
						<span class="time">
							{#if hours($selectedRoute.duration)}
								<span class="number">{hours($selectedRoute.duration)}</span>
								hr
							{/if}
							<span class="number">{minutes($selectedRoute.duration)}</span>
							min
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<slot />

<style>
	.box {
		/* position: -webkit-sticky; */
		/* position: fixed; */
		/* top: var(--space); */
		background-color: var(--header);
		color: var(--overlay);
		box-shadow: var(--shadow), 0 0 10px var(--space) var(--background);
		border-radius: var(--border-radius);
		padding: var(--space);
		margin-bottom: var(--space);
		z-index: 1;
		/* width: calc(100% - var(--space) * 2); */
	}

	.searchbar-layout {
		width: 100%;
		display: grid;
		gap: var(--space-sm);
	}

	.header-layout {
		display: flex;
		flex-direction: row;
	}

	.back-button {
		color: var(--overlay);
		padding-top: 6px;
	}

	.route-layout {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-sm);
		margin-bottom: -5px;
	}

	.time {
		font-size: 1.2em;
	}

	.number {
		font-weight: bolder;
	}

	.extra {
		font-size: 1em;
		/* margin: 3px 0 var(--space) 0; */
	}
</style>
