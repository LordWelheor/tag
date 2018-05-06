
class Tag {
    constructor() {
        this.size = 50;
        this.sizeText = 40;
        this.dist = 3;
        this.count = 16;
        this.colorBgd = '#ffdead';
        this.colorRect = '#666';
        this.colorText = '#fffaf0'; 
        this.colorTextShadow = '#808';

        this.empty = {
            x: 0,
            y: 0,
            setPos: function (x, y) {
                this.x = x;
                this.y = y;
            }
        }
    }

    setCanvas (canvas) {
        this.cnv = canvas;
        this.ctx = this.cnv.getContext("2d");

        const n = Math.pow(this.count, 0.5);
        this.cnv.width = this.size * n + this.dist * (n + 1);
        this.cnv.height = this.cnv.width;
        this.ctx.fillStyle = this.colorBgd;
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

        this.newGame();
    }

    newGame() {
        const n = Math.pow(this.count, 0.5);
        let i, j;

        this.empty.setPos(n-1, n-1);
        this.field = new Array(n);
        
        for (i=0; i < n; i++) {
            this.field[i] = [];
            for (j=0; j < n; j++) {
                this.field[i][j] = i * n + j + 1;
            }
        }
        this.field[this.empty.x][this.empty.y] = '';

        for (i=0; i < n; i++) {
            for (j=0; j < n; j++) {
                this.drawCell(i, j, this.field[i][j]);
            }
        }
    }

    drawCell (i, j, val='') {
        let x = j * (this.dist + this.size) + this.dist,
            y = i * (this.dist + this.size) + this.dist;

        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 5;
        this.ctx.font = this.sizeText + 'px Roboto';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        
        if (val) {
            this.ctx.fillStyle = this.colorRect;
        } else {
            this.ctx.fillStyle = this.colorBgd;
        }

        this.ctx.shadowColor = this.colorBgd;        
        this.ctx.fillRect(x , y, this.size, this.size);

        this.ctx.fillStyle = this.colorText;
        this.ctx.shadowColor = this.colorTextShadow;
        this.ctx.fillText(val, x + this.size / 2, y + this.size /2, this.sizeText);
    }

    onClick (x, y) {
        const i = Math.floor(y / (this.dist + this.size)),
              j = Math.floor(x / (this.dist + this.size)),
              minX = j * (this.dist + this.size) + this.dist,
              maxX = minX + this.size,
              minY = i * (this.dist + this.size) + this.dist,
              maxY = minY + this.size;

        if (!(x > minX && x < maxX && y > minY && y < maxY)) {
            return;
        }

        const diffX = Math.abs(j - this.empty.x) === 1,
              diffY = Math.abs(i - this.empty.y) === 1;

        if (diffX && i === this.empty.y || diffY && j === this.empty.x) {
            this.moveFrom (i, j);
        }
    }

    moveFrom (i, j) {
        this.drawCell(i, j);
        this.drawCell(this.empty.y, this.empty.x, this.field[i][j]);
        this.field[this.empty.y][this.empty.x] = this.field[i][j];
        this.field[i][j] = '';
        this.empty.setPos(j, i);
    }
}

const tag = new Tag;

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    tag.setCanvas(canvas);

    canvas.addEventListener('click', onClickCanvas);
});

function onClickCanvas (ev) {
    const x = ev.offsetX,
          y = ev.offsetY;

    tag.onClick(x, y);
}
