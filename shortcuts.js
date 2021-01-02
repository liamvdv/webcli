/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(wts, by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(wts, to=1) {
    if (to >= wts.length) console.log(`<changeWt> ${to} is higher than the number of Webtops you have.`);
    else wts.changeCurrent(to - 1);
}


/* + + + Cli + + + */
const cli = {
    run: function (inputString) {
        if (inputString[0] === ">") this.handle(inputString.slice(1));
        else runSearchEvent(inputString);
    },
    handle: function (str) {
        // decompose str to command and its args and call them. 
        const commandExpressions = str.split("|")
        let pipeStorage;
        let command, args, kwargs; 
        commandExpressions.forEach(commandStr => {
            [command, args, kwargs] = decomposeCommand(commandStr);
            if (pipeStorage !== undefined) kwargs["piped"] = pipeStorage; // pipe through kwargs object

            commandFunc = commandRegistry[command];
            if (!commandFunc) return getEl("#searchbar").value = ""; //TODO: say user that command doesn't exist
            pipeStorage = commandFunc(...args, kwargs); // call command
        });
    }
}

const commandRegistry = {
    l: function (){
        let args = [...arguments]; 
        let kwargs = args.pop();
        let url = "//127.0.0.1:" + args[0]; //port
        runSearchEvent(url, "");
    },
    amz: function () {
        const searchBaseDE = "https://www.amazon.de/s?k=";
        let args = [...arguments]; // not a real array
        let kwargs = args.pop();

        let searchterm = args.join("+");
        let options = "";

        const sort = {
            asc: "&s=price-asc-rank",
            desc: "&s=price-desc-rank",
            new: "&s=date-desc-rank",
            rev: "&s=review-rank"
        }

        if ("s" in kwargs) options += sort[kwargs.s];
        const searchUrl = searchBaseDE + searchterm + options;
        runSearchEvent(searchUrl, "");
    },
    so: function () {
        const searchBase = "https://stackoverflow.com/search?q="
        let args = [...arguments];
        let kwargs = args.pop();

        let searchterm = args.join("+");
        
        //TODO: add options (flags and kwargs) 

        const searchUrl = searchBase + searchterm;
        runSearchEvent(searchUrl, "");
    },
    help: function() {
        const helpPage = "https://github.com/Liamvdv/liamvdv.github.io#quick-start";
        runSearchEvent(helpPage, "");
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