import RDWrapper from "./resize-drag-wrapper.js";

export default class WebcamConnector {
    /** @type {RDWrapper[]} */
    #cams = [];
    /** @type {rdwrapper} */
    #selected;
    /** @type {{width: number, height: number}} */
    #size

    /**
     * @param {{width: number, height: number}} size 
     */
    constructor(size = { width: 1920, height: 1080 }) {
        this.#size = size;
        this.#findAndConnectVideoDevices();
    }

    #findAndConnectVideoDevices = () => {
        if (!navigator || !navigator.mediaDevices)
            throw new Error("navigator or navigator.mediaDevices does not seem to be available in this browser!");

        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'videoinput') {
                        this.#startDevice(device);
                    }
                });
            });
    }

    /**
     * @param {MediaDeviceInfo} device 
     */
    #startDevice = (device) => {
        navigator.mediaDevices.getUserMedia({
            video: {
                width: this.#size.width,
                height: this.#size.height,
                deviceId: { exact: device.deviceId },
            }, audio: true
        })
            .then(s => this.#bindToElement(s));
    }

    /**
     * @param {MediaStream} stream 
     */
    #bindToElement = (stream) => {
        var rdwrapper = new RDWrapper(document.getElementById("main"), stream, { x: this.#cams.length * 50, y: this.#cams.length * 50 });
        this.#cams.push(rdwrapper);
        rdwrapper.dragElement.addEventListener("mousedown", (e) => {
            if (e.button == 1) {
                e.preventDefault();
                let target = e.target.id.replace("draggable", "wrapper").replace("draggable", "video");
                this.#cams.forEach(c => {
                    c.defocus();
                });
                this.#cams.find(c => c.wrapperElement.id == target)?.focus();
             }
        });
    }

}