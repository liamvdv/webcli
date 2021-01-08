/* + + + Render Webtops + + + */
function render(wt=null, wtConfig=null) {
    if (!wt) wt = wts.current;
    else if (typeof wt === String) wt = wts[wt];

    if (!wtConfig) wtConfig = localConfig.get("all", wt.id);

    wt.innerHTML = ""; // reset

    let func;
    Object.keys(wtConfig).forEach(widgetName => {
        if (wtConfig[widgetName] !== null) {
            func = widgetRegistry[widgetName].render;
            func(wtConfig[widgetName], wt);
        }
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

function renderSearch(searchData, wt=null) {
    if (!wt) wt = wts.current;

    const searchEl = createSearch();
    addPositioning(searchEl, ...searchData.positioning);
    const searchbarEl = createSearchbarEl(searchData.placeholderText);
    searchEl.appendChild(searchbarEl);

    wt.appendChild(searchEl);

}

function runSearchEvent(searchterm, engineBaseUrl=null) { // helper for createSearchbarListener
    if (engineBaseUrl === null) engineBaseUrl = localConfig.get("search").engineBaseUrl;

    let searchUrl;
    if (searchterm.startsWith("http://") 
        || searchterm.startsWith("https://")
        || searchterm.startsWith("www")
        ) searchUrl = searchterm;
    else searchUrl = engineBaseUrl + searchterm.replace(/\s+/g, "+");

    const a = create("a", {href: searchUrl});
    runClickEvent(a);
}