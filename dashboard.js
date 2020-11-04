function build_topics_section(preferences, topic_wrapper) {
    // length without () ?
    for (i=0; i < preferences.topics.length; i++) {
        const topic = preferences.topics[i];

        let topic_container = build_topic_container(topic);
        topic_wrapper.appendChild(topic_container);
    }
}
function build_topic_container(topic) {

    let topic_container = document.createElement('div');
    topic_container.className = 'topic-container';

    let topic_name = document.createElement('p');
    topic_name.className = 'topic-name';
    topic_name.textContent = topic.name;
    topic_container.appendChild(topic_name);

    let topic_links_holder = document.createElement('ul');
    topic_links_holder.className = 'topic-links-holder';
    topic_container.appendChild(topic_links_holder);
    
    // create li element for each link ..probably better with forEach but _\00/_
    for (n=0; n < topic.links.length; n++) {
        
        let li = document.createElement('li');
        li.className = 'topic-link';

        let link = document.createElement('a');
        link.href = topic.links[n][1];
        link.innerHTML = topic.links[n][0];
        li.appendChild(link);   

        topic_links_holder.appendChild(li);
    }
    return topic_container;
}

function add_topic(name) {
    let preferences = JSON.parse(localStorage.getItem(preferences));
    preferences.topics.push({"name": name});
    localStorage.setItem("preferences", JSON.stringify(preferences));
    // add topic to localStor and increase topics_num
}

function remove_topic(name) {
    let preferences = JSON.parse(localStorage.getItem(preferences));
    // remove topic from localStorage and decrease topics_num
}
function add_link(topic_name, name, URL) {
    let preferences = JSON.parse(localStorage.getItem(preferences));
    current_item = NaN;
    for (let i=0; i < preferences.topics.length; i++) {
        if (topic_name == preferences.topics[i].name) {
                preferences.topics[i]["links"].push([name, URL]);
        }
    }
}

function remove_link(name, URL) {
    ;
}
function apply_custom_styling() {
    const preferences = JSON.parse(localStorage.getItem("preferences"));
    console.log(preferences.styling);
    preferences.styling.forEach(css_class => {
        //hier ist etwas falsch
        console.log(css_class.name)
        let elements = document.querySelectorAll(css_class.name);
        console.log(elements);
        elements.forEach(element => {
            for (const [property, value] of Object.entries(styling.properties)) {
                console.log(property + ": " + value);
                element.style[property] = value;
            }
        })
    });
}
function change_property_of_class(class_name, property, value) {

    let styling = JSON.parse(localStorage.getItem("preferences")).styling;
    styling.forEach(css_class => {
        if (!css_class.name) {
            styling.push({"name": class_name, "properties": {property: value}});
        } else {
            css_class.properties[property] = [value];
        }
    }); 
}

function apply_property(hex_value, dom_element_class) {
    let dom_elements = document.querySelectorAll('.' + dom_element_class);
    dom_elements.forEach(element => {
        element.style.backgroundColor = hex_value;
    })
}

const default_preferences = {
    "topics": [
                {
                    "name": "Programming",
                    "links": [
                        ["w3", "https://www.w3schools.com/"],
                        ["Stackoverflow", "https://stackoverflow.com/questions"]
                    ]
                },
                {
                    "name": "Self-Education",
                    "links": [
                        ["Keybr", "https://www.keybr.com/"],
                        ["10FastFingers", "https://10fastfingers.com/typing-test/german"],
                        ["edx", "https://courses.edx.org/dashboard"]
                    ]
                },
                {
                    "name": "Code Challenges",
                    "links": [
                        ["CoderByte", "https://coderbyte.com/"],
                        ["HackerRank", "https://www.hackerrank.com/dashboard"],
                        ["CodeWars", "https://www.codewars.com/"],
                        ["LeetCode", "https://leetcode.com/explore/"],
                        ["CodeChef","https://www.codechef.com/"]
                    ]
                },
                {
                    "name": "Design",
                    "links": [
                        ["Figma", "https://www.figma.com"],
                        ["FontAwsome", "https://fontawesome.com/icons?d=gallery&m=free"],
                        ["GoogleFonts", "https://fonts.google.com/"]
                    ]
                },
                {
                    "name": "News",
                    "links": [
                        ["Tagesschau", "https://www.tagesschau.de/"],
                        ["YCHackerNews", "https://news.ycombinator.com/"]
                    ]
                },
                {
                    "name": "Util",
                    "links": [
                        ["GoogleDrive", "https://drive.google.com/drive/my-drive"],
                        ["GitHub", "https://github.com/"],
                        ["DockerHub", "https://hub.docker.com/?ref=login"]
                    ]
                }
    ],
    "styling": [
        {
            "class": "topic-container",
            "properties": {
                "backgroundColor": "#ffffff",
                "border": "1px solid green"
            }
        },
        {
            "class": "topic-wrapper",
            "properties": {
                "backgroundColor": "#030303"
            }
        }
    ]
};



// Main Program
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('preferences')) {
        localStorage.setItem('preferences', JSON.stringify(default_preferences));
    };
    let preferences = JSON.parse(localStorage.getItem("preferences"));
    let topic_wrapper = document.querySelector('#topics-wrapper');
    build_topics_section(preferences, topic_wrapper);

    document.querySelector('form').onsubmit = function() {
        let googleSearchURL;
        let searchterm = document.querySelector('#searchbar').value;
        if (searchterm.includes("http://", 0) || searchterm.includes("https://", 0)) {
            googleSearchURL = searchterm;
        } else {
            googleSearchURL = "https://www.google.com/search?q=" + searchterm.replace(/ +/g, "+");
        }
        // create element to run hyperlink click simulation on
        let a = document.createElement('a');
        a.href = googleSearchURL;
        runClickEvent(a);
    };
});