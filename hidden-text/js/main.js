let fontsize = 32;
let postion = {"x": 300, "y": 200};
let bc = "#000000";

function compute_ca(c1, c2) {
    let c = 0, a = 255;
    if (255 + c1 - c2 > 0) {
        c = Math.round(255 * c1 / (255 + c1 - c2));
    }
    if (255 + c1 - c2 <= 255) {
        a = 255 + c1 - c2;
    }
    return [c, a];
}

let OnlyText = function (sketch) {
    let cnv;
    let showed, hidden;
    sketch.setup = function () {
        cnv = sketch.createCanvas(600, 400);
        cnv.parent("panel-1");
        sketch.textAlign(sketch.CENTER, sketch.BASELINE);
        sketch.frameRate(1);
    };
    sketch.draw = function () {
        let text, line_height, base;
        let density = sketch.pixelDensity();
        sketch.textSize(fontsize);
        line_height = sketch.textAscent() + sketch.textDescent();

        sketch.push();
        sketch.scale(1 / density);
        sketch.clear();
        base = postion.y;
        sketch.background(sketch.color("#FFFFFF"));
        text = $("#showed").val().split("\n");
        sketch.fill(sketch.color("#7F7F7F"));
        for (let line of text) {
            sketch.text(line, postion.x, base);
            base += line_height;
        }
        sketch.loadPixels();
        showed = sketch.pixels;

        sketch.clear();
        base = postion.y;
        sketch.background(sketch.color("#7F7F7F"));
        text = $("#hidden").val().split("\n");
        sketch.fill(sketch.color("#000000"));
        for (let line of text) {
            sketch.text(line, postion.x, base);
            base += line_height;
        }
        sketch.loadPixels();
        hidden = sketch.pixels;

        for (let i = 0; i < sketch.width * sketch.height * density * density * 4; i += 4) {
            let r = compute_ca(hidden[i], showed[i]);
            sketch.pixels[i] = r[0];
            sketch.pixels[i + 1] = r[0];
            sketch.pixels[i + 2] = r[0];
            sketch.pixels[i + 3] = r[1];
        }
        sketch.updatePixels();
        sketch.pop();
    };
    sketch.windowResized = function () {
        let width = $("#panel-1").width();
        sketch.resizeCanvas(width, width * 4 / 6);
        sketch.pixelDensity(600 / width);
    };
    sketch.save = function () {
        sketch.saveCanvas(cnv, "download", "png");
    };
};

let WithMeme = function (sketch) {
    let cnv;
    let showed, hidden;
    let input_meme, meme;
    sketch.setup = function () {
        cnv = sketch.createCanvas(600, 400);
        cnv.parent("panel-2");
        sketch.textAlign(sketch.CENTER, sketch.BASELINE);
        input_meme = sketch.createFileInput(sketch.handleFile);
        input_meme.parent("panel-2");
        sketch.frameRate(1);
    };
    sketch.handleFile = function (file) {
        if (file.type === 'image') {
            meme = sketch.createImg(file.data);
            sketch.windowResized();
            meme.hide();
        }
    };
    sketch.draw = function () {
        let text, line_height, base;
        let density = sketch.pixelDensity();
        sketch.textSize(fontsize);
        line_height = sketch.textAscent() + sketch.textDescent();

        sketch.push();
        sketch.scale(1 / density);

        sketch.clear();
        base = postion.y;
        sketch.background(sketch.color("#FFFFFF"));
        if (meme) {
            sketch.image(meme, 0, 0, cnv.width * density, cnv.height * density);
        }
        text = $("#showed").val().split("\n");
        sketch.fill(sketch.color("#000000"));
        for (let line of text) {
            sketch.text(line, postion.x, base);
            base += line_height;
        }
        sketch.loadPixels();
        showed = sketch.pixels;

        sketch.clear();
        base = postion.y;
        sketch.background(sketch.color("#FFFFFF"));
        if (meme) {
            sketch.image(meme, 0, 0, cnv.width * density, cnv.height * density);
        }
        text = $("#hidden").val().split("\n");
        sketch.fill(sketch.color("#000000"));
        for (let line of text) {
            sketch.text(line, postion.x, base);
            base += line_height;
        }
        sketch.loadPixels();
        hidden = sketch.pixels;

        for (let i = 0; i < sketch.width * sketch.height * density * density * 4; i += 4) {
            let r = compute_ca(hidden[i] / 2, showed[i] / 2 + 127);
            sketch.pixels[i] = r[0];
            sketch.pixels[i + 1] = r[0];
            sketch.pixels[i + 2] = r[0];
            sketch.pixels[i + 3] = r[1];
        }
        sketch.updatePixels();
        sketch.pop();
    };
    sketch.windowResized = function () {
        let width = $("#panel-1").width();
        if (meme) {
            sketch.resizeCanvas(width, width * meme.height / meme.width);
        } else {
            sketch.resizeCanvas(width, width * 4 / 6);
        }
        sketch.pixelDensity(600 / width);
    };
    sketch.save = function () {
        sketch.saveCanvas(cnv, "download", "png");
    };
};

let ot = new p5(OnlyText);
let wm = new p5(WithMeme);

setTimeout(function () {
    ot.windowResized();
}, 1000);
setTimeout(function () {
    wm.windowResized();
}, 1000);

function changeColor(v) {
    if (v === 0) {
        $("#bg").css("background-color", "#000000");
    } else {
        $("#bg").css("background-color", "#FFFFFF");
    }
}

function move(v) {
    switch (v) {
        case 0:
            postion.y -= 5;
            break;
        case 1:
            postion.y += 5;
            break;
        case 2:
            postion.x -= 5;
            break;
        case 3:
            postion.x += 5;
            break;
        default:
            break;
    }
}

function fs_scale(v) {
    if (v === 0) {
        fontsize -= 2;
    } else {
        fontsize += 2;
    }
}

function download() {
    if ($("#panel-1").hasClass("active")) {
        ot.save();
    } else {
        wm.save();
    }
}
