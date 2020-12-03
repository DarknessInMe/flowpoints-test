export type ContentType = {
	title: string;
	description: string;
};

export type DragDataType = {
	content: ContentType;
	value: number;
};

export type DiagramType = {
	key: string;
	startPosition: {
		x: number;
		y: number;
	};
	value: number;
	content: ContentType;
	outputs: Array<string> | null;
};
