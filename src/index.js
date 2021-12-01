/* Globals */
var localConfig = new LocalConfig();

var helpConsole = new HelpConsole();

var wts = new WTS();

var cli = new CLI();

var widgetManager = new WidgetManager();

var g = {
    config: {
        cliEnvVarKey: "cli-environment-key"
    },
    helpPageActive: false
}

document.addEventListener("DOMContentLoaded", function(e) {
    helpConsole.domInit();

    wts.domInit();
    wts.changeCurrent(0);

    cli.domInit();

    const editBtn = getEl("#edit-config");
    editBtn.addEventListener("click", e => new Menu());
    
    // Shortcuts logic
    document.addEventListener("keydown", function (event) {
        if      (event.altKey && event.shiftKey)        rotateWt(1);
        else if (event.altKey && !isNaN(event.key))     changeWt(parseInt(event.key));
        else if (event.altKey && event.ctrlKey && !g.helpPageActive) {
            event.preventDefault();
            new HelpPage();
        }
        else if (cli.isFocused() && event.key === "Enter") cli.run();
        else if (cli.isFocused() && cli.isActive() && event.key === "Tab")cli.cycleKwargs(event);
        else if (cli.isFocused() && event.key === "ArrowUp")              cli.showPriorCommand(event);
        else if (cli.isFocused() && event.key === "ArrowDown")            cli.showNextCommand(event);
    });
});


