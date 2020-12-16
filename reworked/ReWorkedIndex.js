function createSearchbar(searchbarInputClass, searchbarPlaceholderText) {
    const searchbarElement = `
        <input id="searchbar" class="${searchbarInputClass}" placeholder="${searchbarPlaceholderText}" autofocus>
    `;
    return searchbarElement
}

function renderSearchbar(container) {
    let searchbar = createSearchbar("search-input", "Search the Web");
    container.insertAdjacentHTML("beforeend", searchbar);
}


function createIcon (name, targetUrl, imgSrc) {
    const iconElement = `
        <div class="icon">
            <a href="${targetUrl}" target="_blank">
                <img src="${imgSrc}" alt="${name}">
            </a>
        </div>
    `;
    return iconElement;
}

function renderIconGrid(container, icons) { // rows, columns?
    container.innerHTML = "";

    let elem;
    icons.forEach(icon => {
        elem = createIcon(...icon);
        container.insertAdjacentHTML("beforeend", elem);
    });
}


//############################## Local Config ##################################
const defaultConfig = {
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

function setConfig(config) {
    localStorage.setItem('config', JSON.stringify(config));
    return config;
}

function getConfig() {
    const stringConfig = localStorage.getItem("config");

    if (stringConfig) return JSON.parse(stringConfig);
    else return setConfig(defaultConfig);
}


function moveIcon(fromIdx, toIdx) {
    config = getConfig();
    let item = config.itemGrid.splice(fromIdx, 1);
    if (toIdx > fromIdx) {
        config.itemGrid.splice(toIdx - 1, 0, item);
    } else if (toIdx < fromIdx) {
        config.itemGrid.splice(toIdx, 0, item);
    }
    return setConfig(config);
}

function createSettingsForm() {
    const settingsElem = `
        <form class="overlay-form" id="settings">
            <button class="quit-settings btn">X</button>
            <label for="name">Name</label>
            <input type="text" class="text-input" id="name" name="name" required>

            <label for="targetUrl">Url</label>
            <input type="text" class="text-input" id="targetUrl" name="targetUrl" required>

            <label for="imgSrc">Icon URL</label>
            <input type="text" class="text-input" id="imgSrc" name="imgSrc">
            <button class="change-settings btn">Add</button>
        </form>
    `;
    return settingsElem;
}

function renderSettings() {
    const settingsElem = createSettingsForm();
    const body = getElem("body");
    body.insertAdjacentHTML("beforeend", settingsElem);
}

// ###################### End Local Config ####################################



// ###################### Helper Functions ####################################
function getElem(selector) {
    return document.querySelector(selector);
}
function getElems(selector) {
    return document.querySelectorAll(selector);
}
// ####################### End Helper Functions ################################

document.addEventListener("DOMContentLoaded", function () {
    let config = getConfig();
    
    const searchSection = getElem("#search");
    renderSearchbar(searchSection);

    const searchbar = getElem("#searchbar");
    searchbar.addEventListener("input", function (e) {
        console.log(this.value);
    });
    

    const iconGridSection = getElem("#icon-grid");
    renderIconGrid(iconGridSection, config.iconGrid);


    const configBtn = getElem("#config-icon");
    configBtn.addEventListener("click", function (e) {
        renderSettings();
        const form = getElem("#settings");
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            let name = this.elements.name.value;
            let targetUrl = this.elements.targetUrl.value;
            let imgSrc = this.elements.imgSrc.value;
            
            config.iconGrid.push([name, targetUrl, imgSrc]);
            
            renderIconGrid(iconGridSection, config.iconGrid);
            setConfig(config);
            this.remove();
        });
        const quitBtn = getElem(".quit-settings");
        quitBtn.addEventListener("click", () => {
            form.remove();
        });
    });
});