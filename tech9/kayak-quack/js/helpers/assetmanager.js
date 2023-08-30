class AssetManager {
    constructor(callback) {
        this.loaded = 0;
        this.totalsize = 0;
        this.progress = 0;

        this.images = {};
        this.audio = {};

        this.assetCount = 0;

        this.callback = callback;
    }

    initImageAssets(path) {
        parseAssets(path, (data) => {
            this.assetCount += data.length;
            for (let i = 0; i < data.length; ++i) {
                let url = 'assets/' + data[i].src + '.' + data[i].ext;
                this.loadImage(data[i].id, url, data[i].cw, data[i].ch, data[i].frames ? data[i].frames : 1, null);
            }
        })
    }

    initAudioAssets(path) {
        parseAssets(path, (data) => {
            this.assetCount += data.length;
            for (let i = 0; i < data.length; ++i) {
                let url = 'assets/' + data[i].src + '.' + data[i].ext;
                this.loadAudio(data[i].id, url, null);
            }
        })
    }

    checkProgress() {
        let progress = 0;

        for (let k in this.images) {
            progress += this.images[k].completedPercentage;
        }

        for (let k in this.audio) {
            progress += this.audio[k].completedPercentage;
        }

        this.progress = progress / (this.assetCount * 100) * 100;

        // console.log(progress, this.assetCount);
        if (this.progress >= 100) {
            if (this.callback) {
                this.callback();
            }
        }
    }

    load(obj, url, callback, type) {
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';

        xmlHTTP.onload = function(e) {
            // var blob = new Blob([this.response]);
            // obj.img.src = window.URL.createObjectURL(blob);
            // console.log(obj.completedPercentage)
            // console.log()
            
            obj.img.src = url;

            if (type == 1) {
                // obj.img.preload = 'auto';
            //     // obj.img.autoplay = (/iPad|iPhone|iPod/).test(navigator.userAgent);
                obj.img.autoplay = "";
                // obj.img.muted=true;
                
            }
            
        };

        xmlHTTP.onprogress = (e) => {
            if (e.lengthComputable) {
                if (obj.totalsize == 0) {
                    obj.totalsize = e.total;
                    this.totalsize += e.total;
                }

                obj.completedPercentage = parseInt((e.loaded / e.total) * 100);
                this.loaded += e.loaded;

                this.checkProgress();
            }
        };

        xmlHTTP.onloadstart = (e) => {
            obj.completedPercentage = 0;
        };

        xmlHTTP.onloadend = () => {
            // You can also remove your progress bar here, if you like.
            obj.completedPercentage = 100;

            if (callback) {
                callback();
            }
        }

        xmlHTTP.send();
    }

    loadImage(id, url, cw, ch, frames, callback) {
        this.images[id] = {
            img: new Image(),
            cw: cw,
            ch: ch,
            completedPercentage: 0,
            totalsize: 0,
            frames: frames
        }

        this.load(this.images[id], url, callback);
    }

    loadAudio(id, url, callback) {
        this.audio[id] = {
            img: new Audio(),
            completedPercentage: 0,
            totalsize: 0
        }
        // this.audio[id].img.autoplay = true;
        this.load(this.audio[id], url, callback, 1);
    }
}