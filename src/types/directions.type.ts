export interface rawRoute {
	duration: number;
	walkTime: number;
	startTime: number;
	endTime: number;
	legs: rawLeg[];
}

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

export interface route {
	distance: number;
	duration: number;
	walkTime: number;
	leaveTime: number;
	arriveTime: number;
	segments: segment[];
}

export interface segment {
	distance: number;
	duration: number;
	mode: 'walk' | 'bus' | 'mrt';
	modeIdentity: string;
	startLocation: string;
	endLocation: string;
	intermediateStops: number;
}
