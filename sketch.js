/*
===========================================================
DRoOoWING v3
Name: Ana Lucía Carrizo
Email: carrizo.a@northeastern.edu

Instructions:
- Click and drag your mouse to draw with the circular brush.
- The brush size changes automatically over time, creating a dynamic
  drawing experience.
- Hold SHIFT to keep the brush size constant while drawing.

Brush Colors:
    R = Red
    O = Orange
    Y = Yellow
    G = Green
    B = Blue
    P = Purple

Other Functions:
    E = Eraser
    C = Clear the drawing area
    Z = Undo the previous action
    X = Redo the previous action
    S = Save your drawing as a PNG file
    M = Blend colors for darker overlaps (press again to turn off)
    Hold 

When color blending is enabled, overlapping brush strokes interact
with each other to create darker and combined color effects.

The title at the top uses Perlin noise to create subtle movement,
changes in size, and rotation, making the interface feel more playful
and organic.

The drawing tool combines user-controlled input with randomized and
procedural elements, allowing users to create interactive and
unpredictable drawings.
===========================================================
*/

// Initializing variables
let brushColor;
let brushSize;
let canvasColor;
let eraserSize = 100;
let whiteBannerHeight = 95;
let isEraser = false;
let titleHeight = whiteBannerHeight*3/4;
let letters;
let isBlendModeON = false;
let colors; 
let isSHIFTdown = false;
let isStroke = false;
let snapshots = [];
let currentSnap = 0;
let canvasWoInstructions;

// App title letters
 class Letter {
    constructor(letter, x) {
      this.letter = letter;

      this.ogX = x;
      this.ogY = titleHeight;
      this.ogSize = 50;
      
      this.x = this.ogX;
      this.y = this.ogY;
      this.size = this.ogSize;
      this.rot = 0;
      this.fillColor;

      this.xNoise = random(1000);
      this.yNoise = random(1000);
      this.sizeNoise = random(1000);
      this.rotNoise = random(1000);
    }
  }

// Setting the canvas
function setup() {
  
  // Defining variables
  brushColor = color('red');
  canvasColor = color(238, 217, 196);
  createCanvas(900, 900);
  background(canvasColor);
  angleMode(DEGREES);

  canvasWoInstructions = height - whiteBannerHeight;
  snapshots.push(get(0, whiteBannerHeight, width, canvasWoInstructions));
  
  // Letters
  letters = [new Letter("D", 450), 
           new Letter("R", 500),
           new Letter("o", 550),
           new Letter("O", 591.6),
           new Letter("o", 644.5),
           new Letter("W", 686),
           new Letter("I", 747),
           new Letter("N", 775),
           new Letter("G", 825)];

  // App available colors array
  colors = [color("red"), color("orange"), color("yellow"), color("green"), color("blue"), color("purple")];

  // Instructions
  drawBanner();
}

function draw() {

  if(!isSHIFTdown) {
    brushSize = map(sin(millis()*0.7), -1, 1, 10, 40);
  }

  if(isBlendModeON) {
    blendMode(MULTIPLY);
    }
    else {
      blendMode(BLEND);
    }

  noStroke();

  // Defining variables
  let circlesDist = dist(pmouseX, pmouseY, mouseX, mouseY);
  let brushTopEdge = mouseY - brushSize/2;
  let eraserTopEdge = mouseY - eraserSize/2;

  
  // Brush stroke
  if (mouseIsPressed && brushTopEdge >= whiteBannerHeight && !isEraser) {
    fill(brushColor);
    circle(mouseX, mouseY, brushSize);
    isStroke = true;
  }
  blendMode(BLEND);

  // Eraser stroke
  if (mouseIsPressed && isEraser && eraserTopEdge >= whiteBannerHeight) {
    if (circlesDist == 0) {
      fill(brushColor);
      circle(mouseX, mouseY, eraserSize);
    }
    else {
      fill(brushColor);
      for (let i = 0; i <= circlesDist; i += 10) {
      let x = lerp(pmouseX, mouseX, i / circlesDist);
      let y = lerp(pmouseY, mouseY, i / circlesDist);
        
        if (y - eraserSize/2 >= whiteBannerHeight) {
          circle(x, y, eraserSize);
        }
      }
    }
    isStroke = true;
  }

  // Redraw white banner and instructions
  drawBanner();
  
  // D R o O o W I N G title
  for (let l of letters) {
    l.x = map(noise(l.xNoise), 0, 1, -15, 15);
    l.y = map(noise(l.yNoise), 0, 1, -15, 15);
    l.xNoise += 0.02;
    l.yNoise += 0.02;
    l.size = map(noise(l.sizeNoise), 0, 1, l.ogSize-10, l.ogSize+10);
    l.sizeNoise += 0.02;
    l.rot = map(noise(l.rotNoise), 0, 1, -25, 25);
    l.rotNoise += 0.02;
                
    if(frameCount % 120 == 1) {
      l.fillColor = (random(colors));
    }
    
    push();
    fill(l.fillColor);
    translate(l.ogX, l.ogY);
    rotate(l.rot);
    textSize(l.size);
    text(l.letter, l.x, l.y);
    pop();
  }
}

