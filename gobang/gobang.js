let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(30, 30);

let chess_record = [];
let player = 1;
let board_status = [];
let last, current;

function draw_board() {
    ctx.beginPath();
    ctx.clearRect(-30, -30, 620, 620);
    ctx.fillStyle = "#d49f51";
    ctx.fillRect(-30, -30, 620, 620);
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.font = "20px Georgia";
    for (let i = 0; i <= 15; ++i) {
        ctx.moveTo(0, i * 40);
        ctx.lineTo(560, i * 40);
        ctx.stroke();
        ctx.moveTo(i * 40, 0);
        ctx.lineTo(i * 40, 560);
        ctx.stroke();
        ctx.fillText((i + 1 < 10 ? " " : "") + (i + 1), -25, i * 40 + 5);
        ctx.fillText(String.fromCharCode(i + 65), i * 40 - 7, -5);
    }
    ctx.closePath();
    for (let p of [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]]) {
        ctx.beginPath();
        ctx.arc(p[0] * 40, p[1] * 40, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function draw_chess(player, x, y) {
    ctx.beginPath();
    let radial = ctx.createRadialGradient(x * 40 - 5, y * 40 - 5, 3, x * 40, y * 40, 15);
    if (player === 1) {
        radial.addColorStop(0, "#444444");
        radial.addColorStop(1, "#000000");
    } else if (player === 2) {
        radial.addColorStop(0, "#FFFFFF");
        radial.addColorStop(1, "#DDDDDD");
    }
    ctx.fillStyle = radial;
    ctx.lineWidth = 0;
    ctx.arc(x * 40, y * 40, 17, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function draw_box(x, y, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.rect(x * 40 - 20, y * 40 - 20, 40, 40);
    ctx.stroke();
    ctx.closePath();
}

function draw_pre_select(x, y) {
    draw_box(x, y, "#059703")
}

function draw_last(x, y) {
    draw_box(x, y, "#a93900");
}

function initial() {
    for (let i = 0; i < 15; ++i) {
        board_status.push([]);
        for (let j = 0; j < 15; ++j) {
            board_status[i].push(0);
        }
    }
    draw_board();
}

function locate(e) {

    let rect = canvas.getBoundingClientRect();
    let x = Math.round(((e.clientX - rect.left) * (canvas.width / rect.width) - 30) / 40);
    let y = Math.round(((e.clientY - rect.top) * (canvas.height / rect.height) - 30) / 40);
    return {"x": x, "y": y};
}


function draw() {
    draw_board();
    for (let chess of chess_record) {
        draw_chess(chess.player, chess.x, chess.y);
    }
    if (current !== undefined && board_status[current.x][current.y] === 0) {
        draw_pre_select(current.x, current.y);
    }
    if (last !== undefined) {
        draw_last(last.x, last.y);
    }
}

initial();

function restart() {
    chess_record = [];
    player = 1;
    board_status = [];
    last = undefined;
    current = undefined;
    initial();
}

function redo() {
    let log_elem = document.getElementById("log");
    log_elem.removeChild(log_elem.lastElementChild);
    if (chess_record.length > 0) {
        chess_record.pop();
    }
    if (chess_record.length > 0) {
        last = chess_record[chess_record.length - 1];
    } else {
        last = undefined;
    }
    draw();
}

function write_log(player, x, y) {
    let l = document.createElement("p");
    l.innerHTML = `<p>${player === 1 ? "B" : "W"}&nbsp;:&nbsp;${String.fromCharCode(x + 65)}${y + 1}</p>`;
    let log_elem = document.getElementById("log");
    log_elem.append(l);
    log_elem.scrollTop = log_elem.scrollHeight;
}


let select_action = function (e) {
    let pos = locate(e);
    if (pos.x < 0 || pos.x > 14 || pos.y < 0 || pos.y > 14) {
        return;
    }
    if (current === undefined || current.x !== pos.x || current.y !== pos.y) {
        current = pos;
        draw();
    }
};
let click_action = function (e) {
    let pos = locate(e);
    if (pos.x < 0 || pos.x > 14 || pos.y < 0 || pos.y > 14) {
        return;
    }
    if (current !== undefined && current.x === pos.x && current.y === pos.y) {
        if (board_status[pos.x][pos.y] === 0) {
            board_status[pos.x][pos.y] = player;
            chess_record.push({"player": player, "x": pos.x, "y": pos.y});
            player = 3 - player;
            last = pos;
            draw();
            write_log(player, pos.x, pos.y);
        }
    } else {
        select_action(e);
    }
};
if (!('ontouchstart' in document.documentElement)) {
    canvas.addEventListener('mousemove', select_action, false);
}
canvas.addEventListener("click", click_action, false);
