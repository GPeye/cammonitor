import WebcamConnector from "./components/webcam.js";

window.onload = () => {
    try{
        new WebcamConnector();
    } catch (e) {
        console.log(e);
    }
}