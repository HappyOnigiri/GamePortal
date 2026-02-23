export interface SushiDef {
	name: string;
	reading: string;
}

export interface SushiGroup {
	id: string;
	readings: string[];
}

export interface ActiveSushi {
	id: number;
	def: SushiDef;
	patterns: string[];
	matchIndices: number[];
	x: number;
	y: number;
	el: HTMLElement;
	captured: boolean;
	capturedAt: number;
}

export interface TaishoLine {
	trigger: string;
	lines: {
		ja: string[];
		en: string[];
	};
}

export interface RankDef {
	minScore: number;
	name: {
		ja: string;
		en: string;
	};
	emoji: string;
	taisho: {
		ja: string[];
		en: string[];
	};
}
