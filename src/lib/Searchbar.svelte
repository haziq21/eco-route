<script>
	export let placeholder;
	export let defaultText = '';
	export let ref = undefined;
</script>

<input type="text" {placeholder} value={defaultText} bind:this={ref} on:click />

<style>
	input {
		width: 100%;
		padding: 9px;
		/* margin: 0 auto; */
		/* margin-bottom: 5px; */
		background-color: var(--input-field);
		color: var(--icon-text);
		opacity: 1;
		font-size: 1em;
		border: none;
		border-radius: var(--border-radius-sm);
		box-shadow: var(--shadow);
	}
</style>
