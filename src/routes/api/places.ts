import type { place, rawPlace } from 'src/types/places.type';

export async function get({ query }) {
	// API url and query paramaters
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query.get('search')}.json`;
	const queryParams = [
		'bbox=103.59089944746998,1.165741552160555,104.10183924084397,1.4802985418613261',
		'limit=10',
		'type=address,poi',
		'access_token=pk.eyJ1IjoiaGF6aXEyMSIsImEiOiJja3NjcmxmZ2UwanB4Mnhtc2g5d3JpZmdwIn0.o-SLT-6325-0rbZs7efFrg'
	].join('&');

	const res = await fetch(`${url}?${queryParams}`);
	const data = await res.json();

	if (data.features) {
		return {
			body: {
				data: data.features.map((x) => formatPlace(x))
			}
		};
	} else {
		return {
			body: {
				data: []
			}
		};
	}
}

function formatPlace(data: rawPlace): place {
	return {
		name: data.text
	};
}
