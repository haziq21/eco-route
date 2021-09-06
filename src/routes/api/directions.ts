import type { rawLeg, rawRoute, route, segment } from 'src/types/directions.type';
import { config } from './_config.js';

async function getOneMapToken() {
	// Token retrieval API URL
	const url = 'https://developers.onemap.sg/privateapi/auth/post/getToken';

	// HTTP request
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: config.ONEMAP_CREDENTIALS
	});

	const data = await res.json();

	return data.access_token;
}

export async function get({ query }) {
	// API url and query parameters
	const url = 'https://developers.onemap.sg/privateapi/routingsvc/route';
	const queryParams = [
		`start=${query.get('from')}`,
		`end=${query.get('to')}`,
		'routeType=pt',
		`date=${Intl.DateTimeFormat('en-CA').format()}`,
		`time=${Intl.DateTimeFormat('en', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format()}`,
		'mode=TRANSIT',
		`token=${await getOneMapToken()}`
	].join('&');

	const res = await fetch(`${url}?${queryParams}`);
	const data = (await res.json()).plan.itineraries;

	// if (data) {
	return {
		body: data.map(formatRoute).map(sanitiseRoute)
	};
	// }
}

function sanitiseRoute(data: route): route {
	data.segments = data.segments.reduce((currentRoute, segment) => {
		if (!currentRoute.length) {
			return [segment];
		}

		if (currentRoute[currentRoute.length - 1].mode === 'walk' && segment.mode === 'walk') {
			currentRoute[currentRoute.length - 1].distance += segment.distance;
			currentRoute[currentRoute.length - 1].duration += segment.duration;
			currentRoute[currentRoute.length - 1].endLocation = segment.endLocation;

			return currentRoute;
		}

		if (segment.startLocation === segment.endLocation) {
			return currentRoute;
		}

		return currentRoute.concat(segment);
	}, []);

	return data;
}

function formatRoute(data: rawRoute): route {
	const segments = data.legs.map(formatSegment);
	return {
		distance: segments.reduce((a, b) => a + b.distance, 0),
		duration: data.duration,
		walkTime: data.walkTime,
		leaveTime: data.startTime,
		arriveTime: data.endTime,
		segments
	};
}

function formatSegment(data: rawLeg): segment {
	return {
		distance: data.distance,
		duration: (data.endTime - data.startTime) / 1000,
		mode: {
			WALK: 'walk',
			BUS: 'bus',
			SUBWAY: 'mrt'
		}[data.mode],
		modeIdentity: data.route,
		startLocation: data.from.name,
		endLocation: data.to.name,
		intermediateStops: data.numIntermediateStops
	};
}
