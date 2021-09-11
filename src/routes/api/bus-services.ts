import { DATAMALL_KEY } from '$lib/env';
import type { rawService, service } from '$lib/types';

export async function get(): Promise<{ body: service[] }> {
	const services = await fetchData();
	// Remove duplicates in services
	const formattedServices = [...new Set(services.map(formatService))];

	return {
		body: formattedServices
	};
}

async function fetchData(iteration = 0) {
	// DataMall API URL
	const url = 'http://datamall2.mytransport.sg/ltaodataservice/BusServices';

	// HTTP request
	const res = await fetch(`${url}?$skip=${iteration * 500}`, {
		headers: {
			AccountKey: DATAMALL_KEY
		}
	});
	let data: rawService[] = (await res.json()).value;

	// Recurse to retrieve more data
	if (data.length >= 500) {
		const newData = await fetchData((iteration = iteration + 1));
		data = data.concat(newData);
	}

	return data;
}

function formatService(data: rawService): service {
	return {
		number: data.ServiceNo,
		origin: data.OriginCode,
		destination: data.DestinationCode
	};
}
