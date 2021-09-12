import { DATAMALL_KEY } from '$lib/env';

// This takes a very long time (51 recursions)
async function fetchData(iteration = 0) {
	// DataMall API URL
	const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes';

	// Send HTTP request
	const res = await fetch(`${dataMallUrl}?$skip=${iteration * 500}`, {
		headers: {
			AccountKey: DATAMALL_KEY
		}
	});
	let data = (await res.json()).value;

	// Recurse to retrieve more data
	if (data.length >= 500) {
		const newData = await fetchData((iteration = iteration + 1));
		data = data.concat(newData);
	}

	// Return full data
	return data;
}

export async function get({ params }) {
	return {
		body: (await fetchData())
			.filter((point) => point.ServiceNo == params.busNumber && point.Direction === 1)
			.reduce((total, current) => {
				total.push(current.BusStopCode);

				return total;
			}, [])
	};
}
