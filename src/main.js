import Vue from "vue";
import tetris from "./components/tetris.vue";
import "./css/index.css";

const app = new Vue({
	el: "#app",
	components: {
		tetris: tetris,
	},
});

document.body.onkeydown = (e) => {
	if ([27].includes(e.keyCode)) {
		// Esc
		app.$refs.tetris.init();
	} else if ([38, 87].includes(e.keyCode)) {
		// Up (w)
		app.$refs.tetris.rotate();
	} else if ([37, 65].includes(e.keyCode)) {
		// Left (a)
		app.$refs.tetris.moveHorizon(false);
	} else if ([39, 68].includes(e.keyCode)) {
		// Right (d)
		app.$refs.tetris.moveHorizon(true);
	} else if ([40, 83].includes(e.keyCode)) {
		// Down (s)
		app.$refs.tetris.moveDown();
	}
};

app.$refs.tetris.init();
