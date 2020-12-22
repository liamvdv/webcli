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

function remove(selector, parent=null) {
    if (!parent) parent = wts.current;

    const el = parent.querySelector(selector);
    if (el) el.remove();
}

function addPositioning(elem, yS, xS, yE, xE) {
    let style = elem.getAttribute("style");
    if (!style) style = "";

    style +=`grid-area: ${yS} / ${xS} / ${yE+1} / ${xE+1};`
    elem.setAttribute("style", style);
}


function runClickEvent(elem) {
    const event = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    elem.dispatchEvent(event);
}


/* Config */

const defaultEditElPositioning = [4, 5, 8, 8];
const defaultFullPagePositioning = [3, 3, 10, 10]


const defaultConfig = { // the ids of the webtops map to their storage model
    "wt0": {
        "search": {
            "positioning": [3, 3, 3, 10],
            "placeholderText": "Search the web",
            "engineBaseUrl": "https://www.google.com/search?q="
        },
        "iconGrid": {
            "positioning": [6, 3, 10, 10],
            "rows": 2,
            "cols": 6, 
            "icons": [
                ["DockerHub", "https://hub.docker.com/?ref=login", "https://ertan-toker.de/wp-content/uploads/2018/05/docker-container-logo-thegem-blog-default.png"],
                ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
                ["Google Drive", "https://drive.google.com/drive/my-drive", "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw"],
                ["Docs", "https://docs.google.com/document/u/0/", "https://www.googlewatchblog.de/wp-content/uploads/google-docs-logo-1.jpg?w=640"],
                ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", "https://www.klipfolio.com/sites/default/files/blog/google-sheets-blog-banner.png"],
                ["Figma", "https://www.figma.com/", "https://yt3.ggpht.com/ytc/AAUvwngedleQSjBTUabDr5IuXLEaMLy6lSCFMPzBi00V5w=s900-c-k-c0x00ffffff-no-rj"],
                ["HackerNews", "https://news.ycombinator.com/", "https://pbs.twimg.com/profile_images/469397708986269696/iUrYEOpJ_400x400.png"]
            ]
        },
        "weatherWidget": null // does not exists currently -> null : off
    },
    "wt1": {
        "search": null,
        "iconGrid": {
            "positioning": defaultFullPagePositioning,
            "rows": 5,
            "cols": 6,
            "icons": [
                ["DockerHub", "https://hub.docker.com/?ref=login", "https://ertan-toker.de/wp-content/uploads/2018/05/docker-container-logo-thegem-blog-default.png"],
                ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
                ["Google Drive", "https://drive.google.com/drive/my-drive", "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw"],
                ["Docs", "https://docs.google.com/document/u/0/", "https://www.googlewatchblog.de/wp-content/uploads/google-docs-logo-1.jpg?w=640"],
                ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", "https://www.klipfolio.com/sites/default/files/blog/google-sheets-blog-banner.png"],
                ["Figma", "https://www.figma.com/", "https://yt3.ggpht.com/ytc/AAUvwngedleQSjBTUabDr5IuXLEaMLy6lSCFMPzBi00V5w=s900-c-k-c0x00ffffff-no-rj"],
                ["HackerNews", "https://news.ycombinator.com/", "https://pbs.twimg.com/profile_images/469397708986269696/iUrYEOpJ_400x400.png"]
            ]
        },
        "weatherWidget": null
    },
    "wt2": {
        "search": null,
        "iconGrid": {
            "positioning": defaultFullPagePositioning,
            "rows": 5, // IDEA
            "cols": 6, // IDEA
            "icons": [
                ["DockerHub", "https://hub.docker.com/?ref=login", "https://ertan-toker.de/wp-content/uploads/2018/05/docker-container-logo-thegem-blog-default.png"],
                ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
                ["Google Drive", "https://drive.google.com/drive/my-drive", "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw"],
                ["Docs", "https://docs.google.com/document/u/0/", "https://www.googlewatchblog.de/wp-content/uploads/google-docs-logo-1.jpg?w=640"],
                ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", "https://www.klipfolio.com/sites/default/files/blog/google-sheets-blog-banner.png"],
                ["Figma", "https://www.figma.com/", "https://yt3.ggpht.com/ytc/AAUvwngedleQSjBTUabDr5IuXLEaMLy6lSCFMPzBi00V5w=s900-c-k-c0x00ffffff-no-rj"],
                ["HackerNews", "https://news.ycombinator.com/", "https://pbs.twimg.com/profile_images/469397708986269696/iUrYEOpJ_400x400.png"]
            ]
        },
        "weatherWidget": null
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


function addIcon(wtId, name, targetUrl, imgUrl) {
    let iconGridData = localConfig.get("iconGrid", wtId);
    iconGridData.icons.push([name, targetUrl, imgUrl]);
    localConfig.set("iconGrid", iconGridData, wts[wtId]);

    render(wts[wtId]);
}