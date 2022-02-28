<template>
	<div class="tetris">
		<div class="field">
			<div
				v-for="(line, index) in field.slice(2)"
				class="line"
				:key="index"
			>
				<div
					v-for="(cell, index) in line"
					class="cell"
					v-bind:class="[cell.class, { placed: cell.isPlaced }]"
					:key="index"
				></div>
			</div>
		</div>

		<div class="results">
			<div class="lines">
				Lines: {{ lines }}
				<hr />
			</div>
			<div class="score">Score: {{ score }}</div>
		</div>
	</div>
</template>

<script>
import Block from "./modules/block";

const width = 10;
const height = 20;
const levelInterval = [
	1440,
	1260,
	1140,
	960,
	840,
	660,
	540,
	480,
	420,
	360,
	340,
	320,
	300,
	280,
	260,
	240,
	220,
	200,
	180,
	160,
	140,
	120,
	110,
	100,
	90,
	85,
	80,
	75,
	70,
	65,
	60
];

const make_new_line = () =>
	[...Array(width)].map(() => {
		return { class: "empty", isPlaced: false };
	});

export default {
	data: () => {
		return {
			field: [],
			score: 0,
			lines: 0,
			nextBlock: []
		};
	},
	methods: {
		init: function() {
			this.field = [...Array(height)].map(make_new_line);
			this.score = 0;
			this.lines = 0;
			this.nextBlock = [];
			this.endGame = false;
			this.popBlock();
			this.moveDown();
		},

		getLevel: function() {
			const level = Math.floor(this.lines / 10);
			if (level >= 30) return 30;
			return level;
		},

		popBlock: function() {
			while (this.nextBlock.length < 12) {
				this.nextBlock = this.nextBlock.concat(
					Block.concat(Block)
						.sort(() => Math.random() - 0.5)
						.map(Block => new Block(width / 2, 0))
				);
			}
			this.playerBlock = this.nextBlock.shift();
			if (this.checkCollision()) {
				this.endGame = true;
			}
		},

		moveDown: function() {
			if (this.endGame) return;
			if (this.timer) clearTimeout(this.timer);
			let doPopBlock = false;
			this.playerBlock.y++;
			if (this.checkCollision()) {
				this.playerBlock.y--;
				this.playerBlock.getPoints().forEach(p => {
					this.field[p.y][p.x].isPlaced = true;
				});
				doPopBlock = true;
			}
			let erasedLines = 0;
			const new_field = [];
			for (let i = 0; i < this.field.length; i++) {
				if (this.field[i].every(cell => cell.isPlaced)) {
					erasedLines++;
				} else {
					new_field.push(this.field[i]);
				}
			}
			this.lines += erasedLines;
			this.score +=
				[0, 10, 20, 30, 40][erasedLines] * (this.getLevel() + 1);
			while (new_field.length < height) {
				new_field.unshift(make_new_line());
			}
			this.field = new_field;
			if (doPopBlock) {
				this.popBlock();
			}
			this.render();
			this.timer = setTimeout(
				this.moveDown,
				levelInterval[this.getLevel()]
			);
		},

		moveHorizon: function(toRight) {
			if (this.endGame) return;
			const x = toRight ? 1 : -1;
			this.playerBlock.x += x;
			if (this.checkCollision(this.playerBlock)) {
				this.playerBlock.x -= x;
			}
			this.render();
		},

		rotate: function() {
			if (this.endGame) return;
			this.playerBlock.rotate(1);
			if (this.checkCollision(this.playerBlock)) {
				this.playerBlock.rotate(-1);
			}
			this.render();
		},

		checkCollision: function() {
			const points = this.playerBlock.getPoints();
			for (let i = 0; i < points.length; i++) {
				const line = this.field[points[i].y];
				if (!line) {
					return true;
				}
				const cell = line[points[i].x];
				if (!cell || cell.isPlaced) {
					return true;
				}
			}
			return false;
		},

		render: function() {
			const new_field = this.field.map(line =>
				line.map(cell => {
					if (!cell.isPlaced) {
						cell.class = "empty";
					}
					return cell;
				})
			);
			this.playerBlock.getPoints().forEach(p => {
				new_field[p.y][p.x].class = this.playerBlock.class;
			});
			this.field = new_field;
		}
	}
};
</script>

<style scoped>
.tetris {
	display: inline-block;
	border: #e2e8f0 4px;
	border-style: solid;
	box-shadow: #44403c 1px 1px 10px;
}

.field {
	float: left;
}

.line {
	overflow: hidden;
}

.cell {
	width: 36px;
	height: 36px;
	border: #cbd5e1 dotted thin;
	float: left;
}

.cell.placed {
	border: var(--main-bg-color) solid thin;
}

.cell.empty {
	background-color: var(--cell-bg-color);
}

.cell.I {
	background-color: #0ea5e9dd;
}

.results {
	display: flex;
	flex-direction: column;
	margin: auto;
	padding: 10px 10px 10px 10px;
	font-size: 24px;
	font-family: "Pacifico", monospace;
	color: #e11d47dd;
	text-shadow: #44403c 1px 2px 3px;
}

@media screen and (max-width: 768px) {
	.cell {
		width: 20px;
		height: 20px;
	}
}
</style>
