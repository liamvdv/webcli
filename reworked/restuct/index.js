const defaultConfig = {
    "webtop0": {
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
    "webtop1": {
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
    "webtop2": {
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

// global vars
let localConfig = getConfig(); // devided by webtop id
let webtops = {
    // "webtopN": webtopElem //id
};
let currentWebtop; // Elem


function setConfig(config) {
    localStorage.setItem('config', JSON.stringify(config));
    return config;
}

function getConfig() {
    const stringConfig = localStorage.getItem("config");

    if (stringConfig) return JSON.parse(stringConfig);
    else return setConfig(defaultConfig);
}


function rotateWebtop(by=1) {
    let wtId = currentWebtop.id;
    let cNum = parseInt(wtId.charAt(wtId.length - 1));
    cNum = (cNum + by) % Object.keys(webtops).length;
    currentWebtop.classList.remove("current-webtop");

    wtId = "#webtop" + cNum;
    currentWebtop = getElem(wtId);
    currentWebtop.classList.add("current-webtop");
}

function changeWebtop(to=0) {
    // to is the Idx so 0 <= to < webtops.length
    let maxIdx = Object.keys(webtops).length-1;
    if (to > maxIdx) console.log(`<changeDesktop> ${to} is higher than the number of Webtops you have.`);
    else {
        let wtId = "#webtop" + to;
        currentWebtop.classList.remove("current-webtop");
        currentWebtop = getElem(wtId);
        currentWebtop.classList.add("current-webtop");
    }
}

function initWebtops() {
    const wts = getElems(".webtop");
    wts.forEach(function (wt, idx) {
        let name = "webtop" + idx;
        webtops[name] = wt;
    });
    currentWebtop = wts[0];
}

document.addEventListener("DOMContentLoaded", function(e) {
    initWebtops();
    renderIconGrid(localConfig[currentWebtop.id]["iconGrid"], currentWebtop, 6, 3, 10, 9);

    const changeBtn = getElem("#change-config-icon")
    changeBtn.addEventListener("click", () => renderIconEditForm()); 
});

document.addEventListener("keydown", function (event) {
    if (event.altKey) {
        if (event.shiftKey) {
            rotateWebtop(1);
            console.log("rotateWebtop fired");
        } else if (!isNaN(event.key)) {
            changeWebtop(parseInt(event.key) - 1);
        }
    } 
});


// ###################### Helper Functions ####################################
function getElem(selector) {
    return document.querySelector(selector);
}
function getElems(selector) {
    return document.querySelectorAll(selector);
}

function createElem(ofString) {
    let template = document.createElement("template");
    template.innerHTML = ofString.trim();
    return template.content;
}

function createSizeStyle(yS, xS, yE, xE) {
    // x = column; y = row;
    // don't worry about adding one, just say from which to which it should span
    const style = `
        grid-area: ${yS} / ${xS} / ${yE+1} / ${xE+1};
    `;
    return style;
}
// ####################### End Helper Functions ################################



// ############################### ELEMENTS ####################################

function createIcon(name, targetUrl, imgSrc) {
    const iconTemplate = `
        <div class="icon">
            <a href="${targetUrl}" target="_blank">
                <img src="${imgSrc}" alt="${name}">
            </a>
        </div>
    `;
    return createElem(iconTemplate);
}

function renderIcon(iconValues, container, rS, cS, rE, cE) {
    // iconValues = [name, targetUrl, imgSrc]
    let iconElem = createIcon(...iconValues); 
    icon.firstElementChild.setAttribute("style", createSizeStyle(rS, cS, rE, cE));
    container.appendChild(icon);
}


function createIconGrid() {
    const iconGrid = document.createElement("div"); // containers can't be templates (appendChild doesn't work properly);
    iconGrid.className = "icon-grid";
    return iconGrid;
}

function renderIconGrid(iconsValues, container, rS, cS, rE, cE) {
    const iconGridElem = createIconGrid();
    iconGridElem.setAttribute("style", createSizeStyle(rS, cS, rE, cE));
    let iconElem;
    iconsValues.forEach(function (iconValues) {
        iconElem = createIcon(...iconValues);
        iconGridElem.appendChild(iconElem);
    });
    container.appendChild(iconGridElem);
}

function createIconEditForm(name="", targetUrl="", imgSrc="") {
    const iconEditTemplate = `
        <form class="overlay-form" id="icon-edit-form">
            <button class="quit-edit btn">X</button>
            <label for="name">Name</label>
            <input type="text" class="text-input" id="name" name="name" value="${name}" required>

            <label for="targetUrl">Url</label>
            <input type="text" class="text-input" id="targetUrl" name="targetUrl" value="${targetUrl}" required>

            <label for="imgSrc">Icon URL</label>
            <input type="text" class="text-input" id="imgSrc" name="imgSrc" value="${imgSrc}" >
            <button class="save-edit btn">Add</button>
        </form>
    `;
    return createElem(iconEditTemplate);
}

function renderIconEditForm(iconDefaultValues=["", "", ""], container=currentWebtop) {  // overlay form, does not take positioning arguments
    const iconEditFormElem = createIconEditForm(...iconDefaultValues);
    container.appendChild(iconEditFormElem); 

    initIconEditFormEventListeners(getElem("#icon-edit-form"));
}

function initIconEditFormEventListeners(elem) {
    console.log(elem);
    const quitBtn = getElem(".quit-edit");
    quitBtn.addEventListener("click", function (event) {
        event.preventDefault();
        elem.remove();
    });

    elem.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = elem.elements.name.value;
        let targetUrl = elem.elements.targetUrl.value;
        let imgSrc = elem.elements.imgSrc.value;
        
        localConfig[currentWebtop.id]["iconGrid"].push([name, targetUrl, imgSrc]);
        setConfig(localConfig);
        
        renderIconGrid(localConfig[currentWebtop.id]["iconGrid"], currentWebtop);
        elem.remove();
    });
} 