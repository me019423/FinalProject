var serial; // variable to hold an instance of the serialport library

let portName = "/dev/tty.usbmodem141201";
var inData;
let pot;
let force;

let Lulu;
let Sona;
let heart;

let ground;
let groundH = 600 - 107;
let obstacles;
let prevposition = 0;
let currposition = 0;

let end = false;
let gameOver = false;

let startTime=0;
let endTime=0;


function setup() {
  createCanvas(600, 600);


  // Serial monitor stuff
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port


  // game setup
  ground = createSprite(300, height - 25, width, 50);
  obstacles = new Group();
  startTime=millis();

  //Character setup
  Lulu = createSprite(50, (height - 107), 100, 100);
  Lulu.addAnimation("still", 'Lulu.png');
  Lulu.addAnimation('walking', 'Lulu.png', 'Assets/sadgirlrobot3.png');
  girl.addAnimation('jumping', 'Lulu.png');
  girl.addAnimation("happy walking", 'Lulu.png','Lulu.png','Lulu.png');
  girl.addAnimation("happy still", 'Lulu.png','Lulu.png');
  girl.scale -= 0.85;
  
  
  heart = loadImage( 'heart.png');
  heart.scale += 0.85;
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  inData = serial.readLine();
  if (inData) {
    let data = inData.split(",");
    force = Number(data[0]);
    pot = map(Number(data[1]), 0, 167, 50, width - 50);
    
  //console.log(pot,force);
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

function draw() {
  background(0);
  
  if (!gameOver) {

    //spawn blocks
    if (frameCount % 60 == 0) {
      var obH = random(50, 150);
      currposition = ground.position.x + prevposition * (random(50, 65) / 100) + width;
      var ob = createSprite(currposition, groundH + 57 - (obH / 2), 50, obH);
      prevposition = currposition;
      obstacles.add(ob);
    }

  
    //get rid of passed blocks
    for (var i = 0; i < obstacles.length; i++) {

      // remove blocks off the screen
      if (obstacles[i].position.x < lulu.position.x - width) {
        obstacles[i].remove();
      }
    }

    //check for overlap
    if (girl.overlap(obstacles)) {
    
        updateSprites(false);
        gameOver=true;
    }

    //update sprite's position
    Lulu.position.x = camera.position.x - width / 2 + pot;
    Lulu.position.y = (height - 107) - force;
    if (force === 0) {
      if (pot === 0) {
        Lulu.changeAnimation("still");
      } else {
        Lulu.changeAnimation("walking");
      }
    } else {
      Lulu.changeAnimation('jumping');
    }


  } 
  else {
    background("red");
    noLoop();
    
    if (end===true)
  {
    //print("end");
    background("green");
    // girl.changeAnimation("happy still");
    // girl.position.x= ground.position.x +width/4;
    // girl.scale-=0.26;
    // boy.changeAnimation("happy still");
    // boy.position.x= width- width/4;
    // image(heart, camera.position.x+width/4,300,100,100);
    
    //animation(heart, 100, 150);
  }
  }
  
  endTime= millis();
  if (endTime-startTime>=30000)
  {
    gameOver=true;
    //console.log("Here");
    end=true;
  }
  fill(255);
  text(30-int((endTime-startTime)/1000), ground.position.x - width / 2 + 10, 30);
  drawSprites();

  camera.position.x += 2;

  //keep moving ground
  if (camera.position.x > ground.position.x)
    ground.position.x += (camera.position.x - ground.position.x);
}