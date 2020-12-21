const DEFAULT_SEARCH = {
    element: "input",
    attr: {
        class: "search-input",
        id: "search",
        placeholder: "Search the Web",
        autofocus: true
    },
    sub_elements: []
}

const DEFAULT_SEARCH_SECTION = {
    element: "section",
    attr: {
        class: "search-container",
        id: "search-container"
    },
    sub_elements: []
}


// every section has its own object
const DEFAULT_PREFERENCES = {
    search_section: DEFAULT_SEARCH_SECTION,
    grid_links: {
        common_websites: [
            ["DockerHub", "https://hub.docker.com/?ref=login", "https://miro.medium.com/max/3172/1*y6CvfE6WUgoIdT8Mp0Ev_g.png"],
            ["GitHub", "https://www.github.com", ""],
            ["Google Drive", "https://drive.google.com/drive/my-drive", ""],
            ["Docs", "https://docs.google.com/document/u/0/", ""],
            ["Spreadsheets", "https://docs.google.com/spreadsheets/u/0/", ""],
            ["Figma", "https://www.figma.com/", ""],
            ["HackerNews", "https://news.ycombinator.com/", ""]
        ]
    }
}



const DEFAULT_GRID_LINK_SECTION = {
    element: "section",
    attr: {
        class: "link-grid-container",
        id: "link-grid-container"
    },
    sub_elements: []
}


const DEFAULT_LINK_GRID_INNER_ELEM = {
    element: "a",
    attr: {
        href:"",
        target:"_blank" 
    },
    sub_elements: [
        {
            element: "img",
            attr: {
                src: "",
                alt: ""
            },
            sub_elements: [
                DEFAULT_GRID_LINK_SECTION
            ]
        },
        {
            element: "p",
            attr: {},
            sub_elements: []
        }
    ]
}


const DEFAULT_LINK_GRID_ELEM = {
    element: "div",
    attr: {
        class: "link-grid-item",
    },
    sub_elements: [
        DEFAULT_LINK_GRID_INNER_ELEM
    ]
}

const LINK_GRID_SECTION = {
    element: "section",
    attr: {
        class: ".link-grid-container",
        id: "link-grid-section"
        
    },
    sub_elements: [
        DEFAULT_LINK_GRID_ELEM
    ]
}
const DEFAULT_MOUNTPOINT_SELECTOR = "main";

const SUPPORTED_SECTIONS = {
    grid_links: DEFAULT_GRID_LINK_SECTION,
    search_section: DEFAULT_SEARCH_SECTION
}

function getPreferences() {
    /* get the preferences string as an object*/
    return JSON.parse(localStorage.getItem('preferences'));
}

function setPreferences(preferences) {
    /* set the key "preferences" to preferences */
    localStorage.setItem('preferences', JSON.stringify(preferences));
    return preferences;
}

function get_or_setPreferences(prefs) {
    let preferences = getPreferences();
    if (!preferences) {
        preferences = setPreferences(prefs)
    };
    return preferences;
}

function get(selector) {
    return document.querySelector(selector);
}

function getAll(selector) {
    return document.querySelectorAll(selector);
}


function newElem(elem_obj) {
    let elem = document.createElement(elem_obj.element);
    for (let key in elem_obj.attr) {
        elem.setAttribute(key, elem_obj.attr[key]);
    }
    return elem;
}



/* NOTE: THE SUB ELEMETS MUST ONLY BE ONE ELEMENT DEEP! */
function newFullElem(elem_obj) {
    let elem = newElem(elem_obj);
    for (let sub_element of elem_obj.sub_elements) {
        let sub_elem = newElem(sub_element);
        for (let ssub_element of sub_element.sub_elements) {
            let ssub_elem = newElem(ssub_element);
            sub_elem.appendChild(ssub_elem);
        }
        elem.appendChild(sub_elem);
    }
    return elem;
}

function buildLinkGrid(container, preferences) {
    if (!container) {
        return;
    }
    let gridLinksObj = preferences.grid_links;

    gridLinksObj.common_websites.forEach(link => {
        console.log(link);
        container.appendChild(getGridItem(...link));
    });

}

function buildSearch(mountpoint) {
    let searchbar = newFullElem(DEFAULT_SEARCH);

    mountpoint.appendChild(searchbar);
}

