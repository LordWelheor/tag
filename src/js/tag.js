class Tag {
    constructor() {
        this.size = 50;
        this.sizeText = 40;
        this.dist = 3;
        this.n = 4;
        this.count = this.n * this.n;
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

    setCanvas(canvas) {
        this.cnv = canvas;
        this.ctx = this.cnv.getContext("2d");

        this.cnv.width = this.size * this.n + this.dist * (this.n + 1);
        this.cnv.height = this.cnv.width;
    }

    newGame() {
        const temp = new Array(this.count);
        let i, j, val;
               
        this.counter = 0; 
        this.field = new Array(this.n);

        for (i=0; i < this.count; i++) {
            temp[i] = false;
        }
        
        for (i=0; i < this.n; i++) {
            this.field[i] = [];
            for (j=0; j < this.n; j++) {
                do {
                    val = Math.floor(Math.random() * this.count);
                } while (temp[val]);
                
                temp[val] = true;
                this.field[i][j] = val;

                if (!val) {
                    this.field[i][j] = '';
                    this.empty.setPos(j, i);                    
                }
            }
        }

        this.ctx.fillStyle = this.colorBgd;
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

        for (i=0; i < this.n; i++) {
            for (j=0; j < this.n; j++) {
                this.drawCell(i, j, this.field[i][j]);
            }
        }
    }

    drawCell(i, j, val='') {
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
      
        this.ctx.shadowColor = '#0000';
        this.ctx.fillRect(x , y, this.size, this.size);

        this.ctx.fillStyle = this.colorText;
        this.ctx.shadowColor = this.colorTextShadow;
        this.ctx.fillText(val, x + this.size / 2, y + this.size /2, this.sizeText);
    }

    onClick(x, y) {
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
            this.counter++;
        }
    }

    moveFrom(i, j) {
        this.drawCell(i, j);
        this.drawCell(this.empty.y, this.empty.x, this.field[i][j]);
        this.field[this.empty.y][this.empty.x] = this.field[i][j];
        this.field[i][j] = '';
        this.empty.setPos(j, i);
    }

    isWin() {
        let i, listField = [], res = true;
        
        for (i=0; i < this.n; i++) {
            listField = listField.concat(this.field[i]);
        }

        for (i=0; i < this.count - 1; i++) {
            if (i + 1 != listField[i]) {
                res = false;
                break;
            }
        }

        return res;
    }
}

document.addEventListener("DOMContentLoaded", function() {

    const main = {
        init() {
            this.cache();
            this.events();

            this.tag.setCanvas(this.canvas);
            this.restart.click();
        },

        cache() {
            this.canvas  = document.getElementById('canvas');
            this.counter = document.getElementById('counter');
            this.restart = document.getElementById('restart');
            this.message = document.getElementById('message');
            this.tag     = new Tag;
        },

        events() {
            this.canvas.addEventListener('click', this.onClickCanvas.bind(this));
            this.restart.addEventListener('click', this.onClickRestart.bind(this));
        },

        onClickCanvas(ev) {
            const x = ev.offsetX,
                  y = ev.offsetY;
        
            this.tag.onClick(x, y);
            this.counter.innerHTML = this.tag.counter;

            if (this.tag.isWin()) {
                this.message.classList.remove('_hide');
            }
        },
        
        onClickRestart(ev) {
            this.tag.newGame();
            this.counter.innerHTML = 0;
            this.message.classList.add('_hide');
        }
    }

    main.init();
});
