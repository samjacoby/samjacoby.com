(function () {

    var root = this;
    var canvas = root.document.getElementById('spice');
    var ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var firebase = new Firebase("https://burning-torch-5616.firebaseio.com/squares/");

    // track mouse movement 
    var mousedown, touchdown; 

    var saveButton = root.document.getElementById('save');
    var clearButton = root.document.getElementById('clear');
    //var libraryButtons = root.document.getElementsByClassName('image_button');

    saveButton.onclick = function() {
        createImage();
    }

    clearButton.onclick = function() {
        clearCanvas();
    }

    // mouse bindings
    canvas.onclick = function(event) {
        draw(event.clientX, event.clientY);
    }

    canvas.onmousedown = function(event) {
        mousedown = true;
    }

    canvas.onmouseup = function(event) {
        mousedown = false;
    }

    canvas.onmousemove = function(event) {
        if(mousedown) {
            draw(event.clientX, event.clientY);
        }
    }

    // phone & tablet events
    canvas.addEventListener("touchstart", function() {
        touchdown = true;
        event.preventDefault();
    }, false);

    canvas.addEventListener("touchend", function() {
        touchdown = false;
        event.preventDefault();
    }, false);

    canvas.addEventListener("touchmove", function(event) {
        if(touchdown) {
            var arrLength = event.touches.length;
            for(var i = 0; i < arrLength; i++ ) {
                var touch = event.touches[i];
                draw(touch.clientX, touch.clientY);
            }
        }
        event.preventDefault();
    }, false);

    // draw your basic rectangle
    var draw = function(x, y) {
        ctx.fillStyle = getRndColor(); 
        ctx.fillRect(x - 10, y- 10, 20, 20);
    }

    // create new image
    var createImage = function() {
        var dataURL = currentImage().src;
        if(activeImage in libraryData) {
            libraryData[activeImage] = { 'image': dataURL };
            var ref = firebase.child(activeImage)
            ref.update({ image: dataURL }, function(error) {
                if(error) {
                  alert(error);
                } else {
                  saveButton.innerHTML = 'Saved.';
                  window.setTimeout(function() {
                    saveButton.innerHTML = 'Save';
                  }, 2000);
                }
            });
        } else {
          var newImage = firebase.push({ image: dataURL }, function(error) {
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
    }

    // fetch all images

    var val = 1;
    function createElementFromSnapshot(snapshot) {
        var a = document.createElement('a');
        a.setAttribute('class', 'image_button');
        a.setAttribute('id', snapshot.key());
        a.innerHTML = val++; 
        a.addEventListener('click', drawImage, false); 
        document.getElementById('library').appendChild(a);
    }

    // draw saved image to canvas
    var activeImage;
    function drawImage() {
        var buttons = document.getElementsByClassName('image_button') 
        var button_length = buttons.length
        for(var i=0;i < button_length; i++) {
          buttons[i].setAttribute('class','image_button') 
        }
        this.setAttribute('class', 'selected image_button');
        activeImage = this.id; 
        if(this.id in libraryData) {
            loadImage(libraryData[this.id]['image'])
        }
    }
    
    // fetch all images from firebase reference
    var libraryData = [];
    var fetchImages = function() {
      firebase.on('child_added', function(snapshot) {
        key = snapshot.key()
        imageData = snapshot.val();
        libraryData[key] = imageData

        createElementFromSnapshot(snapshot);
      });
    }

    fetchImages();

    // fetch specific image from firebase
    //var fetchImage = function() {
        //firebase.on('value', function(snapshot) {
            //var data = snapshot.val();
            //loadImage(data.image)
        //});
    //}

    // and do it
    // fetchImage();

    // update to firebase
    var updateImage = function() {
      var imageRef =  firebase.child(key);
      var dataURL = currentImage().src;
      imageRef.update({ image: dataURL })
    }

    var clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    var loadImage = function(imagesrc) {
        var image = new Image();
        image.src = imagesrc; 
        image.onload = function () {
          clearCanvas();
          ctx.drawImage(image, 0, 0);
        }
    }

    var currentImage = function() {
        return { width: canvas.width, height: canvas.height, src: canvas.toDataURL() };
    }; 

    
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
                loadImage(image.src);
              }, 100);
        }
    }

    // redraw canvas on window resize
    window.addEventListener('resize', resizeWindow, false);

}).call(this);



