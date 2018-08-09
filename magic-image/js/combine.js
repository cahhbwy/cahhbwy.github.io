let combine = function (sketch) {
    let img_h, img_w;
    let input_bright, input_dark;
    let image_bright, image_dark, image_sample;
    let cnv;
    sketch.preload = function () {
        image_bright = sketch.loadImage("image/bright.jpg");
        image_dark = sketch.loadImage("image/dark.jpg");
        image_sample = sketch.loadImage("image/sample.png")
    };
    sketch.setup = function () {
        img_w = (image_bright.width + image_dark.width) / 2;
        img_h = (image_bright.height + image_dark.height) / 2;
        let width = $("#combine").width();
        cnv = sketch.createCanvas(width, width * img_h / img_w);
        sketch.pixelDensity(img_w / width);
        cnv.parent("combine");
        input_bright = sketch.createFileInput(sketch.handleFile_bright);
        input_bright.parent("input_image_bright");
        input_dark = sketch.createFileInput(sketch.handleFile_dark);
        input_dark.parent("input_image_dark");
        sketch.noLoop();
    };
    sketch.handleFile_bright = function (file) {
        if (file.type === 'image') {
            image_bright = sketch.createImg(file.data);
            $("#bright").html("<img src=\"" + image_bright.elt.src + "\" class=\"img-thumbnail\"/>");
            image_bright.hide();
            img_w = (image_bright.width + image_dark.width) / 2;
            img_h = (image_bright.height + image_dark.height) / 2;
        }
    };
    sketch.handleFile_dark = function (file) {
        if (file.type === 'image') {
            image_dark = sketch.createImg(file.data);
            $("#dark").html("<img src=\"" + image_dark.elt.src + "\" class=\"img-thumbnail\"/>");
            image_dark.hide();
            img_w = (image_bright.width + image_dark.width) / 2;
            img_h = (image_bright.height + image_dark.height) / 2;
        }
    };
    sketch.draw = function () {
        if (image_bright && image_dark) {
            let density = sketch.pixelDensity();
            sketch.clear();
            sketch.image(image_bright, 0, 0, sketch.width, sketch.height);
            sketch.loadPixels();
            let bright = sketch.pixels;
            sketch.clear();
            sketch.image(image_dark, 0, 0, sketch.width, sketch.height);
            sketch.loadPixels();
            let dark = sketch.pixels;
            for (let i = 0; i < sketch.width * sketch.height * density * density * 4; i += 4) {
                let r = compute_ca(dark[i], dark[i + 1], dark[i + 2],
                    bright[i], bright[i + 1], bright[i + 2],
                );
                sketch.pixels[i] = r[0];
                sketch.pixels[i + 1] = r[0];
                sketch.pixels[i + 2] = r[0];
                sketch.pixels[i + 3] = r[1];
            }
            sketch.updatePixels();
        } else {
            sketch.image(image_sample, 0, 0, sketch.width, sketch.height);
        }
    };
    sketch.windowResized = function () {
        let width = $("#combine").width();
        sketch.resizeCanvas(width, width * img_h / img_w);
        sketch.pixelDensity(img_w / width);
        sketch.draw();
    };
    sketch.save = function () {
        sketch.saveCanvas(cnv, "download", "png");
    };
};

function compute_ca(r1, g1, b1, r2, g2, b2) {
    let c1 = 0.299 * r1 + 0.114 * g1 + 0.587 * b1;
    let c2 = 0.299 * r2 + 0.114 * g2 + 0.587 * b2;
    let c = 0, a = 255;
    if (255 + c1 - c2 > 0) {
        c = Math.round(255 * c1 / (255 + c1 - c2));
    }
    if (255 + c1 - c2 <= 255) {
        a = 255 + c1 - c2;
    }
    return [c, a];
}

let c = new p5(combine);

function combine_function() {
    c.windowResized();
}

function download() {
    c.save();
}