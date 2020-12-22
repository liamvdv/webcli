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
        render(this.current, localConfig.data[this.current.id]);
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
    wts.changeCurrent(0);

    const editBtn = getEl("#edit-config");
    editBtn.addEventListener("click", e => {
        renderEditForm();
    });
});

// Shortcuts logic
document.addEventListener("keydown", function (event) {
    if      (event.altKey && event.shiftKey)    rotateWt(wts, 1);
    else if (event.altKey && !isNaN(event.key)) changeWt(wts, parseInt(event.key) - 1);
});
