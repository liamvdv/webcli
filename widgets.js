/* helpers
    createWidget(...anyArgs) // create the widget elem itself, gets called in renderWidget
    renderWidget(wt, name) // get widget config from localConfig.get(name, wt) and then call render

    addWidget(wt, name, configObj)
    removeWidget(wt, name, other_identifier=null) // set equal to null in local config and render

*/
// function render(wt=null, wtConfig=null) {
//     if (!wt) wt = wts.current;
//     else if (typeof wt === String) wt = wts[wt];

//     if (!wtConfig) wtConfig = localConfig.get("all", wt.id);

//     wt.innerHTML = ""; // reset

//     let func;
//     Object.keys(wtConfig).forEach(widgetName => {
//         if (wtConfig[widgetName] !== null) {
//             func = widgetRegistry[widgetName].render;
//             func(wtConfig[widgetName], wt);
//         }
//     });
// }

class WidgetRegistry {
    constructor(...widgetClasses) {
        this.widgets = this.initFromClasses(widgetClasses);
    }
    initFromClasses(wgClss) {
        let widgets = {};
        for (const wg of wgClss) widgets[wg.name] = wg;
        return widgets;
    }
    get(name) {
        return this.widgets[name];
    }
}


class Widget {
    constructor(widgetConfig = {}) {
        const thiss = this.constructor;
        if (!widgetConfig || Object.keys(widgetConfig).length === 0) {
            if (thiss.name.endsWith("Edit")) widgetConfig = localConfig.get(thiss.name.substring(0, thiss.name.length -4));
            else widgetConfig = localConfig.get(thiss.name);
        }
        this.wt = wts.current;
        this.conf = widgetConfig;
        this.createElement = thiss.createElement;
        this.createListeners = thiss.createListeners;
        this.render(widgetConfig, this.wt);
    }

    isActive() {
        return true;
    }

    isFocused() {
        return document.activeElement === this.el;
    }

    addPositioning(positioning) {
        if (!positioning) positioning = this.conf.positioning;

        const [yS, xS, yE, xE] = positioning;
        let style = this.el.getAttribute("style");
        if (!style) style = "";
    
        style +=`grid-area: ${yS} / ${xS} / ${yE+1} / ${xE+1};`
        this.el.setAttribute("style", style);
    }
}

class Icon extends Widget {
    static name = "icon";

    constructor(iconConfig) {
        super(iconConfig);
    }

    // must have this name. 
    static createElement(conf=["", "", ""]) {
        const [name, targetUrl, imgUrl] = conf;

        const div = create("div", { class: "icon"});
        const innerHTML = `
            <a href="${targetUrl}" target="_blank">
                <img src="${imgUrl}" alt="${name}">
            </a>
        `;
        div.innerHTML = innerHTML.trim();
        return div;
    }


    static createListeners() {
        return;
    }

    render(conf, to) {
        this.el = this.createElement(conf);
        this.addPositioning(conf.positioning);
        to.appendChild(this.el);
    }
}

class IconGrid extends Widget {
    static name = "iconGrid";

    constructor(iconGridConf) {
        super(iconGridConf);
    }

    static createElement(conf) {
        const {rows, cols} = conf;
        const div = create("div", {class: "icon-grid"});
        div.setAttribute("style", `grid-template-rows: repeat(${rows}, 1fr); grid-template-columns: repeat(${cols}, 1fr);`);
        return div;
    }

    static createListeners() {

    }

    render(conf, to) {
        if (!to) to = this.wt;
        this.el = this.createElement(conf);
        this.addPositioning(conf.positioning);
        conf.icons.forEach(icon => this.el.appendChild(Icon.createElement(icon)));

        to.appendChild(this.el);
    }
}

class IconEdit extends Widget {
    static name = "iconGridEdit"; //FIX LATER

    constructor(iconConf=["", "", ""]) {
        super(iconConf);
    }

    // must have this name. 
    static createElement(conf=["", "", ""]) {
        const [name, targetUrl, imgUrl] = conf;
        const form = create("form", {class: "edit-form", id: "icon-edit-form"});

        let options = "";
        getEls(".wt").forEach(wt => {
            options += `<option value="${wt.id}">Webtop ${parseInt(wt.id.slice(-1)) + 1}</option>`;
        });

        const innerHTML = `
            <button class="quit-edit btn">X</button>
            <label for="name">Name</label>
            <input type="text" class="text-input" id="name" name="name" value="${name}" required>

            <label for="targetUrl">Url</label>
            <input type="text" class="text-input" id="targetUrl" name="targetUrl" value="${targetUrl}" required>

            <label for="imgUrl">Icon URL</label>
            <input type="text" class="text-input" id="imgUrl" name="imgUrl" value="${imgUrl}">
            <select id="whichWt" name="whichWt" class="select-input">
                ${options}
            </select>
            <button class="btn save-edit">Add</button>
        `;
        form.innerHTML = innerHTML;
        return form;
    }


    static createListeners(el) {
        if (!el) el = this.el;

        el.addEventListener("submit", function (event) {
            event.preventDefault();
    
            let wtId = el.elements["whichWt"].value;
            let name = el.elements["name"].value;
            let targetUrl = el.elements["targetUrl"].value;
            let imgUrl = el.elements["imgUrl"].value;
    
            el.remove(); // or leave for adding multiple?
            addIcon(wtId, name, targetUrl, imgUrl);
        })
        createQuitEditListener(el);
    }

    render(conf, to) {
        this.el = this.createElement(conf);
        this.addPositioning(defaultEditElPositioning);
        to.appendChild(this.el);

        this.createListeners();
    }
}

