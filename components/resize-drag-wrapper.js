export default class RDWrapper {
    /** @type {HTMLDivElement} */
    wrapperElement;
    /** @type {HTMLDivElement} */
    dragElement;
    /** @type {HTMLVideoElement} */
    #videoElement;

    initX=0;
    initY=0;
    firstX=0;
    firstY=0;
    offset;

    /**
     * 
     * @param {HTMLElement} parentElement 
     * @param {MediaStream} stream
     * @param {{x:number,y:number}} offset
     */
    constructor(parentElement, stream, offset={x:0,y:0}) {
        this.offset = offset;
        this.#initializeElement(parentElement, stream);
        this.#setupEvents();
        this.#playStream(stream);
    }

    /**
     * 
     * @param {HTMLElement} parentElement 
     * @param {MediaStream} stream
     */
    #initializeElement = (parentElement, stream) => {
        this.#videoElement = document.createElement('video');
        this.#videoElement.classList.add("video");
        this.#videoElement.id = stream.id+"video";
        this.#videoElement.autoplay = true;

        this.dragElement = document.createElement('div');
        this.dragElement.id = stream.id+"draggable";
        this.dragElement.classList.add("draggable");

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.classList.add("rdwrapper");
        this.wrapperElement.id = stream.id+"wrapper";
        this.wrapperElement.appendChild(this.dragElement);
        this.wrapperElement.appendChild(this.#videoElement);
        this.wrapperElement.style.top = this.offset.x+"px";
        this.wrapperElement.style.left = this.offset.y+"px";

        parentElement.appendChild(this.wrapperElement);
    }

    #setupEvents = () => {
        this.dragElement.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.initX = this.wrapperElement.offsetLeft;
            this.initY = this.wrapperElement.offsetTop;
            this.firstX = e.pageX;
            this.firstY = e.pageY;
        
            this.dragElement.addEventListener('mousemove', this.dragIt, false);
        
            window.addEventListener('mouseup', () => {
                this.dragElement.removeEventListener('mousemove', this.dragIt, false);
            }, false);
        }, false);
    }

    /**
    * 
    * @param {MediaStream} stream 
    */
    #playStream = (stream) => {
        this.#videoElement.srcObject = stream;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    dragIt = (e) => {
        this.wrapperElement.style.left = this.initX+e.pageX-this.firstX + 'px';
        this.wrapperElement.style.top = this.initY+e.pageY-this.firstY + 'px';
    }

    focus = () => {
        this.wrapperElement.classList.add("focus");
        this.dragElement.classList.add("focus-drag");
    }

    defocus = () => {
        this.wrapperElement.classList.remove("focus");
        this.dragElement.classList.remove("focus-drag");
    }
}