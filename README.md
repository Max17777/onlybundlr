## Project Setup

### React

```console
mkdir onlybundlr
cd onlybundlr
npx create-react-app .
npm install react-router-dom
npm install react-icons
npm install filereader-stream
```

### Tailwind

https://tailwindcss.com/docs/guides/create-react-app

```console
npm install -D tailwindcss
npx tailwindcss init
```

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Lens

```console
npm install wagmi @lens-protocol/wagmi
```

TODO: Gated pubs

### Bundlr

https://docs.bundlr.network/recipes/bundlr-react

```console
npm install @bundlr-network/client
npm install react-app-rewired
npm install --save-dev --force crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
npm install --force browserify-zlib path-browserify path
```

config-overrides.js

```js
const webpack = require("webpack");
module.exports = function override(config) {
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
		crypto: require.resolve("crypto-browserify"),
		stream: require.resolve("stream-browserify"),
		assert: require.resolve("assert"),
		http: require.resolve("stream-http"),
		https: require.resolve("https-browserify"),
		os: require.resolve("os-browserify"),
		url: require.resolve("url"),
		zlib: require.resolve("browserify-zlib"),
	});
	config.resolve.fallback = fallback;
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		}),
	]);
	config.module.rules = [
		...config.module.rules,
		{
			test: /\.m?js/,
			resolve: {
				fullySpecified: false,
			},
		},
	];
	return config;
};
```

package.json

Change this

```json
"scripts": {
   "start": "react-scripts start",
   "build": "react-scripts build",
   "test": "react-scripts test",
   "eject": "react-scripts eject"
 },
```

To This

```json
"scripts": {
   "start": "react-app-rewired start",
   "build": "react-app-rewired build",
   "test": "react-app-rewired test",
   "eject": "react-scripts eject"
},
```
