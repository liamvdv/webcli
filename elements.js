/* + + + Render Webtops + + + */
function render(wt=null, wtConfig=null) {
    if (!wt) wt = wts.current;
    else if (typeof wt === String) wt = wts[wt];

    if (!wtConfig) wtConfig = localConfig.get("all", wt.id);

    wt.innerHTML = ""; 

    Object.keys(wtConfig).forEach(widgetName => {
        if (widgetName === "search" && wtConfig[widgetName]) return renderSearchbar(wtConfig[widgetName], wt);
        else if (widgetName === "iconGrid" && wtConfig[widgetName]) return renderIconGrid(wtConfig[widgetName], wt); 
        // add more widgets here with their respective rendering function
    });
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

function createIconGridEl(rows=2, columns=6) {
    const div = create("div", {class: "icon-grid"});
    div.setAttribute("style", `grid-template-rows: repeat(${rows}, 1fr); grid-template-columns: repeat(${columns}, 1fr);`);
    return div;
}

// main function for icon elements
function renderIconGrid(iconGridData, wt=null) {
    if (!wt) wt = wts.current;

    const iconGridEl = createIconGridEl(iconGridData.rows, iconGridData.columns);
    addPositioning(iconGridEl, ...iconGridData.positioning);
    iconGridData.icons.forEach(icon => iconGridEl.appendChild(createIconEl(...icon)));

    remove(".icon-grid", wt);
    wt.appendChild(iconGridEl);
}



/* + + + Searchbar + + + */
function createSearch() {
    return create("div", {class:"search"});
}

function createSearchbarEl(text) {
    return create("input", {class: "searchbar", type: "text", autofocus: true, placeholder: text});
}

function renderSearchbar(searchData, wt=null) {
    if (!wt) wt = wts.current;

    const searchEl = createSearch();
    addPositioning(searchEl, ...searchData.positioning);
    const searchbarEl = createSearchbarEl(searchData.placeholderText);
    searchEl.appendChild(searchbarEl);

    wt.appendChild(searchEl);

    createSearchbarListener(searchbarEl);
}

function runSearchEvent(searchterm, engineBaseUrl="") { // helper for createSearchbarListener
    if (!engineBaseUrl) engineBaseUrl = localConfig.get("search").engineBaseUrl;

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
function createQuitEditListener(formEl) { // helper for multiple
    getSubEl(formEl, ".quit-edit").addEventListener("click", function (event) {
        event.preventDefault();
        formEl.remove();
    });
}

function renderEditFormFor(widgetName) { // helper for createEditMenuEl
    if (widgetName === "iconGrid") renderIconEditForm();
    else if (widgetName === "search") renderSearchEditForm();
    else console.log(`renderEditFormFor ${widgetName} not implemented yet.`);
}

// General
function createEditMenuEl(wtConfig) {
    if (!wtConfig) wtConfig = localConfig.get("all", wts.current.id);

    const div = create("div", {class: "edit-form"});
    div.innerHTML = "<button class='btn quit-edit'>X</button>"

    Object.keys(wtConfig).forEach(widgetName => {
        div.innerHTML += `
            <p>
                ${widgetName}
                <button class="to-edit-form btn" onclick="renderEditFormFor('${widgetName}')">Edit</button>
                <hr>
            </p>
        `.trim();
    });
    return div;
}

function renderEditMenu(wt=null, positioning=defaultEditElPositioning) {
    //TODO: list possible elements and write event handler for each.
    if (!wt) wt = wts.current;
    let wtConfig = localConfig.get("all", wt.id);

    const editMenuEl = createEditMenuEl(wtConfig);
    addPositioning(editMenuEl, ...positioning);

    wt.appendChild(editMenuEl);

    createQuitEditListener(editMenuEl);
    // renderIconEditForm();  // QUIT FIX FOR NOW
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
    createQuitEditListener(formEl);
}

function renderIconEditForm(defaultIcon=["", "", ""], wt=null, positioning=[4, 5, 8, 8]) {
    if (!wt) wt = wts.current;

    const formEl = createIconEditFormEl(...defaultIcon);
    addPositioning(formEl, ...positioning);
    wt.appendChild(formEl);

    createIconEditFormListeners(formEl);
}


// Search

function renderSearchEditForm() {
    // TODO
    console.log("renderSearchEditForm not implemented yet.");
}