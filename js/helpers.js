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

function createQuitEditListener(formEl) { // helper for multiple
    getSubEl(formEl, ".quit-edit").addEventListener("click", function (event) {
        event.preventDefault();
        formEl.remove();
    });
}

function encodeUrl(str) {
    return encodeURIComponent(str);
}

/* Config */
const searchEngines = {
    Google: "https://www.google.com/search?q=",
    DuckDuckGo: "https://www.duckduckgo.com/?q=",
    Bing: "https://www.bing.com/search?q=",
    Ecosia: "https://www.ecosia.org/search?q="
}

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
                ["GitHub", "https://www.github.com", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"],
                ["StackOverflow", "https://stackoverflow.com/questions", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stack_Overflow_icon.svg/768px-Stack_Overflow_icon.svg.png"],
                ["Figma", "https://www.figma.com/", "https://yt3.ggpht.com/ytc/AAUvwngedleQSjBTUabDr5IuXLEaMLy6lSCFMPzBi00V5w=s900-c-k-c0x00ffffff-no-rj"],
                ["AnkiWeb", "https://ankiweb.net/decks/", "https://play-lh.googleusercontent.com/4aLlAwUKGg5Keo8zz-pPI1QS9KnjSsa3vKX2NINqq5Fv1jfPK3bl6ghLaZ371OcH9A"]
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
                ["Google Calender", "https://calendar.google.com/calendar/u/0/r", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1200px-Google_Calendar_icon_%282020%29.svg.png"],
                ["Google Classroom", "https://classroom.google.com/u/1/h", "https://seeklogo.net/wp-content/uploads/2020/09/google-classroom-logo.png"],
                ["Google Drive", "https://drive.google.com/drive/my-drive", "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw"],
                ["Udemy", "https://www.udemy.com/", "https://cdn.worldvectorlogo.com/logos/udemy-1.svg"],
                ["10FastFingers", "https://10fastfingers.com/typing-test/", "https://pbs.twimg.com/profile_images/517343049085485056/6ll-wjg5.png"],
                ["KeyBr", "https://www.keybr.com/", "https://pbs.twimg.com/profile_images/769570803520303104/j3WSD6Hf_400x400.jpg"],
                ["HackerRank", "https://www.hackerrank.com/dashboard", "https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/160_Hackerrank_logo_logos-512.png"]
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
                ["Tagesschau", "https://www.tagesschau.de/", "https://www.tagesschau.de/multimedia/bilder/tagesschauapp104~_v-grossfrei16x9.jpg"],
                ["HackerNews", "https://news.ycombinator.com/", "https://avatars2.githubusercontent.com/u/4703068?s=280&v=4"] 
            ]
        },
        "weatherWidget": null
    }
}

const HELPPAGEHTML = {
    Widgets: "<h4>Coming soon</h4>",
    Shortcuts: `
        <h4>General</h4>
        <table>
            <tr>
                <td class="alined-td">ALT + SHIFT</td>
                <td>Rotate Webtop</td>
            </tr>
            <tr>
                <td class="alined-td">ALT + DIGIT</td>
                <td>Go to Webtop</td>
            </tr>
            <tr>
                <td class="alined-td">ALT + CTRL</td>
                <td>Quick help</td>
            </tr>
        </table>

        <h4>CLI</h4>
        <table>
            <tr>
                <td class="alined-td">ArrowUp</td>
                <td>Prior command</td>
            </tr>
            <tr>
                <td class="alined-td">ArrowDown</td>
                <td>Next command</td>
            </tr>
        </table>
    `,
    Commands: `
        <p class="cmd">help [&lt;command&gt;]</p>
        <p class="tab">open the documentation [for command]</p>

        <p class="cmd"> gh [&lt;searchterm&gt;]</p>
        <p class="tab">open github [and search]</p>

        <p class="cmd"> so [&lt;searchterm&gt;]</p>
        <p class="tab">open stackoverflow [and search]</p>
        
        <p class="cmd"> l [&lt;port&gt;]</p>
        <p class="tab">open 127.0.0.1 on specified port</p>

        <p class="cmd"> amz [&lt;searchterm&gt; [-s sortoption] ]</p>
        <p class="tab">
            open amazon [and search]<br>
            sort options:
        </p>
        <p class="tab2">
            <span class="option-color">rev</span> : by review<br>
            <span class="option-color">asc</span> : price ascending<br>
            <span class="option-color">desc</span> : price descending<br>
            <span class="option-color">new</span> : new in stock
        </p>

        <p class="cmd"> § &lt;article&gt; &lt;lawbook&gt;</p>
        <p class="tab">lookup german laws</p>
    ` // better do the options in a table?
}


function get(key) {
    const serialisedValue = localStorage.getItem(key);
    if (serialisedValue) return JSON.parse(serialisedValue);
    else return null;
}

function set(key, value) {
    if (typeof(value) !== String) value = JSON.stringify(value);
    localStorage.setItem(key, value);
}


function setConfig(config) {
    if (!config) config = defaultConfig;

    set("config", config);
    return config;
}

function getConfig() {
    const config = get("config");
    if (config !== null) return config;
    else return setConfig(defaultConfig);
}


function addIcon(wtId, name, targetUrl, imgUrl) {
    let iconGridData = localConfig.get("iconGrid", wtId);

    if (imgUrl.trim() === "") {
        const url = new URL(targetUrl);
        const baseUrl = url.protocol + "//" + url.hostname + "/";
        imgUrl = baseUrl + "apple-touch-icon.png"; // better fallback would be "favicon.ico", but worse img quality
    }
    iconGridData.icons.push([name, targetUrl, imgUrl]);
    localConfig.set("iconGrid", iconGridData, wts[wtId]);

    widgetManager.render(wts[wtId]);
}

function changeSearchEngine(wtId, engineUrl) {
    let searchData = localConfig.get("search", wtId);
    searchData.engineBaseUrl = engineUrl;
    localConfig.set("search", searchData);

    widgetManager.render(wts[wtId]);
}


