// Must be included in index.js widgetRegistry
const weatherInterface = {
    render: "callable",
    edit: "callable",
    add: "callable",
    remove: "callable"
}

// not required but in style
function createWeatherWidget(...args) {
    ;
}

function renderWeatherWidget(widgetConfigObject, wt) {
    // function must be added to WidgetRegistry by name
    ; 
}

function renderWeatherEditWidget() {
    ;
}


function addWeatherWidget(wtId, name, ...args) {
    const widgetConfig = {
        "positioning": [1, 1, 12, 12]
        // other args
    }


    localConfig.set(name, widgetConfig, wts[wtId]);
    render(wts[wtId]);
}

/* helpers
    createWidget(...anyArgs) // create the widget elem itself, gets called in renderWidget
    renderWidget(wt, name) // get widget config from localConfig.get(name, wt) and then call render

    addWidget(wt, name, configObj)
    removeWidget(wt, name, other_identifier=null) // set equal to null in local config and render

*/

class WidgetRegistry {
    constructor(...widgetClasses) {
        this.widgets = (widgetClasses) => {
            let widgets = {}
            for (const cls of widgetClasses) {
                widgets[cls.name] = cls;
            }
            return widgets;
        }
    }
}


class Widget {
    constructor(widgetConfig = {
        positioning: [1, 1, 12, 12]
    }) {
        this.wt = wts.current;
        this.el = this.create()
    }

    render() {
        ;
    }
    
    isActive() {
        return true;
    }

    isFocused() {
        return document.activeElement === this.el;
    }
}

class Icon extends Widget {
    static name = "icon"

    constructor(iconConfig={
        positioning: [1, 2, 3, 4],
        name: "unknownIcon",
        targetUrl: "",
        imgSrc: ""
    }) {
        super(iconConfig);
    }

    createElement() {

    }
    createListeners() {

    }

    render() {

    }
}

var widgetRegistry = new WidgetRegistry(

)