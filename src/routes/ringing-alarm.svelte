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
		font-size: 2.5rem;
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

	a.material-icons {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);

		width: 80px;
		height: 80px;
		border-radius: 100%;
		color: var(--header);
		background-color: var(--background);

		font-size: 4rem;
		/* font-weight: bolder; */
		box-shadow: var(--shadow) inset;

		animation: 2s infinite alternate blob;
	}

	@keyframes blob {
		from {
			width: 80px;
			height: 80px;
		}

		to {
			width: 100px;
			height: 100px;
		}
	}
</style>
