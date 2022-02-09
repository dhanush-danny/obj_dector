status = "";
objects = [];

function setup() {
    canvas = createCanvas(400, 400);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(400, 400);
    video.hide();
}

function modelLoaded() {
    console.log("Model Loaded!")
    status = true;
}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects";
    objectname = document.getElementById("obj_name").value;
}

function gotResult(error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(video, 0, 0, 380, 380);
    if (status != "") {
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status : Object Detected";

            fill("red");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("red");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);


            if (objects[i].label == objectname) {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("obj_status").innerHTML = objectname + " found";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(objectname + "found");
                synth.speak(utterThis);
            } else {
                document.getElementById("obj_status").innerHTML = objectname + " Not found";
            }
        }
    }
}