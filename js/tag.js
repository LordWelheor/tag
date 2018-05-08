'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = function () {
    function Tag() {
        _classCallCheck(this, Tag);

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
            setPos: function setPos(x, y) {
                this.x = x;
                this.y = y;
            }
        };
    }

    _createClass(Tag, [{
        key: 'setCanvas',
        value: function setCanvas(canvas) {
            this.cnv = canvas;
            this.ctx = this.cnv.getContext("2d");

            this.cnv.width = this.size * this.n + this.dist * (this.n + 1);
            this.cnv.height = this.cnv.width;
        }
    }, {
        key: 'newGame',
        value: function newGame() {
            var temp = new Array(this.count);
            var i = void 0,
                j = void 0,
                val = void 0;

            this.counter = 0;
            this.field = new Array(this.n);

            for (i = 0; i < this.count; i++) {
                temp[i] = false;
            }

            for (i = 0; i < this.n; i++) {
                this.field[i] = [];
                for (j = 0; j < this.n; j++) {
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

            for (i = 0; i < this.n; i++) {
                for (j = 0; j < this.n; j++) {
                    this.drawCell(i, j, this.field[i][j]);
                }
            }
        }
    }, {
        key: 'drawCell',
        value: function drawCell(i, j) {
            var val = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

            var x = j * (this.dist + this.size) + this.dist,
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
            this.ctx.fillRect(x, y, this.size, this.size);

            this.ctx.fillStyle = this.colorText;
            this.ctx.shadowColor = this.colorTextShadow;
            this.ctx.fillText(val, x + this.size / 2, y + this.size / 2, this.sizeText);
        }
    }, {
        key: 'onClick',
        value: function onClick(x, y) {
            var i = Math.floor(y / (this.dist + this.size)),
                j = Math.floor(x / (this.dist + this.size)),
                minX = j * (this.dist + this.size) + this.dist,
                maxX = minX + this.size,
                minY = i * (this.dist + this.size) + this.dist,
                maxY = minY + this.size;

            if (!(x > minX && x < maxX && y > minY && y < maxY)) {
                return;
            }

            var diffX = Math.abs(j - this.empty.x) === 1,
                diffY = Math.abs(i - this.empty.y) === 1;

            if (diffX && i === this.empty.y || diffY && j === this.empty.x) {
                this.moveFrom(i, j);
                this.counter++;
            }
        }
    }, {
        key: 'moveFrom',
        value: function moveFrom(i, j) {
            this.drawCell(i, j);
            this.drawCell(this.empty.y, this.empty.x, this.field[i][j]);
            this.field[this.empty.y][this.empty.x] = this.field[i][j];
            this.field[i][j] = '';
            this.empty.setPos(j, i);
        }
    }, {
        key: 'isWin',
        value: function isWin() {
            var i = void 0,
                listField = [],
                res = true;

            for (i = 0; i < this.n; i++) {
                listField = listField.concat(this.field[i]);
            }

            for (i = 0; i < this.count - 1; i++) {
                if (i + 1 != listField[i]) {
                    res = false;
                    break;
                }
            }

            return res;
        }
    }]);

    return Tag;
}();

document.addEventListener("DOMContentLoaded", function () {

    var main = {
        init: function init() {
            this.cache();
            this.events();

            this.tag.setCanvas(this.canvas);
            this.restart.click();
        },
        cache: function cache() {
            this.canvas = document.getElementById('canvas');
            this.counter = document.getElementById('counter');
            this.restart = document.getElementById('restart');
            this.message = document.getElementById('message');
            this.tag = new Tag();
        },
        events: function events() {
            this.canvas.addEventListener('click', this.onClickCanvas.bind(this));
            this.restart.addEventListener('click', this.onClickRestart.bind(this));
        },
        onClickCanvas: function onClickCanvas(ev) {
            var x = ev.offsetX,
                y = ev.offsetY;

            this.tag.onClick(x, y);
            this.counter.innerHTML = this.tag.counter;

            if (this.tag.isWin()) {
                this.message.classList.remove('_hide');
            }
        },
        onClickRestart: function onClickRestart(ev) {
            this.tag.newGame();
            this.counter.innerHTML = 0;
            this.message.classList.add('_hide');
        }
    };

    main.init();
});