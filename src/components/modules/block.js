class Block {
	constructor(x, y, points) {
		this.x = x;
		this.y = y;
		this.points = points;
	}

	rotate(angle = 0) {
		for (let i = 0; i < (angle + 4) % 4; i++) {
			this.points = this.points.map(p => {
				return { x: p.y, y: -p.x };
			});
		}
	}

	getPoints() {
		return this.points.map(p => {
			return { x: p.x + this.x, y: p.y + this.y };
		});
	}

	isBlock(x, y) {
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].x + 2 === x && this.points[i].y + 2 === y) {
				return true;
			}
		}
		return false;
	}
}

class BlockI extends Block {
	constructor(x, y) {
		super(x, y, [
			{ x: -1, y: 0 },
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 }
		]);
		this.class = "I";
	}
}

export default [BlockI];
