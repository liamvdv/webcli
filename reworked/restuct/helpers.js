/* General helpers */
function getEl(selector) {
    return document.querySelector(selector);
}

function getEls(selector) {
    return document.querySelectorAll(selector);
}

function create(elem) {
    return document.createElement(elem);
}

function createGridPositioningStyle(yS, xS, yE, xE) {
    // x = column; y = row;
    // don't worry about adding one, just say from which to which it should span
    return `grid-area: ${yS} / ${xS} / ${yE+1} / ${xE+1};`;
}

/* Config */
const defaultConfig = { // the ids of the webtops map to their storage model
    "wt0": {
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
    const serialisedConfig = JSON.stringify(config);
    localStorage.setItem('config', serialisedConfig);
    return config;
}

function getConfig() {
    const serialisedConfig = localStorage.getItem("config");
    if (serialisedConfig !== null) return JSON.parse(serialisedConfig);
    else return setConfig(defaultConfig);
}

/* Shortcuts */
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

/* Icon Element */
function createIconEl(name, targetUrl, imgUrl) {
    const div = create("div");
    div.className = "icon";

    const innerHTML = `
        <a href="${targetUrl}" target="_blank">
            <img src="${imgUrl}" alt="${name}">
        </a>
    `;
    div.innerHTML = innerHTML.trim();
    return div;
}

function createIconGridEl(positioning=[6, 3, 10, 9]) {
    const div = create("div");
    div.className = "icon-grid";
    div.setAttribute("style", createGridPositioningStyle(...positioning));
    return div;
}

function renderIconGrid(iconsData, container, positioning=[6, 3, 10, 9]) {
    const iconGridEl = createIconGridEl(positioning);
    iconsData.forEach(iconData => iconGridEl.appendChild(createIconEl(...iconData)));
    container.appendChild(iconGridEl);
}




