let preview;

let background_color = "#1289cd";
let align = "LEFT";
let content = [];
let background_image = "image/background.jpg";
let image_font_color = "#FFFFFF";
let font_color = "#FFFFFF";
let bg_height;

let Preview = function (sketch) {
    let cnv, max_width, line_num;
    let inner_content = [];
    let fontsize = 32;
    let line_height = 44;
    let bg;
    sketch.preload = function () {
        bg = sketch.loadImage(background_image);
    };
    sketch.setup = function () {
        cnv = sketch.createCanvas(600, 600);
        cnv.parent("preview_parent");
        sketch.textSize(fontsize);
        line_height = sketch.textAscent() + sketch.textDescent();
        sketch.noLoop();
        bg_height = bg.height * 600 / bg.width;
    };
    sketch.draw = function () {
        sketch.clear();
        let base;
        if (background_color !== undefined) {
            sketch.background(background_color);
            base = (Math.max(600, 100 + line_num * line_height) - line_num * line_height) / 2 + line_height / 2 + sketch.textDescent();
        } else {
            sketch.image(bg, 0, 0, cnv.width, cnv.height);
            base = (Math.max(bg_height, 100 + line_num * line_height) - line_num * line_height) / 2 + line_height / 2 + sketch.textDescent();
        }
        let density = sketch.pixelDensity();
        sketch.push();
        sketch.fill(sketch.color(font_color));
        sketch.scale(1 / density);
        if (align === "LEFT") {
            sketch.textAlign(sketch.LEFT, sketch.BASELINE);
            for (let l of inner_content) {
                sketch.text(l, (580 - max_width) / 2, base, max_width + 20);
                base += line_height;
            }
        } else if (align === "CENTER") {
            sketch.textAlign(sketch.CENTER, sketch.BASELINE);
            for (let l of inner_content) {
                sketch.text(l, 50, base, 500);
                base += line_height;
            }
        } else if (align === "RIGHT") {
            sketch.textAlign(sketch.RIGHT, sketch.BASELINE);
            for (let l of inner_content) {
                sketch.text(l, (580 - max_width) / 2, base, max_width + 20);
                base += line_height;
            }
        }
        sketch.pop();
    };
    sketch.windowResized = function () {
        max_width = 0;
        line_num = 0;
        inner_content = [];
        let start, end;
        for (let line of content) {
            start = 0;
            end = 0;
            while (start < line.length) {
                while (sketch.textWidth(line.slice(start, end + 1)) < 500 && end <= line.length) {
                    ++end;
                }
                --end;
                inner_content.push(line.slice(start, end));
                max_width = Math.max(max_width, sketch.textWidth(line.slice(start, end)));
                ++line_num;
                start = end;
            }
        }
        let parent_width = $("#preview_parent").width();
        if (background_color !== undefined) {
            sketch.resizeCanvas(parent_width, parent_width * Math.max(600, 100 + line_num * line_height) / 600);
        } else {
            sketch.resizeCanvas(parent_width, parent_width * Math.max(bg_height, 100 + line_num * line_height) / 600);
        }
        sketch.pixelDensity(600 / parent_width);
    };
};

$("textarea").on("keyup", function () {
    $(this).css("height", "auto");
    $(this).css("height", $(this).prop('scrollHeight') + "px");
    content = $("textarea").val().split("\n");
    preview.windowResized();
    preview.draw();
});

$(window).resize(function () {
    setTimeout(function () {
        preview.windowResized();
        preview.draw();
    }, 500);
});

function change_color(color) {
    background_color = color;
    let tc = parseInt(color.substr(1, 6), 16);
    let r = Math.floor(tc / 65536);
    let g = Math.floor(tc / 256) % 256;
    let b = tc % 256;
    if ((r * 0.299 + g * 0.587 + b * 0.114) > 127) {
        font_color = "#000000";
    } else {
        font_color = "#FFFFFF";
    }
    $("textarea").css("background-color", color).css("background-image", "").css("color", font_color);
    preview.draw();
}

function use_background_image() {
    background_color = undefined;
    font_color = image_font_color;
    $("textarea").css("background-image", "url(" + background_image + ")").css("background-size", "cover").css("color", font_color);
    preview.windowResized();
    preview.draw();
}

function initial() {
    let color = ["#1289cd", "#2fcd34", "#cd2519", "#cd24a8"];
    let cg = $("#color_group");
    for (let c of color) {
        cg.append("<button class=\"btn btn-default btn-color\" style=\"background-color: " + c + "\" onclick=change_color(\"" + c + "\")></button>")
    }
    preview = new p5(Preview);
    setTimeout(function () {
        preview.windowResized();
        preview.draw();
    }, 500);
}

$(document).ready(function () {
    initial();
});

$("#submit").on("click", function () {
    let data = $("canvas")[0].toDataURL('image/jpeg', 1.0).replace(/data:image\/jpeg;base64,/, '');
    $.post("process.php", {
        "data": data,
        "context": JSON.stringify(content),
        "ID": "123456789"
    }, function (result) {
        console.log(result);
    });
});
