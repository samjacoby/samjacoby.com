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
            ctx.fillRect(event.clientX - 10, event.clientY - 10, 20, 20);
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

    var fetchImage = function() {
        firebase.on('value', function(snapshot) {
            var data = snapshot.val();
            loadImage(data.image)
        });
    }

    var loadImage = function(imagesrc) {
        var image = new Image();
        image.src = imagesrc; 
        image.onload = function () {
          clearCanvas();
          ctx.drawImage(image, 0, 0);
        }
    }

    fetchImage();

    var saveImage = function() {
        var dataURL = currentImage(); 
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

    var currentImage = function() {
        return canvas.toDataURL();
    }; 

    var clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    function getRndColor() {
        var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    var resizeTimeout;
    var resizeWindow = function() {
      var image = currentImage();
      
      if(!resizeTimeout) {
          resizeTimeout = setTimeout(function() {
            resizeTimeout = false;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            loadImage(image);
          }, 100);
      }
    }

    window.addEventListener('resize', resizeWindow, false);



}).call(this);