// Key changes
function keyPressed() {
  
  if (key == 'r' || key == 'R') {
    brushColor = color('red');
    isEraser = false;
  }
  else if (key == 'o' || key == 'O') {
    brushColor = color('orange');
    isEraser = false;
  }
  else if (key == 'y' || key == 'Y') {
    brushColor = color('yellow');
    isEraser = false;
  }
  else if (key == 'g' || key == 'G') {
    brushColor = color('green');
    isEraser = false;
  }
  else if (key == 'b' || key == 'B') {
    brushColor = color('blue');
    isEraser = false;
  }
  else if (key == 'p' || key == 'P') {
    brushColor = color('purple');
    isEraser = false;
  }
  else if (key == 'e' || key == 'E') {
    brushColor = canvasColor;
    isEraser = true;
  }
  else if (key == 'm' || key == 'M') {
    if (isBlendModeON) {
      isBlendModeON = false;
    }
    else {
      isBlendModeON = true;
    }
  }
  else if (keyCode == SHIFT) {
    isSHIFTdown = true;
  }
  else if (key == 'c' || key == 'C') {
    push();
    noStroke();
    fill(canvasColor);
    rect(0, whiteBannerHeight + 0.5, width, canvasWoInstructions);
    pop();
    
    if (currentSnap != snapshots.length - 1) {
      let constSnapshots = snapshots.length - 1;
      for (currentSnap; currentSnap < constSnapshots; constSnapshots--) {
        snapshots.pop();
      }
      currentSnap = snapshots.length - 1;
    }
    snapshots.push(getPartialCanvas());
    currentSnap = snapshots.length - 1;
  }
  else if (key == 's' || key == 'S') {
    getPartialCanvas().save('My DrOoOwing', 'png');
  }

  // Redo/Undo
  if ((key == 'x' || key == 'X') && currentSnap < snapshots.length - 1) {
    image(snapshots[currentSnap+1], 0, whiteBannerHeight);
    currentSnap++;
  }
    else if ((key == 'z' || key == 'Z') && currentSnap > 0) {
      image(snapshots[currentSnap-1], 0, whiteBannerHeight);
      currentSnap--;
    }
}

function keyReleased() {
  if (keyCode == SHIFT) {
    isSHIFTdown = false;
  }
}

function mouseReleased() {
  if (isStroke) {
    if (currentSnap != snapshots.length - 1) {
      let constSnapshots = snapshots.length - 1;
      for (currentSnap; currentSnap < constSnapshots; constSnapshots--) {
        snapshots.pop();
      }
      currentSnap = snapshots.length - 1;
    }
    snapshots.push(getPartialCanvas());
    currentSnap = snapshots.length - 1;
  }
  isStroke = false;
}

function getPartialCanvas() {
  return get(0, whiteBannerHeight, width, canvasWoInstructions);
}

// Draw white banner and instructions
function drawBanner() {
  push();
  fill('white');
  stroke(1);
  rect(0, 0, width, whiteBannerHeight);
  textSize(12);
  fill('black');
  noStroke();
  text("R = Red\nO = Orange\nY = Yellow\nG = Green", 10, 40);
  text("B = Blue\nP = Purple\nE = Eraser\nC = Clear", 85, 40);
  text("Z = Undo\nX = Redo\nS = Save", 160, 40);
  text("M = Blend colors for darker overlaps\n(press M again to turn off)\nHold SHIFT = Constant brush size", 235, 40);
  push();
  textSize(14);
  text("Press these keys to change color or function:", 10, 20);
  pop();
  pop();
}