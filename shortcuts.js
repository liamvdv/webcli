/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(wts, by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(wts, to=1) {
    if (to >= wts.length) helpConsole.log(`<changeWebtop> ${to} is higher than the number of Webtops you have.`);
    else wts.changeCurrent(to - 1);
}


/* + + + Cli + + + */
const cli = {
    init: function() {
        this.el = getSubEl(wts.current, ".searchbar");
        this.history = get("cliHistory") || [];
        this.historyCursor = this.history.length;

        if (this.history.length === 0) {
            helpConsole.log('Hey you look smart! Type ">help" to also be effective.', 10000);
        }
    },
    run: function (inputString) {
        if (inputString[0] === ">") this.handle(inputString.trim().slice(1));
        else runSearchEvent(inputString);
    },
    handle: function (str) {
        if (str === "") return;

        // decompose str to command and its args and call them. 
        this.addToHistory(str);
        const commandExpressions = str.split("|")
        let pipeStorage;
        let command, args, kwargs; 
        commandExpressions.forEach(commandStr => {
            [command, args, kwargs] = decomposeCommand(commandStr);
            if (pipeStorage !== undefined) kwargs["piped"] = pipeStorage; // pipe through kwargs object

            commandFunc = commandRegistry[command];
            if (commandFunc) pipeStorage = commandFunc(args, kwargs);
            else {
                this.el.value = ""; //TODO: say user that command doesn't exist
                helpConsole.log(`'${command}' not a command. Get an overview with >help`);
            }
            // call command
        });
    },
    addToHistory: function(exp) {
        this.history.push(exp);
        console.log(this.history);
        if (this.history.length > 10) {
            while(this.history.length > 10) this.history.shift();
        }
        set("cliHistory", this.history);
    },
    showPriorCommand: function() {
        if (this.historyCursor == 0) return helpConsole.log("Reached history end.");

        this.historyCursor--;
        const exp = this.history[this.historyCursor];
        this.el.value = ">" + exp;
    },
    showNextCommand: function () {
        if (this.historyCursor == this.history.length-1) return helpConsole.log("Reached history start.");

        this.historyCursor++;
        const exp = this.history[this.historyCursor];
        this.el.value = ">" + exp;
    },
    clearHistory: function () {
        set("cliHistory", []);
    }
}


const commandRegistry = {
    l: function (args, kwargs){
        let url = "http://127.0.0.1:" + args[0]; //port
        runSearchEvent(url, "");
    },
    amz: function (args, kwargs) {
        const searchBaseDE = "https://www.amazon.de/s?k=";

        let searchterm = encodeUrl(args.join(" "));
        let options = "";

        const sort = {
            asc: "&s=price-asc-rank",
            desc: "&s=price-desc-rank",
            new: "&s=date-desc-rank",
            rev: "&s=review-rank"
        }

        if (kwargs.s) options += sort[kwargs.s];
        const searchUrl = searchBaseDE + searchterm + options;
        runSearchEvent(searchUrl, "");
    },
    so: function(args, kwargs) {
        const searchBase = "https://stackoverflow.com/search?q="

        let searchterm = encodeUrl(args.join(" "));
        
        //TODO: add options (flags and kwargs) 

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    },
    gh: function(args, kwargs) {
        // Usage: >gh (got to github)
        // Usage: >gh <searchterm>
        let searchBase = "https://www.github.com/"
        let searchterm = "";
        
        // Check for flags
        if (kwargs.h) return helpConsole.log("Usage: gh [<searchterm>]")

        if (args.length > 0) {
            searchBase += "search?q=";
            searchterm = encodeUrl(args.join(" "));
        }

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    },
    help: function(args, kwargs) {
        const helpPage = "https://www.github.com/Liamvdv/liamvdv.github.io";

        let goTo = "#quick-start"
        if (args.length > 0) {
            if (args.length == 1) goTo = "/blob/master/docs/cli.md#" + args[0];
            else return helpConsole.log("Usage: > help [<command>]");
        }
        const searchUrl = helpPage + goTo;  
        runSearchEvent(searchUrl, "");
    }
}

function decomposeCommand(str) {
    // Returns the command name with an array of args and object of kwargs and flags
    let command;
    let args = [];
    let kwargs = {};

    [command, ...unformattedArgs] = str.trim().split(/\s+/);
    let priorKwarg; let priorKwargFlag = false;
    for (let s of unformattedArgs) {
        if (s.startsWith("-")) {
            // its a kwarg or flag
            if (priorKwargFlag) kwargs[priorKwarg] = true; // two following kwargs means that the prior one is a flag.
            else priorKwargFlag = true;
            priorKwarg = s.slice(1); // remove the dash and add as kwarg or flag
        } else {
            // s is a required arg or arg to kwarg
            if (priorKwargFlag) {
                // arg to kwarg
                if (!isNaN(s)) s = parseInt(s);

                kwargs[priorKwarg] = s; 
                priorKwargFlag = false;
                priorKwarg = undefined;
            } else {
                // needed arg to command
                if (isNaN(s)) args.push(s);
                else args.push(parseInt(s));
            }
        }
        if (priorKwargFlag) kwargs[priorKwarg] = true; // if last argument was flag
    }
    return [command, args, kwargs];
}

function encodeUrl(str) {
    return encodeURIComponent(str);
}