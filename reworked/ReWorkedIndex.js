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

// global config var
let  localConfig = defaultConfig; 
let iconGridSection;
let searchSection;

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
    let config = getConfig();
    let item = config.itemGrid.splice(fromIdx, 1);
    if (toIdx > fromIdx) {
        config.itemGrid.splice(toIdx - 1, 0, item);
    } else if (toIdx < fromIdx) {
        config.itemGrid.splice(toIdx, 0, item);
    }
    return setConfig(config);
}


function createIconEditForm(name, targetUrl, imgSrc) {
    if (!name || !targetUrl) {
        name = "";
        targetUrl = "";
        imgSrc = "";
    }

    const settingsElem = `
        <form class="overlay-form" id="settings">
            <button class="quit-settings btn">X</button>
            <label for="name">Name</label>
            <input type="text" class="text-input" id="name" name="name" value="${name}" required>

            <label for="targetUrl">Url</label>
            <input type="text" class="text-input" id="targetUrl" name="targetUrl" value="${targetUrl}" required>

            <label for="imgSrc">Icon URL</label>
            <input type="text" class="text-input" id="imgSrc" name="imgSrc" value="${imgSrc}" >
            <button class="change-settings btn">Add</button>
        </form>
    `;
    return settingsElem;
}

function renderSettings() {
    const settingsElem = createIconEditForm();
    const body = getElem("body");
    body.insertAdjacentHTML("beforeend", settingsElem);
}

function renderEditIcon(name, targetUrl, imgSrc) {
    const iconEditElem = createIconEditForm(name, targetUrl, imgSrc); // refill values
    const body = getElem("body");
    body.insertAdjacentHTML("beforeend", iconEditElem);

    const form = getElem("#settings");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let name = this.elements.name.value;
        let targetUrl = this.elements.targetUrl.value;
        let imgSrc = this.elements.imgSrc.value;
        
        localConfig.iconGrid.push([name, targetUrl, imgSrc]);
        
        renderIconGrid(iconGridSection, localConfig.iconGrid);
        setConfig(localConfig);
        this.remove();
    });
    const quitBtn = getElem(".quit-settings");
    quitBtn.addEventListener("click", () => {
        form.remove();
    });

}

function createEditIcon(name, targetUrl, imgSrc) {
    const editIcon = `
        <div class="icon-edit">
            <p>
                ${targetUrl}
            </p>
            <img src="${imgSrc}" alt="${name}" class="preview-img">
            <button onclick="this.parentNode.remove()">Remove</button>
            <button onclick="renderEditIcon(name, targetUrl, imgSrc)">Edit</button>

        </div>
    `;
    return editIcon;
}

function renderEditIconGrid(icons) {
    const container = document.createElement("div");
    container.className = "overlay-form";
    let elem;
    icons.forEach(icon => {
        elem = createEditIcon(...icon);
        container.insertAdjacentHTML("beforeend", elem);
    });
    getElem("body").appendChild(container);
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
    localConfig = getConfig();
    
    searchSection = getElem("#search");
    renderSearchbar(searchSection);

    const searchbar = getElem("#searchbar");
    searchbar.addEventListener("enter", function (e) {
        console.log(this.value);
    });
    

    iconGridSection = getElem("#icon-grid");
    renderIconGrid(iconGridSection, localConfig.iconGrid);


    const configBtn = getElem("#config-icon");
    configBtn.addEventListener("click", function (e) {
        renderSettings();
        const form = getElem("#settings");
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            let name = this.elements.name.value;
            let targetUrl = this.elements.targetUrl.value;
            let imgSrc = this.elements.imgSrc.value;
            
            localConfig.iconGrid.push([name, targetUrl, imgSrc]);        
            renderIconGrid(iconGridSection, localConfig.iconGrid);
            setConfig(localConfig);
    
            this.remove();
        });
        const quitBtn = getElem(".quit-settings");
        quitBtn.addEventListener("click", () => {
            form.remove();
        });
    });
});