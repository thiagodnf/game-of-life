var game;

var mouseX = 0;
var mouseY = 0;
var canvas;
var ctx;
var animationSpeed = 80;
var intervalID = 0;
var cellColor = "#171717";
var gridColor = "#171717";

var maxWidth = 80;
var minWidth = 6;
var width = 20;

var isPressedButton = false;
var isRunning = false;
var isShowGrid = true;

var filename = "positions.csv";

const $modalSettings = $("#modal-examples");
const $canvas = $("canvas");

function drawCell(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x + 1, y + 1, width - 2, width - 2);
    ctx.fill();
}

function drawLine(x0, y0, x1, y1) {

    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function drawGrid() {

    let lessSize = -300;
    let plusSize = 300;

    let min = 60 + width * lessSize;
    let max = width * (plusSize * 3);

    // Horizontal Line
    for (let i = min; i <= max; i += width) {
        drawLine(min, i, max, i);
    }

    // Vertical Line
    for (let j = min; j <= max; j += width) {
        drawLine(j, min, j, max);
    }
}

function drawCells() {

    for (const cell of game.cells.values()) {

        drawCell(cell.j * width, cell.i * width, cellColor);
    };
}

function draw() {

    CanvasUtils.clearCanvas(ctx);

    if (isShowGrid) {
        drawGrid();
    }

    drawCells();
}

function step() {
    game.step();
    draw();
}

function loadPositions(positions) {

    game = new Game();

    for (const pos of positions) {

        game.toggleCell(pos.i, pos.j);
    }

    draw();
}

$(function () {

    game = new Game();

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    CanvasUtils.trackTransforms(ctx);

    resizeCanvas();

    CanvasUtils.init(canvas, ctx, function () {
        draw();
    });

    window.onerror = (errorMsg) => {
        BootBoxUtils.alert(errorMsg, "<i class=\"fas fa-exclamation-triangle me-2\"></i>Ooops...");
        return false;
    };

    function getClickPosition() {

        return {
            line: Math.floor(mouseY / width),
            column: Math.floor(mouseX / width)
        };
    }

    function resizeCanvas() {

        canvas.width = $("#panel").width();
        canvas.height = $(window).height() - $(".navbar").height() - $(".menubar").height() - $(".toolbar").height() - 60;

        draw();
    }

    function start() {

        clearInterval(intervalID);

        step();

        if (isRunning) {
            intervalID = setInterval(start, animationSpeed);
        }
    }

    $(window).resize(function () {
        resizeCanvas();
    });

    $canvas.mousemove(function (event) {

        event.preventDefault();

        var rect = canvas.getBoundingClientRect();

        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;

        let m = ctx.transformedPoint(mouseX, mouseY);

        mouseX = m.x;
        mouseY = m.y;

    }).mousedown(function (event) {

        event.preventDefault();

        isPressedButton = true;

    }).mouseup(function (event) {

        event.preventDefault();

        isPressedButton = false;

        if (isRunning) return;

        var pos = getClickPosition();

        if (pos == null) {
            return;
        }

        game.toggleCell(pos.line, pos.column);

        draw();
    });

    $canvas.css("cursor", "pointer");
    $canvas.css("background-color", "white");

    $("#startAndStop").click(function (event) {

        isRunning = !isRunning;

        if (isRunning) {

            $("#startAndStop i").addClass("bi-stop-fill").removeClass("bi-play-fill");
            $("#startAndStop span").html("Stop");

            $("#step").addClass("disabled");

            start();
        } else {

            $("#startAndStop i").addClass("bi-play-fill").removeClass("bi-stop-fill");
            $("#startAndStop span").html("Play");

            $("#step").removeClass("disabled");
        }
    });

    $("#cell-color").on("change", function (event) {

        cellColor = $(this).val();

        draw();
    });

    $("#background-color").on("change", function (event) {
        $("canvas").css("background-color", $(this).val());
    });

    $("#grid-color").on("change", function (event) {

        gridColor = $(this).val();

        draw();
    });

    $("#step").click(function (event) {
        step();
    });

    $("input[name=speed").change(function () {
        animationSpeed = this.value;
    });

    $("#menubar-view-grid").on("change", function (event) {

        event.preventDefault();

        isShowGrid = this.checked;

        draw();
    });

    $("#menubar-edit-clear-all").click(function (event) {

        BootBoxUtils.confirm("Are you sure?", "Clear All").then(() => {

            game = new Game();

            draw();
        });
    });

    $("#menubar-file-export").click(function (event) {

        event.preventDefault();

        if (game.cells.size === 0) {
            BootBoxUtils.alert("No alive cells");
            return;
        }

        FileUtils.exportToCSV(game.cells, filename);

        return false;
    });

    $(".menubar-arrange-move").click(function (event) {

        event.preventDefault();

        if(isRunning) return;

        const key = $(this).data("direction");

        game.move(key);

        draw();
    });

    $(window).keydown(function (event) {

        event.preventDefault();

        if(isRunning) return;

        const key = event.key;

        game.move(key);

        draw();
    });

    $("#form-import-csv").submit(event => {

        let csvFile = $(this).find("#csv-file").prop("files")[0];

        FileUtils.readCSV(csvFile, false, (positions) => {

            loadPositions(positions);

            $("#modal-import-csv").modal("hide");
        });

        return false;
    });

    $("#modal-examples a").click(function (event) {

        event.preventDefault();

        const file = $(this).data("file");

        filename = file.split(/(\\|\/)/g).pop();

        if (file) {

            $.get(file).then(function (data) {

                let positions = FileUtils.parseContent(data);

                loadPositions(positions);
            });
        }
    });

    $(".navbar-nav li a").on("click", function () {

        if (!$(this).hasClass("dropdown-toggle")) {
            $(".navbar-collapse").collapse("hide");
        }
    });
});
