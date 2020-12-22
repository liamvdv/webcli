/* General helpers */
function getEl(selector) {
    return document.querySelector(selector);
}

function getEls(selector) {
    return document.querySelectorAll(selector);
}

function getSubEl(parent, selector) {
    return parent.querySelector(selector);
}

function getSubEls(parent, selector) {
    return parent.querySelectorAll(selector);
}

function create(elemSlug, attributesObj) {
    const el = document.createElement(elemSlug);
    Object.keys(attributesObj).forEach(name => {
        el.setAttribute(name, attributesObj[name]);
    });
    return el;
}

function runClickEvent(elem) {
    const event = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    elem.dispatchEvent(event);
}


// x = column; y = row
function addPositioning(elem, yS, xS, yE, xE) {
    elem.setAttribute("style", `grid-area: ${yS} / ${xS} / ${yE+1} / ${xE+1};`);
}

/* Config */
const defaultConfig = { // the ids of the webtops map to their storage model
    "wt0": {
        "searchbar": {
            "engineBaseUrl": "https://www.google.com/search?q="
        },
        "iconGrid": [
            ["DockerHub", "https://hub.docker.com/?ref=login", ""],
            ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
            ["Google Drive", "https://drive.google.com/drive/my-drive", ""],
            ["Docs", "https://docs.google.com/document/u/0/", ""],
            ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", ""],
            ["Figma", "https://www.figma.com/", ""],
            ["HackerNews", "https://news.ycombinator.com/", ""]
        ]
    },
    "wt1": {
        "iconGrid": [
            ["DockerHub", "https://hub.docker.com/?ref=login", ""],
            ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
            ["Google Drive", "https://drive.google.com/drive/my-drive", ""],
            ["Docs", "https://docs.google.com/document/u/0/", ""],
            ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", ""],
            ["Figma", "https://www.figma.com/", ""],
            ["HackerNews", "https://news.ycombinator.com/", ""]
        ]
    },
    "wt2": {
        "iconGrid": [
            ["DockerHub", "https://hub.docker.com/?ref=login", ""],
            ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
            ["Google Drive", "https://drive.google.com/drive/my-drive", ""],
            ["Docs", "https://docs.google.com/document/u/0/", ""],
            ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", ""],
            ["Figma", "https://www.figma.com/", ""],
            ["HackerNews", "https://news.ycombinator.com/", ""]
        ]
    }
}

function setConfig(config) {
    if (!config) config = defaultConfig;
    const serialisedConfig = JSON.stringify(config);
    localStorage.setItem('config', serialisedConfig);
    return config;
}

function getConfig() {
    const serialisedConfig = localStorage.getItem("config");
    if (serialisedConfig !== null) return JSON.parse(serialisedConfig);
    else return setConfig(defaultConfig);
}

