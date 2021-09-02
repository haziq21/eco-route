async function getOneMapToken() {
	console.log('getting OM token');
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
	console.log('token got');

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

	console.log(`${url}?${queryParams}`);
	const res = await fetch(`${url}?${queryParams}`);
	console.log('res got');
	// console.log(await res.clone().text());
	// console.log('res cloned');
	const data = await res.json();
	console.log('data got');

	// if (data) {
	return {
		body: {
			data
		}
	};
	// }
}
