// asset manager
var AM = null;

function parseAssets(path, callback) {
    fetch(path)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (callback) {
                callback(data.data);
            }  
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });
}

function isMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function shuffleArr(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0');
}

function drawBG(ctx, id) {
    const { img, cw, ch } = AM.images[id];
    ctx.drawImage(img, 0, 0, cw, ch, 0, 0, canvas.width, canvas.height);
}

function isBtnClicked(mx, my, btn) {
    return (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h);
}

function rescaleSize(obj, scaleX, scaleY) {
    obj.w *= scaleX;
    obj.h *= scaleY;
}

function rescaleAll(obj, scaleX, scaleY) {
    obj.x *= scaleX;
    obj.y *= scaleY;
    obj.w *= scaleX;
    obj.h *= scaleY;
}