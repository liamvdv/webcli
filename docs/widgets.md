# Widgets
What is the advantage of a desktop over the commandline? It's a graphical user interface. What is the advantage of Webtops over desktops? Webtops are from the internet and fully customisable. Get all your information in realtime at your fingertips.
What is the advantage of the WebCLI over the normal commandline? It's ease of spawning graphical Widgets and feeding them with realtime data without writing a full desktop app.

## helpConsole
The global object `helpConsole` allows you to show some text output to the user. 
The `helpConsole.log` function takes to arguments, a msg and the optional display time in ms. It defaults to 5 seconds.
Example:
```javascript
helpConsole.log("You look good today! Remember to get up and do some stretching every hour.", 10000); //display for 10 seconds
``` 

## Custom Widgets
A widget consists out of two main ingredients. The configuration stored in the localConfig object and the class that builds and renders the widget from the configuration. All webtops have a localConfig representation in which the widgets of a particular Webtop and their config are listed. A way to add widgets to a webtop is currently in the working.
Lets focus on the widget class. It must inherit from `Widget` and 4 attributes, three of which are static (two not only).
```javascript
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

    static createListeners(el) {/* Handeled in CLI object */}

    render(conf, to) {
        if (!to) to = this.wt;
        this.el = this.createElement(conf);     // alias
        this.addPositioning(conf.positioning);
        to.appendChild(this.el);

        // this.createListener(this.el);
    }
``` 
Note: im make use of the `create()` function which is a abstraction for `document.createElement` and `element.setAttribute`. It takes in the html elements name and a attribute object.

The 4 attributes are:
`static name` is a string and will be used as the key for accessing a widgets configuration from the localConfig object.
`static createElement` is a function returning the build element and is actually accessible over the alias `this.createElement`.
`static createListeners` is a function that takes the element and adds event listeners to it if necessary. It is also accessible over the alias `this.createListeners`.
`render()` takes to arguments conf and to and will be called by the system to render the element form its configuration and mount it to `to`, which is always the current webtop.

To make the Widget be Editable, you need to also create a `<widgetname>Edit` class (and name). 

```javascript
class SearchEdit extends Widget {
    static name = "searchEdit";

    constructor(searchConf) {
        super(searchConf);
    }

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
            changeSearchEngine(wts.current.id, engine); // additional function
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
```
To make the system know that your classes exist you must register them in the [widgetRegistry](widget.md).
```javascript
var widgetRegistry = new WidgetRegistry(
    Icon,
    IconEdit,
    /* ... */
    Search,
    SearchEdit
)
```


The most important parts of the provided functions are the following:
```javascript
this.isFocused()            // checks if elem is in focus
this.addPositioning(pos)    // expects a positioning arr. It add grid-area styling to the element.

create(elemName, attrObj)   // create element and att attr with k, v to element from attrObj

/* Wrappers for document.querySelector */
getEl(selector)
getEls(selector)
/* Wrappers for parent.querySelector */
getSubEl(parent, selector)
getSubEls(parent, selector)
```