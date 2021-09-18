import { DATAMALL_KEY } from '$lib/env';
import { sortBusNumbers } from '$lib/utilities';
import type { rawService } from '$lib/types';

export async function get(): Promise<{ body: string[] }> {
	const services = await fetchData();
	// Remove duplicates in services
	const formattedServices = [...new Set(services.map((service) => service.ServiceNo))];

	return {
		// Sort by bus number
		body: formattedServices.sort(sortBusNumbers)
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
