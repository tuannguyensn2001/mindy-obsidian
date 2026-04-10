import * as React from "react";

type AppProps = {
	greeting: string;
};

export function App({ greeting }: AppProps) {
	return (
		<div className="mindy-react-app">
			<p className="mindy-react-app__eyebrow">React is active</p>
			<h2 className="mindy-react-app__title">{greeting}</h2>
			<p className="mindy-react-app__body">
				This modal is rendered with React inside an Obsidian plugin.
			</p>
		</div>
	);
}
