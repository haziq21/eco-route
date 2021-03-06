<script lang="ts">
	import Searchbar from '$lib/Searchbar.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import {
		busStopArrivals,
		destinationQuery,
		locationChipSearch,
		originQuery,
		routes,
		serviceRoute
	} from '$lib/stores';
	import { getDurationHTML, getArriveTimeHTML, uncompressJSON, sink, float } from '$lib/utilities';
	import type { route } from '$lib/types';
	import BackButton from '$lib/BackButton.svelte';

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

	// ATTENTION: This doesn't work.
	window.onpopstate = () => {
		console.log('onpopstate() called');

		// Skip these pages when the back button is clicked
		if (location.pathname.includes('/select-') || location.pathname.includes('/set-')) {
			console.log('going back');
			history.back();
		}
	};
</script>

<!-- I know there are a lot of {#if }s. I'd use layout resets on each page but since
	 SvelteKit is still in beta, layout resets are still a bit buggy. For instance, 
	 the layout is loaded twice upon navigation if navigation triggers animation. -->
{#if !($page.params.view === 'search-busses')}
	<div class="box" out:sink in:float>
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

			<div class={showBusService || showBusStop ? 'vertical-stack' : 'searchbar-layout'}>
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
				{#if showBusStop && $busStopArrivals}
					{#await $busStopArrivals then arrivals}
						<h2>{arrivals.busStopName}</h2>
					{/await}

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

	.vertical-stack {
		display: grid;
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
