// import type { rawBusRoutePoint, busRoutes } from '$lib/types';
// import { DATAMALL_KEY } from '$lib/env';
// import fs from 'fs';
import busRouteDB from '$lib/busRoutes.json';

// This takes about 10 seconds (51 recursions)
// async function fetchRawData(iteration = 0) {
// 	// DataMall API URL
// 	const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes';

// 	// Send HTTP request
// 	const res = await fetch(`${dataMallUrl}?$skip=${iteration * 500}`, {
// 		headers: {
// 			AccountKey: DATAMALL_KEY
// 		}
// 	});
// 	let data: rawBusRoutePoint[] = (await res.json()).value;

// 	// Recurse to retrieve more data
// 	if (data.length >= 500) {
// 		const newData = await fetchRawData((iteration = iteration + 1));
// 		data = data.concat(newData);
// 	}

// 	// Return full data
// 	return data;
// }

export async function get({ params, query }) {
	// function cont() {
	// 	// Retrieve data
	// 	try {
	// 		const dataString = fs.readFileSync('busRoutes.json', 'utf8');
	// 		const fullData: busRoutes = JSON.parse(dataString);
	// 		const data = fullData[params.busNumber][`direction${query.get('direction')}`];

	// 		// Filter bus routes by service number and route direction
	// 		return { body: data };
	// 	} catch (err) {
	// 		console.log(err);
	// 		return;
	// 	}
	// }

	// // Create busRoutes.json if it has not yet been created
	// if (!fs.existsSync('busRoutes.json')) {
	// 	const data = await fetchRawData();
	// 	const formattedData = formatBusRoutes(data);
	// 	fs.writeFile('busRoutes.json', JSON.stringify(formattedData), (err) => {
	// 		if (err) console.log(err);
	// 	});
	// } else return cont();

	return {
		body: busRouteDB[params.busNumber][`direction${query.get('direction')}`]
	};
}

// function formatBusRoutes(busRoutes: rawBusRoutePoint[]): busRoutes {
// 	const formattedBusRoutes: busRoutes = {};

// 	for (let i = 0; i < busRoutes.length; i++) {
// 		const serviceNumber = busRoutes[i].ServiceNo;
// 		const routeDirection = `direction${busRoutes[i].Direction}`;
// 		const stopCode = busRoutes[i].BusStopCode;

// 		// Initialise empty bus route if needed
// 		if (!(serviceNumber in formattedBusRoutes)) {
// 			formattedBusRoutes[serviceNumber] = { direction1: [], direction2: [] };
// 		}

// 		// Add this bus stop code to the list
// 		formattedBusRoutes[serviceNumber][routeDirection].push(stopCode);
// 	}

// 	return formattedBusRoutes;
// }
