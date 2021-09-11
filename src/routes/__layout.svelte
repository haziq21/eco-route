<script lang="ts">
	import Searchbar from '$lib/Searchbar.svelte';
	import RouteTimeline from '$lib/RouteTimeline.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { selectedRoute, destinationQuery, originQuery } from '$lib/stores';

	// Declaring some logic here to reduce clutter in HTML
	$: showOriginSearchbar = ['/select-origin', '/suggested-routes'].includes($page.path);
	$: showDestinationSearchbar = ['/', '/select-destination', '/suggested-routes'].includes(
		$page.path
	);
	$: showRouteSummary = $page.path === '/route-details';
	$: showBusStop = $page.path.includes('/bus-stop/');

	function back() {
		if ($page.path === '/suggested-routes') history.go(-2);
		else history.back();
	}

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
	 the layout is loaded twice upon navigation if it triggers some animation. -->
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
			<span on:click={back} class="material-icons back-button"> arrow_back_ios </span>
		{:else}
			<!-- redirect="/ringing-alarm" because this is a fake button -->
			<Chip icon="home" redirect="/ringing-alarm">Home</Chip>
			<Chip icon="work">Work</Chip>
		{/if}

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

			{#if showBusStop}
				{$page.params.name} {$page.params.code}
			{/if}
		</div>
	</div>
</div>

<slot />

<style>
	.box {
		background-color: var(--header);
		color: var(--overlay);
		box-shadow: var(--shadow), 0 0 10px var(--space) var(--background);
		border-radius: var(--border-radius);
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

	/* :global() to select the span.number inside {@html ...} tags */
	:global(.number) {
		font-weight: bolder;
	}

	:global(.time) {
		font-size: 1.2em;
	}

	:global(.extra) {
		font-size: 0.9em;
	}
</style>
