function initial() {
    document.getElementById('checkjs').style.display = 'none';
    document.getElementById('main').style.display = '';
    start();
}
// resize
var ctx;
var paddingSize;
var grid_size;
var CanvasAutoResize = {
    draw: function () {
        ctx = canvas_maze.getContext('2d');
        var maxSize = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
        ctx.canvas.width = maxSize;
        ctx.canvas.height = parseInt(maxSize * 0.75);
    },
    initialize: function () {
        var self = CanvasAutoResize;
        self.draw();
        $(window).on('resize', function () {
            self.draw();
            show();
        });
    }
};
$(function () {
    CanvasAutoResize.initialize();
    show();
});
$('input#SIZE_X').on('mousemove change', function () {
    $('#show_SIZE_X').html($(this).val());
});
$('input#SIZE_Y').on('mousemove change', function () {
    $('#show_SIZE_Y').html($(this).val());
});
//main
var SIZE_X = 99, SIZE_Y = 99;
var IN_X, IN_Y, OUT_X, OUT_Y;
var board = [];
var Point = function (x, y) {
    this.x = x;
    this.y = y;
};
var player = new Point(0, 0);
var leaves = [];
var path = [];

function set_door(x, y, flag) {
    if (x === 0) {
        board[0][y] = true;
        board[1][y] = flag;
        if (flag) {
            leaves.push(new Point(1, y));
        }
        return true;
    } else if (x === SIZE_X - 1) {
        board[x][y] = true;
        board[x - 1][y] = flag;
        if (flag) {
            leaves.push(new Point(x - 1, y));
        }
        return true;
    } else if (y === 0) {
        board[x][0] = true;
        board[x][1] = flag;
        if (flag) {
            leaves.push(new Point(x, 1));
        }
        return true;
    } else if (y === SIZE_Y - 1) {
        board[x][y] = true;
        board[x][y - 1] = flag;
        if (flag) {
            leaves.push(new Point(x, y - 1));
        }
        return true;
    } else {
        return false;
    }
}
function growth() {
    var index = -1;
    var nerbor = [];
    var x, y;
    while (nerbor.length === 0) {
        if (leaves.length === 0) {
            return;
        }
        index = parseInt(Math.random() * leaves.length);
        x = leaves[index].x;
        y = leaves[index].y;
        if (x > 1 && !board[x - 2][y]) {
            nerbor.push(new Point(x - 2, y));
        }
        if (x < SIZE_X - 2 && !board[x + 2][y]) {
            nerbor.push(new Point(x + 2, y));
        }
        if (y > 1 && !board[x][y - 2]) {
            nerbor.push(new Point(x, y - 2));
        }
        if (y < SIZE_Y - 2 && !board[x][y + 2]) {
            nerbor.push(new Point(x, y + 2));
        }
        if (nerbor.length === 0) {
            leaves.splice(index, 1);
        }
    }
    var index_nerbor = parseInt(Math.random() * nerbor.length);
    var nx = nerbor[index_nerbor].x, ny = nerbor[index_nerbor].y;
    board[nx][ny] = true;
    board[parseInt((x + nx) / 2)][parseInt((y + ny) / 2)] = true;
    if (nerbor.length === 1) {
        leaves.splice(index, 1);
    }
    leaves.push(new Point(nx, ny));
}
function generate() {
    while (leaves.length !== 0) {
        growth();
    }
    var k = parseInt(SIZE_X * SIZE_Y / 100);
    while (--k > 0) {
        var x = parseInt(Math.random() * (SIZE_X - 2)) + 1, y = parseInt(Math.random() * (SIZE_Y - 2)) + 1;
        board[x][y] = true;
    }
}
function show() {
    ctx = canvas_maze.getContext('2d');
    paddingSize = ctx.canvas.height * 0.02;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#0000ff";
    grid_size = Math.min((ctx.canvas.width - 2 * paddingSize) / SIZE_X, (ctx.canvas.height - 2 * paddingSize) / SIZE_Y);
    for (var i = 0; i < SIZE_X; ++i) {
        for (var j = 0; j < SIZE_Y; ++j) {
            if (!board[i][j]) {
                ctx.fillRect(paddingSize + i * grid_size, paddingSize + j * grid_size, grid_size, grid_size);
            }
        }
    }
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = "#FF0000";
    ctx.arc(paddingSize + player.x * grid_size + grid_size / 2, paddingSize + player.y * grid_size + grid_size / 2, grid_size / 2.1, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    if (path.length > 0) {
        for (i = 0; i < path.length - 1; ++i) {
            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = "#00FF00";
            ctx.arc(paddingSize + path[i].x * grid_size + grid_size / 2, paddingSize + path[i].y * grid_size + grid_size / 2, grid_size / 4.1, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
        path = [];
    }
}
function start() {
    SIZE_X = $("input#SIZE_X").val();
    SIZE_Y = $("input#SIZE_Y").val();
    IN_X = 0;
    IN_Y = 1;
    OUT_X = SIZE_X - 1;
    OUT_Y = SIZE_Y - 2;
    board = [];
    leaves = [];
    path = [];
    for (var i = 0; i < SIZE_X; ++i) {
        board[i] = [];
        for (var j = 0; j < SIZE_Y; ++j) {
            board[i][j] = false;
        }
    }
    if (!(set_door(OUT_X, OUT_Y, false) && set_door(IN_X, IN_Y, true))) {
        return false;
    }
    player.x = IN_X;
    player.y = IN_Y;
    generate();
    show();
    return true;
}
function findNotExploredNerbor(p, flag) {
    var x = p.x, y = p.y;
    var nerbor = [];
    if (x > 0 && board[x - 1][y] && !flag[x - 1][y]) {
        nerbor.push(new Point(x - 1, y));
    }
    if (y > 0 && board[x][y - 1] && !flag[x][y - 1]) {
        nerbor.push(new Point(x, y - 1));
    }
    if (x < SIZE_X - 1 && board[x + 1][y] && !flag[x + 1][y]) {
        nerbor.push(new Point(x + 1, y));
    }
    if (y < SIZE_Y - 1 && board[x][y + 1] && !flag[x][y + 1]) {
        nerbor.push(new Point(x, y + 1));
    }
    if (nerbor.length === 0) {
        return new Point(-1, -1);
    }

    var minDis = SIZE_X + SIZE_Y, dis;
    var index = 0;
    for (var i = 0; i < nerbor.length; ++i) {
        dis = Math.abs(nerbor[i].x - player.x) + Math.abs(nerbor[i].y - player.y);
        if (dis < minDis) {
            index = i;
            minDis = dis;
        }
    }
    return new Point(nerbor[index].x, nerbor[index].y);
}
function help() {
    var flag = [];
    for (var i = 0; i < SIZE_X; ++i) {
        flag[i] = [];
        for (var j = 0; j < SIZE_Y; ++j) {
            flag[i][j] = false;
        }
    }
    path = [];
    path.push(new Point(OUT_X, OUT_Y));
    flag[OUT_X][OUT_Y] = true;
    flag[path[path.length - 1].x][path[path.length - 1].y] = true;
    var back = false;
    while (path.length > 0) {
        if (!back) {
            var current = path[path.length - 1];
            var nerbor = findNotExploredNerbor(current, flag);
            if (nerbor.x < 0) {
                back = true;
            } else {
                path.push(nerbor);
                flag[nerbor.x][nerbor.y] = true;
            }
        } else {
            path.pop();
            back = false;
        }
        if (path[path.length - 1].x === player.x && path[path.length - 1].y === player.y) {
            break;
        }
    }
    show();
}
function control_keyboard(event) {
    var keyID = event.keyCode ? event.keyCode : event.which;
    if (keyID === 37) { //left
        if (player.x > 0 && board[player.x - 1][player.y]) {
            --player.x;
        }
    } else if (keyID === 38) { //up
        if (player.y > 0 && board[player.x][player.y - 1]) {
            --player.y;
        }
    } else if (keyID === 39) { //right
        if (player.x < SIZE_X - 1 && board[player.x + 1][player.y]) {
            ++player.x;
        }
    } else if (keyID === 40) { //down
        if (player.y < SIZE_Y - 1 && board[player.x][player.y + 1]) {
            ++player.y;
        }
    }
    show();
}
var useTouch = false;
function move_steps(x, y) {
    if (player.x === x) {
        if (player.y < y && board[player.x][player.y + 1]) {
            ++player.y;
            show();
            if(useTouch === false) {
                setTimeout(function () {
                    move_steps(x, y);
                }, 20);
            }
        } else if (player.y > y && board[player.x][player.y - 1]) {
            --player.y;
            show();
            if(useTouch === false) {
                setTimeout(function () {
                    move_steps(x, y);
                }, 20);
            }
        }
    } else if (player.y === y) {
        if (player.x < x && board[player.x + 1][player.y]) {
            ++player.x;
            show();
            if(useTouch === false) {
                setTimeout(function () {
                    move_steps(x, y);
                }, 20);
            }
        } else if (player.x > x && board[player.x - 1][player.y]) {
            --player.x;
            show();
            if(useTouch === false) {
                setTimeout(function () {
                    move_steps(x, y);
                }, 20);
            }
        }
    }
}
function control_mouse(event) {
    var pos_x = Math.floor((event.offsetX - paddingSize) / grid_size);
    var pos_y = Math.floor((event.offsetY - paddingSize) / grid_size);
    move_steps(pos_x, pos_y);
}
var lastX, lastY;
function control_touch_start(event) {
    useTouch = true;
    lastX = event.touches[0].pageX;
    lastY = event.touches[0].pageY;
}
function control_touch_move(event) {
    event.preventDefault();
    var currentX = event.touches[0].pageX;
    var currentY = event.touches[0].pageY;
    var deltaX = currentX - lastX;
    var deltaY = currentY - lastY;
    if (Math.abs(deltaX) < Math.abs(deltaY)) {
        if (deltaY > 30) {
            lastX = currentX;
            lastY = currentY;
            move_steps(player.x, player.y + 1);
        } else if (deltaY < -30) {
            lastX = currentX;
            lastY = currentY;
            move_steps(player.x, player.y - 1);
        }
    } else {
        if (deltaX > 30) {
            lastX = currentX;
            lastY = currentY;
            move_steps(player.x + 1, player.y);
        } else if (deltaX < -30) {
            lastX = currentX;
            lastY = currentY;
            move_steps(player.x - 1, player.y);
        }
    }
}
function control_touch_end(event) {
    useTouch = false;
}
canvas_maze.addEventListener('keydown', control_keyboard, true);
canvas_maze.addEventListener('click', control_mouse, false);
canvas_maze.addEventListener('touchstart', control_touch_start, false);
canvas_maze.addEventListener('touchmove', control_touch_move, false);
canvas_maze.addEventListener('touchend', control_touch_end, false);
canvas_maze.focus();