/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(wts, by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(wts, to=0) {
    const maxIdx = wts.length - 1;
    if (to > maxIdx) {
        console.log(`<changeWt> ${to} is higher than the number of Webtops you have.`);
    } else {
        wts.changeCurrent(to);
    }
}

/* + + + Icon Element + + + */
function createIconEl(name, targetUrl, imgUrl) {
    const div = create("div", { class: "icon"});

    const innerHTML = `
        <a href="${targetUrl}" target="_blank">
            <img src="${imgUrl}" alt="${name}">
        </a>
    `;
    div.innerHTML = innerHTML.trim();
    return div;
}

function createIconGridEl() {
    return create("div", {class: "icon-grid"});
}

// main function for Icon Elements
function renderIconGrid(iconsData, container, positioning=[6, 3, 10, 10]) {
    if (container === undefined) container = wts.current;

    const iconGridEl = createIconGridEl();
    addPositioning(iconGridEl, ...positioning);
    iconsData.forEach(iconData => iconGridEl.appendChild(createIconEl(...iconData)));
    container.appendChild(iconGridEl);
}


function addIcon(wtId, name, targetUrl, imgUrl) {
    localConfig.data[wtId].iconGrid.push([name, targetUrl, imgUrl]);
    setConfig(localConfig.data);
    renderIconGrid(localConfig.data[wtId].iconGrid);
}

/* + + + Searchbar + + + */
function createSearch() {
    return create("div", {class:"search"});
}

function createSearchbarEl(text) {
    return create("input", {class: "searchbar", type: "text", autofocus: true, placeholder: text});
}

function renderSearchbar(container, positioning=[3, 3, 3, 10], placeholderText="Search the web") {
    if (container===undefined) container = wts.current;

    const searchEl = createSearch();
    const searchbarEl = createSearchbarEl(placeholderText);
    searchEl.appendChild(searchbarEl);
    addPositioning(searchEl, ...positioning);
    container.appendChild(searchEl);

    createSearchbarListener(searchbarEl);
}

function runSearchEvent(searchterm, engineBaseUrl="") {
    if (!engineBaseUrl) engineBaseUrl = localConfig[wts.current.id]["searchbar"].engineBaseUrl;

    let searchUrl;
    if (searchterm.startsWith("http://") 
        || searchterm.startsWith("https://")
        || searchterm.startsWith("www")
        ) searchUrl = searchterm;
    else searchUrl = engineBaseUrl + searchterm.replace(/ +/g, "+");

    const a = create("a", {href: searchUrl});
    runClickEvent(a);
}

function createSearchbarListener(searchbarEl) {
    searchbarEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter") runSearchEvent(searchbarEl.value);
    });
}

/* + + + Edit Config + + + */
function createEditFormEl() {
    const editIconBtn = create("button", {class: "btn"});
}

function renderEditForm() {
    //TODO: list possible elements and write event handler for each.
    // QUIT FIX FOR NOW
    renderIconEditForm();
}

function createQuitEditFormListener(formEl) {
    getSubEl(formEl, ".quit-edit").addEventListener("click", function (event) {
        event.preventDefault();
        formEl.remove();
    });
}

function createIconEditFormListeners(formEl) {
    formEl.addEventListener("submit", function (event) {
        event.preventDefault();

        let wtId = formEl.elements["whichWt"].value;
        let name = formEl.elements["name"].value;
        let targetUrl = formEl.elements["targetUrl"].value;
        let imgUrl = formEl.elements["imgUrl"].value;

        addIcon(wtId, name, targetUrl, imgUrl);
        formEl.remove(); // or leave for adding multiple?
    })
    createQuitEditFormListener(formEl);
}

// For Icons
function createIconEditFormEl(name="", targetUrl="", imgUrl="") {
    const form = create("form", {class: "edit-form", id: "icon-edit-form"});

    let options = "";
    getEls(".wt").forEach(wt => {
        options += `<option value="${wt.id}">Webtop ${wt.id.slice(-1)}</option>`;
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

function renderIconEditForm(defaultIcon=["", "", ""], container, positioning=[4, 5, 8, 8]) {
    if (container === undefined) container = wts.current;

    const formEl = createIconEditFormEl(...defaultIcon);
    addPositioning(formEl, ...positioning);
    container.appendChild(formEl);
    createIconEditFormListeners(formEl);

}

/* + + + Render Webtops + + + */

function render(wt, wtConfig) {
    if (wt === undefined) wt = wts.current;
    if (wtConfig === undefined) wtConfig = localConfig.data[wt.id];

    wt.innerHTML = ""; 

    Object.keys(wtConfig).forEach(sectionSlug => {
        // add sectionSlug for every widget
        // sections slugs must be keys in the config to be rendered ("wt0" { searchbar: "notImportantValue"})
        if (sectionSlug === "searchbar") return renderSearchbar(wt);
        else if (sectionSlug === "iconGrid") return renderIconGrid(localConfig.data[wt.id].iconGrid); 
    });
}