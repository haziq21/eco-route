/* This module provides type declarations used by the APIs */

/* Types used by bus-arrivals API */

// bus-arrivals raw JSON interfaces
export interface rawBusArrival {
	EstimatedArrival: string;
	Load: 'SEA' | 'SDA' | 'LSD';
	Feature: 'WAB' | '';
	Type: 'SD' | 'DD' | 'BD';
}

export interface rawServiceArrivals {
	ServiceNo: string;
	NextBus: rawBusArrival;
	NextBus2: rawBusArrival;
	NextBus3: rawBusArrival;
}

export interface rawBusStopArrivals {
	BusStopCode: string;
	Services: rawServiceArrivals[];
}

// bus-arrivals restructured JSON interfaces
export interface busArrival {
	minutesToArrival: number;
	occupancy: 'SEA' | 'SDA' | 'LSD';
	wheelchairAccessible: boolean;
	type: 'SD' | 'DD' | 'BD';
}

export interface serviceArrivals {
	number: string;
	arrivals: busArrival[];
}

export interface namelessBusStopArrivals {
	busStopCode: string;
	services: serviceArrivals[];
}

export interface arrivals extends namelessBusStopArrivals {
	busStopName: string;
}

/* Types used by bus-services API */

// bus-services raw JSON interfaces
export type rawService = {
	ServiceNo: string;
	OriginCode: string;
	DestinationCode: string;
};

// bus-services restructured JSON interfaces
export type service = {
	number: string;
	origin: string;
	destination: string;
};

/* Types used by bus-stops API */

// bus-stops raw JSON interfaces
export interface rawBusStop {
	BusStopCode: string;
	Description: string;
	Latitude: number;
	Longitude: number;
}

// bus-stops restructured JSON interfaces
export interface busStop {
	code: string;
	name: string;
	latitude: number;
	longitude: number;
}

/* Types used by directions API */

// directions raw JSON interfaces
export interface rawLeg {
	distance: number;
	startTime: number;
	endTime: number;
	mode: 'WALK' | 'BUS' | 'SUBWAY';
	route: string;
	from: { name: string };
	to: { name: string };
	numIntermediateStops: number;
}

export interface rawRoute {
	duration: number;
	walkTime: number;
	startTime: number;
	endTime: number;
	legs: rawLeg[];
}

// directions restructured JSON interfaces
export interface segment {
	distance: number;
	duration: number;
	mode: 'walk' | 'bus' | 'mrt';
	modeIdentity: string;
	startLocation: string;
	endLocation: string;
	intermediateStops: number;
}

export interface route {
	distance: number;
	duration: number;
	walkTime: number;
	// leaveTime: number;
	arriveTime: number;
	segments: segment[];
}

/* Types used by places API */

// places raw JSON interfaces
export interface rawPlace {
	SEARCHVAL: string;
	BLK_NO: string;
	ROAD_NAME: string;
	LATITUDE: string;
	LONGITUDE: string;
}

// places restructured JSON interfaces
export interface place {
	name: string;
	address: string;
	longitude: number;
	latitude: number;
}
