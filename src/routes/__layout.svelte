<script context="module">
	// Value of searchbar on set-[location] page
	export const locationChipSearch = writable('');
</script>

<script lang="ts">
	import Searchbar from '$lib/Searchbar.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { selectedRoute, destinationQuery, originQuery, routes } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { getBusStop, getDurationHTML, getArriveTimeHTML, uncompressJSON } from '$lib/utilities';

	// Declaring some logic here to reduce clutter in HTML
	$: showOriginSearchbar = ['/select-origin', '/suggested-routes'].includes($page.path);
	$: showDestinationSearchbar = ['/', '/select-destination', '/suggested-routes'].includes(
		$page.path
	);
	$: showRouteSummary = $page.path.includes('/route-details/');
	$: showBusStop = $page.path.includes('/bus-stop/');
	$: showBusService = $page.path.includes('/bus-service/');

	let serviceIsLoopService: boolean;
	$: if ($page.path.includes('/bus-service/'))
		serviceIsLoopService = $page.params.originCode === $page.params.destinationCode;

	let locationChipTarget: string;
	$: if ($page.path.includes('/set-home')) {
		locationChipTarget = 'home';
	} else if ($page.path.includes('/set-work')) {
		locationChipTarget = 'work';
	} else {
		locationChipTarget = undefined;
	}

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

	// Go back to the previous page
	function back() {
		history.back();
		$locationChipSearch = '';
	}
</script>

<!-- I know there are a lot of {#if }s. I'd use layout resets on each page but since
	 SvelteKit is still in beta, layout resets are still a bit buggy. For instance, 
	 the layout is loaded twice upon navigation if navigation triggers animation. -->
<div class="box">
	<!-- "Go somewhere" homepage header -->
	{#if $page.path === '/'}
		<span class="header-layout" out:slide>
			<h1 out:fade>Go somewhere</h1>
		</span>
	{/if}

	<div class="header-layout">
		<!-- Hide back button on homepage -->
		{#if $page.path !== '/'}
			<!-- Back button -->
			<!-- For some reason, on:click={history.back} throws 
				'window is not defined' even when SSR is disabled-->
			<span on:click={back} class="material-icons back-button"> arrow_back_ios </span>
		{:else}
			<Chip icon="home" name="home">Home</Chip>
			<Chip icon="work" name="work">Work</Chip>
		{/if}

		<div class="searchbar-layout">
			<!-- Bus service page -->
			{#if showBusService}
				<h2>{$page.params.busNumber}</h2>
				<span class="bus-stop-code">
					{#await getBusStop($page.params.originCode) then stop}
						{stop.name}
					{/await}
					{#if !serviceIsLoopService}
						{#await getBusStop($page.params.destinationCode) then stop}
							to
							{stop.name}
						{/await}
					{:else}
						(loop service)
					{/if}
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

				<!-- {$locationChipSearch} -->
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
				<RouteTimeline route={uncompressJSON($page.params.route)} />
				<div class="route-layout">
					{@html getArriveTimeHTML($selectedRoute)}
					{@html getDurationHTML($selectedRoute)}
				</div>
			{/if}
		</div>
	</div>
</div>

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

		z-index: 1;
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
		padding: 6px 0;
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