class Search extends Widget {
    static name = "search";
    constructor(searchConfig) {
        super(searchConfig);
    }

    static createElement(conf) {
        const wrapper = create("div", {class:"search"});
        wrapper.appendChild(create("input", {class: "searchbar", type: "text", autofocus: true, placeholder: conf.placeholderText}));
        return wrapper;
    }

    static createListeners() {}

    render(conf, to) {
        if (!to) to = this.wt;
        this.el = this.createElement(conf);
        this.addPositioning(conf.positioning);
        to.appendChild(this.el);
    }
}

class SearchEdit extends Widget {
    static name = "searchEdit";

    constructor(searchConf) {
        super(searchConf);
    }

    // must have this name. 
    static createElement(searchConf) {
        const defaultEngine = searchConf.engineBaseUrl;
        const form = create("form", {class: "edit-form", id: "search-edit-form"});

        let checkboxes = "";
        Object.entries(searchEngines).forEach(pair => {
            let [name, url] = pair;
            let checkedAttr = "";
            if (url === defaultEngine) checkedAttr = "checked";
            checkboxes += `
                <input type="radio" id="${name}" name="searchEngine" value="${url}" ${checkedAttr}>
                <label for="${name}">${name}</label><br>
            `
        });

        const innerHTML = `
            <button class='quit-edit btn'>X</button>
            <h3>Choose a different search engine</h3>
            ${checkboxes}
            <button class='btn save-edit'>Apply</button>
        `;

        form.innerHTML = innerHTML;
        return form;
    }


    static createListeners(el) {
        if (!el) el = this.el;

        el.addEventListener("submit", function (event) {
            event.preventDefault()
            let engine = searchEngines["Google"]; // default if none will be submitted
    
            const checkedBox = getSubEl(el, "input:checked");
            if (checkedBox !== null) engine = checkedBox.value;
            changeSearchEngine(wts.current.id, engine);
            el.remove()
        });
        createQuitEditListener(el);
    }

    render(conf, to) {
        this.el = this.createElement(conf);
        this.addPositioning(defaultEditElPositioning);
        to.appendChild(this.el);

        this.createListeners();
    }
}

function renderEditFormFor(widgetName) { // helper 
    const cls = widgetRegistry.get(widgetName + "Edit");
    if (cls) return new cls();
    else throw new Error(`${cls} is not a registered widget name.`)
}

/* Special case */
class Menu extends Widget {
    static name = "menu";
    constructor(wtConf) {
        if (!wtConf) wtConf = localConfig.get("all");
        super(wtConf);
    }

    static createElement(wtConf) {
        const div = create("div", {class: "edit-form"});
        div.innerHTML = "<button class='btn quit-edit'>X</button>"
        Object.keys(wtConf).forEach(wgName => {
            div.innerHTML += `
                <p>
                    ${wgName}
                    <button class="to-edit-form btn" onclick="renderEditFormFor('${wgName}')">Edit</button>
                    <hr>
                </p>
            `.trim();
        });
        div.innerHTML += `<p>\
            Hold CTRL + ALT for some tips.  
        </p>`
        return div;
    }

    static createListeners(el) {
        if (!el) el = this.el;
        createQuitEditListener(el);
    }

    render(conf, to) {
        //TODO: list possible elements and write event handler for each.
        this.el = this.createElement(conf);
        this.addPositioning(defaultEditElPositioning);

        to.appendChild(this.el);

        this.createListeners();
    }
}

class Weather extends Widget {
    static name = "weatherWidget";
    constructor() {
        super()
    }
    render() {
        helpConsole.log("Not implemented yet.", 2000)
    }
}

class WeatherEdit extends Widget {
    static name = "weatherWidgetEdit";
    constructor() {
        super()
    }
    render() {
        helpConsole.log("Not implemented yet.", 2000);
    }
}

// Special
class HelpPage extends Widget {
    static name = "help";
    constructor(searchConfig) {
        super(searchConfig);
    }

    static createElement() {
        const overlay = create("div", {class: "opaque-overlay"});

        // gather the information about the shortcuts here and make them elems
        ["Shortcuts", "Commands", "Widgets"].forEach(name => {
            const section = create("section", {class: "info"})
            let innerHTML = `
                <h2>${name}</h2>
                <hr>
                ${HELPPAGEHTML[name]}
            `;
            section.innerHTML = innerHTML;
            overlay.appendChild(section);
        });
        return overlay;
    }

    static createListeners() {
        document.addEventListener("keyup", (e) => {
            console.log(this.el);
            this.el.remove();
            g.helpPageActive = false;
        }, {once: true});
    }

    render() {
        this.el = getEl(".opaque-overlay");
        if (this.el === null) this.el = this.createElement();

        const html = getEl("html");
        html.appendChild(this.el);

        g.helpPageActive = true;

        this.createListeners();
    }
}

var widgetRegistry = new WidgetRegistry(
    /* Not HelpPage */ 
    Icon,
    IconEdit,
    IconGrid,
    Search,
    SearchEdit,
    Weather,
    WeatherEdit
)

class WidgetManager {
    constructor() {}

    render(wt=null, wtConf=null) {
        if (!wt) wt = wts.current;
        else if (typeof wt === String) wt = wts[wt];
    
        if (!wtConf) wtConf = localConfig.get("all", wt.id);
    
        wt.innerHTML = ""; // reset
    
        Object.keys(wtConf).forEach(wgName => {
            const wgConf = wtConf[wgName];
            if (wgConf !== null) {
                const widget = widgetRegistry.get(wgName);
                if (widget.name.endsWith("Edit")) new widget();
                else new widget(wgConf);
            }
        });
    }
}
