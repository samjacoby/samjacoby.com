(function () {

    var root = this;
    var canvas = root.document.getElementById('spice');
    var ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var firebase = new Firebase("https://burning-torch-5616.firebaseio.com/squares/");

    var mousedown;

    canvas.onmousemove = function(event) {
        if(mousedown) {
            ctx.fillStyle = getRndColor(); 
            ctx.fillRect(event.x - 10, event.y - 10, 20, 20);
        }
    }

    canvas.onmousedown = function(event) {
        mousedown = true;
    }

    canvas.onmouseup = function(event) {
        mousedown = false;
    }


    var saveButton = root.document.getElementById('save');
    var clearButton = root.document.getElementById('clear');
    
    saveButton.onclick = function() {
        saveImage();
    }

    clearButton.onclick = function() {
        clearCanvas();
    }

    var loadImage = function() {
        firebase.on('value', function(snapshot) {
            var image = new Image();
            var data = snapshot.val();
            image.src = data.image;
            ctx.drawImage(image, 0, 0);
        });
    }

    loadImage();

    var saveImage = function() {
        var dataURL = canvas.toDataURL();
        firebase.set({image: dataURL}, function(error) {
            if(error) {
                alert(error);
            } else {
                saveButton.innerHTML = 'Saved.';
                window.setTimeout(function() {
                    saveButton.innerHTML = 'Save';
                }, 2000);
            }
        });
    }

    var clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    function getRndColor() {
        var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }



}).call(this);



