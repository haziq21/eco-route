<script lang="ts">
	import Searchbar from '$lib/Searchbar.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import {
		destinationQuery,
		locationChipSearch,
		originQuery,
		routes,
		serviceRoute
	} from '$lib/stores';
	import { getDurationHTML, getArriveTimeHTML, uncompressJSON } from '$lib/utilities';
	import type { route } from '$lib/types';
	import BackButton from '$lib/BackButton.svelte';
	import { cubicOut } from 'svelte/easing';

	// Declaring some logic here to reduce clutter in HTML
	$: showOriginSearchbar = ['/select-origin', '/suggested-routes'].includes($page.path);
	$: showDestinationSearchbar = ['/', '/select-destination', '/suggested-routes'].includes(
		$page.path
	);
	$: showRouteSummary = $page.path.includes('/route-details/');
	$: showBusStop = $page.path.includes('/bus-stop/');
	$: showBusService = $page.path.includes('/bus-service/');

	let locationChipTarget: string;
	$: if ($page.path.includes('/set-home')) {
		locationChipTarget = 'home';
	} else if ($page.path.includes('/set-work')) {
		locationChipTarget = 'work';
	} else {
		locationChipTarget = undefined;
	}

	let selectedRoute: route;
	$: if ($page.params.route) selectedRoute = uncompressJSON($page.params.route);

	// Clear the routes store
	$: if (!$page.path.includes('/suggested-routes') && !$page.path.includes('/route-details'))
		$routes = [];

	// Skip these pages when the back button is clicked
	window.onpopstate = () => {
		if (
			window.location.pathname.includes('/select-') ||
			window.location.pathname.includes('/set-')
		) {
			history.back();
		}
	};

	// Sink into background animation function
	function sink(node, { delay = 0, duration = 500, easing = cubicOut }) {
		const style = getComputedStyle(node);
		const opacity = +style.opacity;
		const marginBottom = parseFloat(style.marginBottom);
		const height = parseFloat(style.height);

		return {
			delay,
			duration,
			easing,
			css: (t) =>
				`overflow: hidden;` +
				`opacity: ${t * opacity};` +
				`margin-bottom: ${t * (marginBottom + height) - height}px;` +
				`transform: scale(${t * 0.3 + 0.7});`
		};
	}
</script>

<!-- I know there are a lot of {#if }s. I'd use layout resets on each page but since
	 SvelteKit is still in beta, layout resets are still a bit buggy. For instance, 
	 the layout is loaded twice upon navigation if navigation triggers animation. -->
{#if !($page.params.view === 'search-busses')}
	<div class="box" transition:sink>
		<!-- "Go somewhere" homepage header -->
		{#if $page.path === '/'}
			<span class="header-layout" out:slide|local>
				<h1 out:fade|local>Go somewhere</h1>
			</span>
		{/if}

		<div class="header-layout">
			<!-- Hide back button on homepage -->
			{#if $page.path !== '/'}
				<!-- Back button -->
				<!-- For some reason, on:click={history.back} throws 
			'window is not defined' even when SSR is disabled-->
				<BackButton />
			{:else}
				<Chip icon="home" name="home">Home</Chip>
				<Chip icon="work" name="work">Work</Chip>
			{/if}

			<div class="searchbar-layout">
				<!-- Bus service page -->
				{#if showBusService && $serviceRoute}
					<h2>{$page.params.busNumber}</h2>
					<span class="bus-stop-code">
						{#await $serviceRoute then stops}
							{stops[0].name}

							{#if stops[stops.length - 1].code !== stops[0].code}
								to {stops[stops.length - 1].name}
							{:else}
								(loop service)
							{/if}
						{/await}
					</span>
				{/if}

				<!-- Bus stop page -->
				{#if showBusStop}
					<h2>{$page.params.busStopName}</h2>
					<span class="bus-stop-code">{$page.params.busStopCode}</span>
				{/if}

				<!-- Set 'quick destination' searchbar -->
				{#if locationChipTarget}
					<Searchbar
						placeholder="Enter your {locationChipTarget} location"
						bind:text={$locationChipSearch}
					/>
				{/if}

				<!-- Origin searchbar -->
				{#if showOriginSearchbar}
					<Searchbar
						placeholder="Enter your origin"
						bind:text={$originQuery.name}
						redirect="select-origin"
					/>
				{/if}

				<!-- Destination searchbar -->
				{#if showDestinationSearchbar}
					<Searchbar
						placeholder={$page.path === '/' ? 'Search' : 'Enter your destination'}
						bind:text={$destinationQuery.name}
						redirect="select-destination"
					/>
				{/if}

				<!-- Route summary bar -->
				{#if showRouteSummary}
					<RouteTimeline route={selectedRoute} />
					<div class="route-layout">
						{@html getArriveTimeHTML(selectedRoute)}
						{@html getDurationHTML(selectedRoute)}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<slot />

<style>
	h2 {
		display: flex;
		align-items: center;
		margin: 0;
	}

	.bus-stop-code {
		color: var(--icon-text);
		font-size: 0.9rem;
		font-weight: bold;
	}

	.box {
		border-radius: var(--border-radius);
		color: var(--overlay);
		background-color: var(--header);
		box-shadow: var(--shadow), 0 0 10px var(--space) var(--background);
		padding: var(--space);
		margin-bottom: var(--space);
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

	.route-layout {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-sm);
		margin-bottom: -5px;
	}

	/* :global() to select elements inside {@html ...} tags */
	.searchbar-layout :global(.number) {
		font-weight: bolder;
	}

	.searchbar-layout :global(.time) {
		font-size: 1.2rem;
	}

	.searchbar-layout :global(.extra) {
		font-size: 0.9rem;
	}
</style>
