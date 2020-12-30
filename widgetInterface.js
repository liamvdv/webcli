// Must be included in index.js widgetRegistry
const weather = {
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

function removeWeatherWidget(wtId, )

/* helpers
    createWidget(...anyArgs) // create the widget elem itself, gets called in renderWidget
    renderWidget(wt, name) // get widget config from localConfig.get(name, wt) and then call render

    addWidget(wt, name, configObj)
    removeWidget(wt, name, other_identifier=null) // set equal to null in local config and render

*/
