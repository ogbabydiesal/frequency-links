let socket = io();
let playing = false;

function preload() {
    img = loadImage('holdinghands.png');
}

function sendFreq(){
    const data = [nameField.value(), freqInput.value()]
    socket.emit("frequency", data);
    console.log(data);
}

socket.on('freqResponse', (data) => {
    console.log(data);
    freqState.html(data[0] + " changed the frequency to " + data[1]);
    oscillator.freq(data[1], 0.250);
});

//log new users as they come into the room
socket.on('response', (data) => {
    console.log(data);
    freqState.html(data + " joined the room");
});

socket.on('trigger', (data) => {
    console.log(data[0]);
    console.log(data[1]); 
});

function submit() {
    socket.emit("name", nameField.value());
    freqState.html('idle...');
    oscillator.start();
    playing = true;
}

async function setup() {
    createCanvas(400, 400);
    background(255, 255, 255, 0);
    imageMode(CENTER);
    image(img, width / 2, height / 2, 400, 400);
    noStroke();
    //create name field and button
    //create instruction text
    instruction = createP('enter your handle to begin');
    instruction.id('instruction');
    instruction.position(10, 170);
    nameField = createInput();
    nameField.id('name');
    nameField.attribute('placeholder', 'enter your handle');
    nameField.position(10, 10);
    submitButton = createButton('submit');
    submitButton.id('submit');
    submitButton.position(nameField.x + nameField.width + 10, 10);
    submitButton.mousePressed(submit);

    //create inputStuff section
    inputStuff = createDiv();
    inputStuff.id('inputStuff');
    inputStuff.position(10, 250);
    //create frequency input and button
    freqInput = createInput();
    freqInput.id('frequency');
    freqInput.attribute('placeholder', 'enter a frequency');
    freqInput.position(10, 50);
    sendButton = createButton('send');
    sendButton.id('send');
    sendButton.position(freqInput.x + freqInput.width + 10, 50);
    sendButton.mousePressed(sendFreq);
    //create play button
    buttonEl = createButton('stop');
    buttonEl.mousePressed(play);
    buttonEl.id('buttonText');
    buttonEl.position(10, 90);
    //create frequency state text
    freqState = createP('idle...');
    freqState.class('freqState');
    freqState.style('width', '400px');
    freqState.position(10, 130);

    //create name stuff section
    nameStuff = createDiv();
    nameStuff.id('nameStuff');
    nameStuff.position(10, 210);
    nameStuff.child(nameField);
    nameStuff.child(submitButton);
    //create input stuff section
    inputStuff.child(buttonEl);
    inputStuff.child(freqState);
    inputStuff.child(freqInput);
    inputStuff.child(sendButton);
    //create title
    title = createElement('h1', 'frequency links');
    title.position(10, -10);
    title.class('title');
    //create subtitle
    subtitle = createElement('p', 'a multi-person audio work');
    subtitle.position(10, 25);
    subtitle.class('subtitle');
    //attribution
    attribution = createElement('p', 'by Tommy (2023)');
    attribution.position(10, 35);
    attribution.class('attribution');
    //create a p5 sound oscillator
    oscillator = new p5.Oscillator(440, "square");
    oscillator.amp(0.33);
    del = new p5.Delay(0.210, 0.66);
    oscillator.disconnect();
    oscillator.connect(del);
}

function play() {
    if (!playing) {
        oscillator.start();
        playing = true;
        buttonEl.html('stop');
    } else {
        oscillator.stop();
        playing = false;
        buttonEl.html('play');
    }
}