<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let placeholder: string;
	export let text = '';
	export let name: 'origin' | 'destination' = undefined;
	let ref: HTMLInputElement;

	function redirect() {
		if (!$page.params.endpoint && name) {
			goto(`/select-${name}`, { keepfocus: true });
			if (text == 'Current location') {
				text = '';
			}
		}
	}
</script>

<input type="text" {placeholder} bind:value={text} bind:this={ref} on:click={redirect} />

<style>
	input[type='text'] {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		width: 100%;
		padding: 9px;
		margin: 0;
		background-color: var(--input-field);
		color: var(--icon-text);
		opacity: 1;
		font-size: 1em;
		border: none;
		border-radius: var(--border-radius-sm);
		box-shadow: var(--shadow);
	}
</style>
