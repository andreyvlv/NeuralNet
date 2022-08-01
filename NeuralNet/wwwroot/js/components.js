"use strict";
var context = document.getElementById('sheet').getContext("2d");
var canvas = document.getElementById('sheet');
context = canvas.getContext("2d");
context.strokeStyle = "#000000";
context.lineJoin = "circle";
context.lineWidth = 30;

context.fillStyle = '#FFFFFF';
context.fillRect(0, 0, 400, 400);

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

function recognize() {

    var copycnv = document.createElement('canvas');
    copycnv.width = 28;
    copycnv.height = 28;
    var copyctx = copycnv.getContext("2d");
    copyctx.drawImage(canvas, 0, 0, 28, 28);


    //var ctx = document.getElementById('double').getContext("2d");
    //ctx.drawImage(copycnv, 0, 0, 28, 28);
    var pix = copyctx.getImageData(0, 0, 28, 28).data;

    var arr = [];
    for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i] = 255 - pix[i]; // red
        pix[i + 1] = 255 - pix[i + 1]; // green
        pix[i + 2] = 255 - pix[i + 2];

        var value = (Number)((pix[i].toFixed(2) * 0.3) + (pix[i + 1].toFixed(2) * 0.59) + (pix[i + 2].toFixed(2) * 0.11));
        arr.push(value);


        // blue
        // i+3 is alpha (the fourth element)
    }
    var image = {};
    image.image = arr;
    var request = new XMLHttpRequest();
    var url = "/Home/Recognize";
    request.open("POST", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var response = JSON.parse(request.responseText);           
            var paragraph = document.getElementById("result");
            paragraph.textContent = ">>>   " + response.Digit;
        }
    };
    request.send(JSON.stringify(image));

    copyctx.clearRect(0, 0, 28, 28);
    //ctx.clearRect(0, 0, 28, 28);
}

function clearcanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, 400, 400);
}


function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Redraw the complete canvas.
 */
function redraw() {
    // Clears the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (var i = 0; i < clickX.length; i += 1) {
        if (!clickDrag[i] && i == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else if (!clickDrag[i] && i > 0) {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
    }
}


function drawNew() {
    var i = clickX.length - 1
    if (!clickDrag[i]) {
        if (clickX.length == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        }
    } else {
        context.lineTo(clickX[i], clickY[i]);
        context.stroke();
    }
}

function mouseDownEventHandler(e) {
    paint = true;
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    if (paint) {
        addClick(x, y, false);
        drawNew();
    }
}

function touchstartEventHandler(e) {
    paint = true;
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
        drawNew();
    }
}

function mouseUpEventHandler(e) {
    context.closePath();
    paint = false;
}

function mouseMoveEventHandler(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    if (paint) {
        addClick(x, y, true);
        drawNew();
    }
}

function touchMoveEventHandler(e) {
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
        drawNew();
    }
}

function setUpHandler(isMouseandNotTouch, detectEvent) {
    removeRaceHandlers();
    if (isMouseandNotTouch) {
        canvas.addEventListener('mouseup', mouseUpEventHandler);
        canvas.addEventListener('mousemove', mouseMoveEventHandler);
        canvas.addEventListener('mousedown', mouseDownEventHandler);
        mouseDownEventHandler(detectEvent);
    } else {
        canvas.addEventListener('touchstart', touchstartEventHandler);
        canvas.addEventListener('touchmove', touchMoveEventHandler);
        canvas.addEventListener('touchend', mouseUpEventHandler);
        touchstartEventHandler(detectEvent);
    }
}

function mouseWins(e) {
    setUpHandler(true, e);
}

function touchWins(e) {
    setUpHandler(false, e);
}

function removeRaceHandlers() {
    canvas.removeEventListener('mousedown', mouseWins);
    canvas.removeEventListener('touchstart', touchWins);
}

canvas.addEventListener('mousedown', mouseWins);
canvas.addEventListener('touchstart', touchWins);