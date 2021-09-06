// Types for formatted JSON data

export interface bus {
	minutesToArrival: number;
	occupancy: 'SEA' | 'SDA' | 'LSD';
	wheelchairAccessible: boolean;
	type: 'SD' | 'DD' | 'BD';
}

export interface service {
	number: string;
	arrivals: bus[];
}

export interface arrivals {
	busStopCode: string;
	services: service[];
}

// Types for unformatted (raw) JSON data

export interface rawBus {
	EstimatedArrival: string;
	Load: 'SEA' | 'SDA' | 'LSD';
	Feature: 'WAB' | '';
	Type: 'SD' | 'DD' | 'BD';
}

export interface rawService {
	ServiceNo: string;
	NextBus: rawBus;
	NextBus2: rawBus;
	NextBus3: rawBus;
}

export interface rawArrivals {
	BusStopCode: string;
	Services: rawService[];
}
