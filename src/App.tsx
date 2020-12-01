import React, { useState } from "react";
import "./App.css";
import { Flowpoint, Flowspace } from "flowpoints";

const unique = (function () {
	let cntr = 0;
	return function (prefix: string | null) {
		prefix = prefix || "";
		return prefix + cntr++;
	};
})();

type ContentType = {
	title: string;
	description: string;
};

type DiagramType = {
	key: string;
	startPosition: {
		x: number;
		y: number;
	};
	content: ContentType;
	outputs: Array<string> | null;
};

const dragData = [
	{
		content: {
			title: "FIRST POINT",
			description: "Hello world....",
		},
	},
	{
		content: {
			title: "SECOND POINT",
			description: "I am point b ....",
		},
	},
	{
		content: {
			title: "THIRD POINT",
			description: "I am point c ...",
		},
	},
];

const App: React.FC = () => {
	const [diagram, setDiagram] = useState<Array<DiagramType>>([]);
	const [cache, setCache] = useState<ContentType | null>(null);

	return (
		<div className='app'>
			<div
				className='app__drop-zone'
				onDragEnter={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
				onDragOver={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
				onDrop={(e: React.DragEvent<HTMLElement>) => {
					e.preventDefault();
					if (cache) {
						const newKey = unique("point_");

						const newDiagramPoint = {
							key: newKey,
							startPosition: { x: e.clientX - 20, y: e.clientY - 20 },
							content: cache,
							outputs: null,
						};
						setDiagram((prev) => {
							if (prev[prev.length - 1]) {
								prev[prev.length - 1].outputs = [newKey];
							}

							return [...prev, newDiagramPoint];
						});
					}
				}}
			>
				<Flowspace style={{ width: "100%", height: "100%" }}>
					{diagram.map((currentDiagram) => (
						<Flowpoint
							key={currentDiagram.key}
							outputs={currentDiagram.outputs}
							startPosition={currentDiagram.startPosition}
							onClick={() => false}
						>
							<div
								className='insideFlowpoint'
								onDragEnter={(e: React.DragEvent<HTMLElement>) =>
									e.preventDefault()
								}
								onDragOver={(e: React.DragEvent<HTMLElement>) =>
									e.preventDefault()
								}
								onDrop={(e: React.DragEvent<HTMLElement>) => {
									e.stopPropagation();

									if (cache) {
										const newKey = unique("point_");

										const newDiagramPoint = {
											key: newKey,
											startPosition: { x: e.clientX, y: e.clientY + 50 },
											content: cache,
											outputs: null,
										};

										setDiagram((prev) =>
											prev.map((prevElement) => {
												if (prevElement.key === currentDiagram.key) {
													return Array.isArray(prevElement.outputs)
														? {
																...prevElement,
																outputs: [...prevElement.outputs, newKey],
														  }
														: { ...prevElement, outputs: [newKey] };
												}

												return prevElement;
											})
										);

										setDiagram((prev) => [...prev, newDiagramPoint]);
									}
								}}
							>
								{currentDiagram.content.title}
							</div>
						</Flowpoint>
					))}
				</Flowspace>
			</div>
			<div className='app__drag-zone'>
				{dragData.map((dragElement, index) => {
					return (
						<div
							key={index}
							className='dragElement'
							draggable={true}
							onDragStart={() => {
								setCache(dragElement.content);
							}}
							onDragEnd={(e: React.DragEvent<HTMLElement>) => {
								e.preventDefault();
								setCache(null);
							}}
						>
							{dragElement.content.title}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default App;
