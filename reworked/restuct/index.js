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
    changeCurrent: function (toWtIdx) {
        if (this.current) this.current.classList.remove("current-wt");

        this.current = this["wt" + toWtIdx];
        this.current.classList.add("current-wt");
    }
}
const localConfig = {
    init: function() {
        this.data = getConfig();
    },
    getFor: function(widgetName) {
        return this.data[wts.current.id][widgetName];
    },
    setFor: function (widgetName, value) {
        ;
    }
}

localConfig.init()


document.addEventListener("DOMContentLoaded", function(e) {
    wts.init();
    
    renderIconGrid(localConfig.data[wts.current.id]["iconGrid"], wts.current);
});

// Shortcuts logic
document.addEventListener("keydown", function (event) {
    if      (event.altKey && event.shiftKey)    rotateWt(wts, 1);
    else if (event.altKey && !isNaN(event.key)) changeWt(wts, parseInt(event.key) - 1);
});

/*
// ###################### Helper Functions ####################################


function createElem(ofString) {
    let template = document.createElement("template");
    template.innerHTML = ofString.trim();
    return template.content;
}

// ####################### End Helper Functions ################################



// ############################### ELEMENTS ####################################

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
*/