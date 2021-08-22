<!-- <script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/api/bus-arrivals');
		const data = await res.json();
		console.log('data fetched');

		if (res.ok) {
			return {
				props: {
					data
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load /api/bus-arrivals`)
		};
	}
</script> -->
<script>
	import Box from '$lib/Box.svelte';

	async function getBusArrivals() {
		const res = await fetch('/api/bus-arrivals');
		const data = await res.json();

		return JSON.stringify(data);
	}
</script>

<Box>
	<h1>Bus arrivals</h1>
	{#await getBusArrivals()}
		loading...
	{:then response}
		{response}
	{/await}
</Box>
