// when sketch is loaded webcam should start
// press 'q' to record a 'angry face' image
// press 'w' to record a 'happy face' image
// press 't' to train the ml5 model
// after training finished a label appears
// every second the label gets checked, 
// when the label reads 'angry' an image will download


let saveBuffer = false; // when set to true images will be saved

let capture;
let featureExtractor;
let classifier;
let label;
let angry_counter, happy_counter, angry_pictures_counter;
let training_started;
let training_done;



function modelLoaded() {
  console.log('model loaded');
}

function videoReady() {
  console.log('video ready');
}


function whileTraining(loss) {
  if (loss == null) {
    hudString = '';
    training_done = true;
    classifier.classify(gotResults);
  } else {
    hudString = 'q = angry [ ' + angry_counter + ' ] | w = happy [ ' + happy_counter + ' ] | loss = ' + loss;
  }
}


function gotResults(err, results) {
  label = results;
  classifier.classify(gotResults);
}


function setup() {
  createCanvas(640, 512);
  background(0);
  fill(0);
  noStroke();
  textSize(14);
  angry_counter = 0;
  happy_counter = 0;
  angry_pictures_counter = 0;
  training_started = false;
  training_done = false;
  capture = createCapture(VIDEO);
  capture.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  classifier = featureExtractor.classification(capture, videoReady);
  setInterval(takePicture, 1000);
}


function draw() {
  background(200);
  image(capture, 0, 0);
  drawHud();
}


function drawHud() {
  let hudStrimg;
  if (!training_started) {
    hudString = 'q = angry [ ' + angry_counter + ' ] | w = happy [ ' + happy_counter + ' ] | t = train model';
  }
  textStyle(NORMAL);
  text(hudString, 10, 500);
  if (label) {
    labelString = 'label: ' + label + ' [ ' + angry_pictures_counter + ' ]';
    textStyle(BOLD);
    text(labelString, 10, 500);
  }
}


function takePicture() {
  if (label == 'angry') {
    console.log('taking angry picture');
    angry_pictures_counter++;
    let buffer = get(0, 0, 640, 480);
    if (saveBuffer) {
      buffer.save();
    }
  }
}


function keyPressed() {
  // if key = 'q'
  if (keyCode == 81) {
    classifier.addImage('angry');
    angry_counter++;
  }
  // if key = 'w'
  if (keyCode == 87) {
    classifier.addImage('happy');
    happy_counter++;
  }
  // if key = 't'
  if (keyCode == 84) {
    console.log('training');
    training_started = true;
    classifier.train(whileTraining);
  }
  // if key = 'r'
  if (keyCode == 82) {
    console.log('restarting');
    location.reload();
  }

}
