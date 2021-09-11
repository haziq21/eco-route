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
	import { selectedRoute, destinationQuery, originQuery } from '$lib/stores';
	import { writable } from 'svelte/store';

	// Declaring some logic here to reduce clutter in HTML
	$: showOriginSearchbar = ['/select-origin', '/suggested-routes'].includes($page.path);
	$: showDestinationSearchbar = ['/', '/select-destination', '/suggested-routes'].includes(
		$page.path
	);
	$: showRouteSummary = $page.path === '/route-details';
	$: showBusStop = $page.path.includes('/bus-stop/');

	let locationChipTarget: string;
	$: if ($page.path.includes('/set-home')) {
		locationChipTarget = 'home';
	} else if ($page.path.includes('/set-work')) {
		locationChipTarget = 'work';
	} else {
		locationChipTarget = undefined;
	}

	// Skip these pages when the back button is clicked
	window.onpopstate = () => {
		if (
			window.location.pathname.includes('/select-') ||
			window.location.pathname.includes('/set-')
		) {
			history.back();
		}
	};

	// Wraps a string in a span tag
	function wrapInSpan(text: string | number, classes = 'number') {
		return `<span class="${classes}">${text}</span>`;
	}

	// Gets HTML of the arrival time of a route
	function getArriveTimeHTML({ arriveTime }) {
		const timeString = new Date(arriveTime).toLocaleString('en', {
			hour: 'numeric',
			minute: 'numeric'
		});
		const timeHTML = 'Leave now, arrive at ' + wrapInSpan(timeString);

		return wrapInSpan(timeHTML, 'extra');
	}

	// Gets HTML of the duration of a route
	function getDurationHTML({ duration }) {
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor((duration - hours * 3600) / 60);

		if (hours || minutes) {
			let hourString = hours ? wrapInSpan(hours) + ' hr' : '';
			let minuteString = minutes ? wrapInSpan(minutes) + ' min' : '';

			return wrapInSpan(`${hourString} ${minuteString}`, 'time');
		} else {
			return wrapInSpan('Instant', 'time'); // Just in case...
		}
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
			<span on:click={() => history.back()} class="material-icons back-button">
				arrow_back_ios
			</span>
		{:else}
			<Chip icon="home" name="home">Home</Chip>
			<Chip icon="work" name="work">Work</Chip>
		{/if}

		<!-- Bus stop name -->
		{#if showBusStop}
			<h2>{$page.params.busStopName}</h2>
			<span class="bus-stop-code">{$page.params.busStopCode}</span>
		{:else if locationChipTarget}
			<Searchbar
				placeholder="Enter your {locationChipTarget} location"
				bind:text={$locationChipSearch}
			/>
		{:else}
			<div class="searchbar-layout">
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
					<RouteTimeline route={$selectedRoute} />
					<div class="route-layout">
						{@html getArriveTimeHTML($selectedRoute)}
						{@html getDurationHTML($selectedRoute)}
					</div>
				{/if}
			</div>
		{/if}
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
		display: flex;
		align-items: center;
		margin-left: var(--space);
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

	/* :global() to select the span.number inside {@html ...} tags */
	:global(.number) {
		font-weight: bolder;
	}

	:global(.time) {
		font-size: 1.2rem;
	}

	:global(.extra) {
		font-size: 0.9rem;
	}
</style>
