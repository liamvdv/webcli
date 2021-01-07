/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(to=1) {
    if (to == 0 || to > wts.length) helpConsole.log(`<changeWebtop> ${to} is higher than the number of Webtops you have.`);
    else wts.changeCurrent(to - 1);
}


