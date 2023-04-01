/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontFamily: {
			main: ["Roboto"],
			logo: ["Space Grotesk"],
		},
		colors: {
			background: "#FEF4EE",
			primary: "#D3D9EF",
			secondary: "#DBDEE9",
			contast: "#403F3E",
			message: "#f50505",
		},
		extend: {},
	},
	plugins: [],
};
