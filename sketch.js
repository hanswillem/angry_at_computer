// when sketch is loaded webcam should start
// press 'q' to record a 'angry face' image
// press 'w' to record a 'happy face' iamge
// press 't' to train the ml5 model
// after training finished a label appears


let capture;
let featureExtractor;
let classifier;
let label;
let angry_counter, happy_counter;
let training_started;


function modelLoaded() {
  console.log('model loaded');
}

function videoReady() {
  console.log('video ready');
}


function whileTraining(loss) {
  if (loss == null) {
    hudString = '';
    classifier.classify(gotResults);
  } else {
    hudString = 'q = sad [ ' + angry_counter + ' ] | w = happy [ ' + happy_counter + ' ] | loss = ' + loss;
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
  training_started = false;
  capture = createCapture(VIDEO);
  capture.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  classifier = featureExtractor.classification(capture, videoReady);
}


function draw() {
  background(200);
  image(capture, 0, 0);
  drawHud();
}


function drawHud() {
  let hudStrimg;
  if (!training_started) {
    hudString = 'q = sad [ ' + angry_counter + ' ] | w = happy [ ' + happy_counter + ' ] | t = train model';
  }
  textStyle(NORMAL);
  text(hudString, 10, 500);
  if (label) {
    labelString = 'label: ' + label;
    textStyle(BOLD);
    text(labelString, 10, 500);
  }
}


function keyPressed() {
  // if key = 'q'
  if (keyCode == 81) {
    classifier.addImage('angry');
    angry_counter ++;
  }
  // if key = 'w'
  if (keyCode == 87) {
    classifier.addImage('happy');
    happy_counter ++;
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
