/* Globals */
const wts = {  // webtops holds the HTML Elems references, wt0, wt1, wt2,...
    init: function () {
        let wts = getEls(".wt");
        wts.forEach((wt, idx) => {
            let name = "wt" + idx; 
            this[name] = wt;
        });
        this.current = wts[0];
        this.length = wts.length;
    },
    changeCurrent: function (toIdx) { // one indexed
        if (this.current) this.current.classList.remove("current-wt");

        this.current = this["wt" + toIdx];
        this.current.classList.add("current-wt");
        render(this.current, localConfig.get("all", this.current.id));
    }
}

const widgetRegistry = {
    iconGrid: {
        render: renderIconGrid,
        edit: renderIconEditForm,
        add: addIcon, // should actually be something to remove an element, not changing the settings
        remove: "removeIcon"
    },
    search: {
        render: renderSearch,
        edit: renderSearchEditForm,
        add: "addSearch",
        remove: "removeSearch"
    },
    weatherWidget: {
        edit: renderWeatherEditForm
    }
}

const localConfig = {
    init: function() {
        this.data = getConfig();
    },
    get: function(widgetName, wtId=null) {
        if (!wtId) wtId = wts.current.id;

        if (widgetName === "all") return this.data[wtId];
        else return this.data[wtId][widgetName];
    },
    set: function (widgetName, value, wt=null) {
        if (!wt) wt = wts.current;
        this.data[wt.id][widgetName] = value;
        setConfig(this.data);
    },
    reset: function () {
        this.data = setConfig(defaultConfig);
    }
}

localConfig.init()

document.addEventListener("DOMContentLoaded", function(e) {
    wts.init();
    wts.changeCurrent(0);

    const editBtn = getEl("#edit-config");
    editBtn.addEventListener("click", e => renderEditMenu());
});


// Shortcuts logic
document.addEventListener("keydown", function (event) {
    if      (event.altKey && event.shiftKey)    rotateWt(wts, 1);
    else if (event.altKey && !isNaN(event.key)) changeWt(wts, parseInt(event.key));
});




/* A webtop is build form the local config.
 * the configuration is split by the possible webtops.
 * These Webtops have objects of widgets as their values or false it the wt is deactivated 
 * Thes widgets have names and their value is an obejct describing it or null if the
 * widget is not wanted.
 * 
 */
