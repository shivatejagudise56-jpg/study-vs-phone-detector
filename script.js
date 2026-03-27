const URL = "https://teachablemachine.withgoogle.com/models/6vxx3hsbk/"; 
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("canvas").replaceWith(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let highest = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    if (highest.className === "Studying") {
        labelContainer.innerHTML = "✅ You are Studying 👍";
    } else {
        labelContainer.innerHTML = "⚠️ Put phone away!";
    }
}