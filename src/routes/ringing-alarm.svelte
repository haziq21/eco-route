<div class="background">
	<span class="alarm-text">
		<h1>This is your stop</h1>
		<p>Proceed to <span class="place">Ang Mo Kio MRT Station</span></p>
	</span>

	<a href="/" class="material-icons"> clear </a>
</div>

<style>
	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		color: var(--overlay);
		background-color: var(--header);
	}
	h1 {
		font-size: 2.5em;
	}
	.alarm-text {
		position: absolute;
		width: fit-content;
		text-align: center;
		top: 35%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.place {
		font-weight: bold;
	}

	.material-icons {
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: var(--space-sm);
		border-radius: 100%;
		color: var(--overlay);
		background-color: var(--icon-text);
		font-size: 4em;
	}
</style>
