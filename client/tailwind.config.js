module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts}"],
	darkMode: "class",
	theme: {
		extend: {
			screens: {
				xs: "500px",
			},
			fontFamily: {
				WaterBrush: ["Water Brush", "cursive"],
				Roboto: ["Roboto", "sans-serif"],
			},
			colors: {
				"main-bg-color": "rgb(134 239 172)",
				"main-bg-color-darker": "rgb(34 197 94)",
			},
		},
	},
	plugins: [],
};
