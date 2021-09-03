<script lang="ts">
	import EmphasisedBox from '$lib/EmphasisedBox.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	import Chip from '$lib/Chip.svelte';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { destinationQuery, originQuery } from './stores.js';
</script>

<EmphasisedBox>
	<!-- "Go somewhere" homepage header -->
	{#if $page.path === '/'}
		<span class="header-layout" transition:slide>
			<h1 transition:fade>Go somewhere</h1>
		</span>
	{/if}

	<div class="header-layout">
		<!-- Hide back button on homepage -->
		{#if $page.path !== '/'}
			<!-- Back button -->
			<div class="back-button-layout">
				<a
					href={$page.path !== '/route-details' ? '/' : '/suggested-routes'}
					class="material-icons"
				>
					arrow_back_ios
				</a>
			</div>
		{/if}

		<!-- Destination chips -->
		{#if $page.path === '/'}
			<Chip icon="home">Home</Chip>
			<Chip icon="work">Work</Chip>
		{/if}

		<!-- Don't show searchbars on route details page -->
		{#if $page.path !== '/route-details'}
			<div class="searchbar-layout">
				<!-- Origin searchbar -->
				{#if $page.path === '/suggested-routes' || $page.params.endpoint == 'origin'}
					<Searchbar placeholder="Enter your origin" bind:text={$originQuery.name} name="origin" />
				{/if}

				<!-- Destination searchbar -->
				{#if $page.params.endpoint !== 'origin'}
					<Searchbar
						placeholder={$page.path === '/' ? 'Search location' : 'Enter your destination'}
						bind:text={$destinationQuery.name}
						name="destination"
					/>
				{/if}
			</div>
		{:else}
			route summary goes here
		{/if}
	</div>
</EmphasisedBox>

<slot />

<style>
	.searchbar-layout {
		width: 100%;
		display: grid;
		gap: var(--space-sm);
	}

	.header-layout {
		display: flex;
		flex-direction: row;
	}

	.back-button-layout {
		padding-top: 9px;
	}
</style>
