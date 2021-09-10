<script lang="ts">
	import { goto } from '$app/navigation';

	export let placeholder: string;
	export let text = '';
	export let redirect: string = undefined;
	let ref: HTMLInputElement;

	function pageRedirect() {
		if (redirect) {
			goto(`/${redirect}`, { keepfocus: true });
			if (text == 'Current location') {
				text = '';
			}
		}
	}
</script>

<input
	type="text"
	{placeholder}
	bind:value={text}
	bind:this={ref}
	on:click={pageRedirect}
	on:focus
/>

<style>
	input {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		width: 100%;
		height: 38px;
		padding-left: var(--space-md);
		margin: 0;
		background-color: var(--input-field);
		color: var(--icon-text);
		opacity: 1;
		font-size: 1em;
		border: none;
		border-radius: var(--border-radius-sm);
		transition: 0.3s;
	}

	input:focus {
		outline: none;
		box-shadow: var(--shadow);
	}
</style>
