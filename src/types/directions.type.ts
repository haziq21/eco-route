export interface rawRoute {
	duration: number;
	legs: rawLeg[];
}

export interface rawLeg {
	distance: number;
	startTime: number;
	endTime: number;
	mode: 'WALK' | 'BUS' | 'SUBWAY';
	route: string;
}

export interface route {
	distance: number;
	duration: number;
	segments: segment[];
}

export interface segment {
	distance: number;
	duration: number;
	mode: 'walk' | 'bus' | 'mrt';
	modeIdentity: string;
}
