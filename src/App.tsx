import React, { useState } from "react";
import "./App.css";
import { Flowpoint, Flowspace } from "flowpoints";
import unique from "./utils/unique";
import { DiagramType, DragDataType } from "./AppTypes";
import validateDrop from "./utils/validation";

const dragData: DragDataType[] = [
	{
		content: {
			title: "FIRST POINT",
			description: "Hello world....",
		},
		value: 1,
	},
	{
		content: {
			title: "SECOND POINT",
			description: "I am point b ....",
		},
		value: 2,
	},
	{
		content: {
			title: "THIRD POINT",
			description: "I am point c ...",
		},
		value: 3,
	},
];

const App: React.FC = () => {
	const [diagram, setDiagram] = useState<Array<DiagramType>>([]);
	const [cache, setCache] = useState<DragDataType | null>(null);

	const dropZoneOnDropHandler = (
		e: React.DragEvent<HTMLElement>
	): void | boolean => {
		e.preventDefault();

		if (cache) {
			if (
				!validateDrop(
					diagram.length === 0 ? 0 : diagram[diagram.length - 1].value,
					cache.value
				)
			) {
				console.log("Wrong order");
				return false;
			}

			const newKey = unique("point_");

			const newDiagramPoint = {
				key: newKey,
				startPosition: { x: e.clientX - 20, y: e.clientY - 20 },
				content: cache.content,
				value: cache.value,
				outputs: null,
			};
			setDiagram((prev) => {
				if (prev[prev.length - 1]) {
					prev[prev.length - 1].outputs = [newKey];
				}

				return [...prev, newDiagramPoint];
			});
		}
	};

	const graphVertexOnDropHandler = (
		e: React.DragEvent<HTMLElement>,
		currentDiagram: DiagramType
	): void | boolean => {
		e.stopPropagation();

		if (cache) {
			const prevKey = currentDiagram.outputs
				? currentDiagram.outputs[currentDiagram.outputs.length - 1]
				: "";
			const prevValue = diagram.find((element) => element.key === prevKey);
			if (!validateDrop(prevValue ? prevValue.value : 0, cache.value)) {
				console.log("wrong order");
				return false;
			}

			const newKey = unique("point_");

			const newDiagramPoint = {
				key: newKey,
				startPosition: { x: e.clientX, y: e.clientY + 50 },
				content: cache.content,
				value: cache.value,
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
	};

	return (
		<div className='app'>
			<div
				className='app__drop-zone'
				onDragEnter={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
				onDragOver={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
				onDrop={dropZoneOnDropHandler}
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
									graphVertexOnDropHandler(e, currentDiagram);
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
								setCache({
									content: dragElement.content,
									value: dragElement.value,
								});
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
