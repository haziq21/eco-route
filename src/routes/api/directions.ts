import type { rawLeg, rawRoute, route, segment } from 'src/types/directions.type';

async function getOneMapToken() {
	// Token retrieval API URL
	const url = 'https://developers.onemap.sg/privateapi/auth/post/getToken';

	// Credentials for access token retrieval
	const credentials = {
		email: 'haziqhairil21@gmail.com',
		password: 'kcU46$^cuN'
	};

	// HTTP request
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(credentials)
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
		body: data.map(formatRoute)
	};
	// }
}

function formatRoute(data: rawRoute): route {
	const segments = data.legs.map(formatSegment);
	return {
		distance: segments.reduce((a, b) => a + b.distance, 0),
		duration: data.duration,
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
		modeIdentity: data.route
	};
}