function getGridItem(name, url, img_url) {
    let grid_item = newFullElem(DEFAULT_LINK_GRID_ELEM);
    
    grid_item.querySelector("a p").innerHTML = name
    grid_item.querySelector("a").setAttribute("href", url);
    grid_item.querySelector("img").setAttribute("src", img_url);
    return grid_item;
}

/* Allowed_sections keys must match up with section key in DEFAULT Preferences*/
function buildSections(mountpoint, preferences) {
    for (let section in preferences) {
        mountpoint.appendChild(
            newFullElem(SUPPORTED_SECTIONS[section])
        );
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let viewFullScreen = document.getElementById("view-fullscreen");
    if (viewFullScreen) {
        viewFullScreen.addEventListener("click", function() {
            let docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
        });
    }
    runClickEvent(viewFullScreen);
    const preferences = get_or_setPreferences(DEFAULT_PREFERENCES);
    let mountpoint = get(DEFAULT_MOUNTPOINT_SELECTOR);

    buildSections(mountpoint, preferences);

    buildSearch(mountpoint.querySelector(".search-container"));
    buildLinkGrid(mountpoint.querySelector(".link-grid-container"), preferences);

    // add settings button event handler
    const settingsBtn = get("#settings-btn");
    const change = settingsBtn.addEventListener("click", () => {
        linkSettingsForm();
        const form = get("form");
        form.addEventListener("submit", () => {
            let url = form.elements["Url"].value;
            let name = form.elements["Name"].value;
            let img_url = form.elements["Image-Url"].value;
            console.log(form.elements);
            addLink(name, url, img_url, preferences);
            form.remove();
        });
        // Implement way to abort form.
    });

    const searchbar = get(".search-input");
    searchbar.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            runSearchEvent()
        }
    });

});



/* Functions for adding new links to link grid*/
const DEFAULT_LABEL = {
    element: "label",
    attr: {
        for: "",
        class: "text-input-label"
    },
    sub_element: []
}

const DEFAULT_INPUT = {
    element: "input",
    attr: {
        type: "text",
        id: "",
        name: "",
        class: "text-input"
    },
    sub_elements: []
}

const SETTINGS_FORM = {
    element: "form",
    attr: {
        class: "overlay-card",
        id: "settings-card"
    },
    sub_elements: []
}

const SUBMIT_CHANGE_SETTINGS_BUTTON = {
    element: "button",
    attr: {
        class: " btn apply-changes-btn"
    }
}


function linkSettingsForm() {
    let overlay = newElem(SETTINGS_FORM);

    for (let input_for of ["Name", "Url", "Image-Url"]) {
        let label = newElem(DEFAULT_LABEL);
        let input = newElem(DEFAULT_INPUT);
        label.setAttribute("for", input_for);
        input.setAttribute("id", input_for);
        label.setAttribute("name", input_for);
        input.setAttribute("name", input_for);
        label.innerHTML = input_for;
        overlay.appendChild(label);
        overlay.appendChild(input);
    }
    let change_button = newElem(SUBMIT_CHANGE_SETTINGS_BUTTON);
    change_button.innerHTML = "Add link item."
    overlay.appendChild(change_button);
    
    const mainGrid = get("main");
    mainGrid.appendChild(overlay);
}

function addLink(name, url, img_url, preferences) {
    /* add a new link to preferences and rebuild the site, on form submit or on button click? */
    preferences.grid_links.common_websites.push([name, url, img_url]);
    setPreferences(preferences);
    console.log("Updated preferences.")
}

// Will remove all occurances of that name.
function removeLink(name, preferences) {
    let new_preferences = preferences.grid_links.common_websites.filter(function (item) {
        return item[0] !== name
    });
}

function settingsButtonHandler(event) {

}



function runClickEvent(element) {
    var evt = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(evt);
}

function runSearchEvent(event) {
    let googleSearchURL;
    let searchterm = get(".search-input").value;
    if (searchterm.includes("http://", 0) || searchterm.includes("https://", 0)) {
        googleSearchURL = searchterm;
    } else {
        googleSearchURL = "https://www.google.com/search?q=" + searchterm.replace(/ +/g, "+");
    }
    // create element to run hyperlink click simulation on
    let a = document.createElement('a');
    a.href = googleSearchURL;
    runClickEvent(a);
}