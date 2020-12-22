/* + + + Shortcuts + + + */
// Fire with Alt + Shift
function rotateWt(wts, by=1) {
    let wtNum = parseInt(wts.current.id.slice(-1)); // only works for wts.length <= 10
    let to = (wtNum + by) % wts.length;
    wts.changeCurrent(to);
}

// Fire with Alt + <NUM>
function changeWt(wts, to=0) {
    const maxIdx = wts.length - 1;
    if (to > maxIdx) console.log(`<changeWt> ${to} is higher than the number of Webtops you have.`);
    else wts.changeCurrent(to);
}
