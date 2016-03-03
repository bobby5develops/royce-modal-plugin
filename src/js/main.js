
// Create an immediately invoked functional expression to wrap our code
(function() {
    // Define our constructor object
    this.Modal = function() {

        // Create global element references
        this.closeButton = null;
        this.modal = null;
        this.overlay = null;

        // Determine proper prefix
        this.transitionEnd = transitionSelect();

        // Define option defaults
        var defaults = {
            autoOpen: false,
            className: 'fade-and-drop',
            closeButton: true,
            content: "",
            maxWidth: 700,
            minWidth: 300,
            overlay: true
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        if(this.options.autoOpen === true) this.open();

    };
    // Public Methods

    Modal.prototype.close = function() {
        var _ = this;
        this.modal.className = this.modal.className.replace(" royce-open", "");
        this.overlay.className = this.overlay.className.replace(" royce-open",
            "");
        this.modal.addEventListener(this.transitionEnd, function() {
            _.modal.parentNode.removeChild(_.modal);
        });
        this.overlay.addEventListener(this.transitionEnd, function() {
            if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
        });
    };

    Modal.prototype.open = function() {
        buildOut.call(this);
        initializeEvents.call(this);
        window.getComputedStyle(this.modal).height;
        this.modal.className = this.modal.className +
            (this.modal.offsetHeight > window.innerHeight ?
                " royce-open royce-anchored" : " royce-open");
        this.overlay.className = this.overlay.className + " royce-open";
    };

    // Private Methods

    function buildOut() {

        var content, contentHolder, docFragment;

        /*
         * If content is an HTML string, append the HTML string.
         * If content is a domNode, append it's content.
         * If content is a ajax request, append it's content.
         */

        if (typeof this.options.content === "string") {
            content = this.options.content;
        }else{
            content = this.options.content.innerHTML;
        }

        // Create a DocumentFragment to build with
        docFragment = document.createDocumentFragment();

        // Create modal element
        this.modal = document.createElement("div");
        this.modal.className = "royce-modal " + this.options.className;
        this.modal.style.minWidth = this.options.minWidth + "px";
        this.modal.style.maxWidth = this.options.maxWidth + "px";

        // If closeButton option is true, add a close button
        if (this.options.closeButton === true) {
            this.closeButton = document.createElement("button");
            this.closeButton.className = "royce-close close-button";
            this.closeButton.innerHTML = "&times;";
            this.modal.appendChild(this.closeButton);
        }

        // If overlay is true, add one
        if (this.options.overlay === true) {
            this.overlay = document.createElement("div");
            this.overlay.className = "royce-overlay " + this.options.className;
            docFragment.appendChild(this.overlay);
        }

        // Create content area and append to modal
        contentHolder = document.createElement("div");
        contentHolder.className = "royce-content";
        contentHolder.innerHTML = content;
        this.modal.appendChild(contentHolder);

        // Append modal to DocumentFragment
        docFragment.appendChild(this.modal);

        // Append DocumentFragment to body
        document.body.appendChild(docFragment);

    }
    // pass getURL() method as object into buildOut() method
   /* function getURL(url, success, error) {
        // Feature detection
        if ( !window.XMLHttpRequest ) return;
        // Create new request
        var request = new XMLHttpRequest();
        // Setup callbacks
        request.onreadystatechange = function () {
            // if request is complete
            if(request.readyState === 4){
                // if request failed
                if(request.readyState !== 200){
                    if(error & typeof error === 'function' ){
                        error();
                    }
                    return;
                }
            }
        };
        // Get the HTML
        request.open( 'GET', url );
        request.send();


    }*/


    //Extend Default

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function initializeEvents() {

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.close.bind(this));
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', this.close.bind(this));
        }

    }

    function transitionSelect() {
        var el = document.createElement("div");
        if (el.style.WebkitTransition) return "webkitTransitionEnd";
        if (el.style.OTransition) return "oTransitionEnd";
        return 'transitionend';
    }

}());




// create text content based modal
var textContent = document.getElementById('content');
var myModal = new Modal({
    content: textContent
});
var triggerButton = document.getElementById('trigger');

triggerButton.addEventListener('click', function() {
    myModal.open();
});

// create ajax content based modal ( input of form element posts data to server );

