"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_advanced_1 = require("@rive-app/canvas-advanced");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function spawnTiles() {
            for (var i = 0; i < 2; ++i) {
                for (var j = 0; j < 5; ++j) {
                    var tileInstance = file.artboardByName("artboard");
                    var tileMachine = new rive.StateMachineInstance(tile.stateMachineByName("State Machine"), tileInstance);
                    var tapTrigger = void 0;
                    for (var i_1 = 0, l = tileMachine.inputCount(); i_1 < l; i_1++) {
                        var input = tileMachine.input(i_1);
                        switch (input.name) {
                            case "Tap":
                                tapTrigger = input.asTrigger();
                                break;
                            default:
                                break;
                        }
                    }
                    var x = i ? canvas.width - (dim + padX) : padX;
                    var anim = new rive.LinearAnimationInstance(tileInstance.animationByName("Tap / Correct"), tileInstance);
                    var anim2 = new rive.LinearAnimationInstance(tileInstance.animationByName("Tap / Incorrect"), tileInstance);
                    var blockInstance = {
                        x: x,
                        y: j * dim + padY * (j + 1),
                        artboard: tileInstance,
                        machine: tileMachine,
                        anim: anim,
                        anim2: anim2,
                        tapTrigger: tapTrigger
                    };
                    tileMachine.advance(0);
                    blockInstance.artboard.advance(0);
                    tiles.add(blockInstance);
                }
            }
        }
        function isTileClicked(mx, my) {
            for (var i = 0; i < 2; ++i) {
                for (var j = 0; j < 5; ++j) {
                    var x = i ? canvas.width - (dim + padX) : padX;
                    var y = j * dim + padY * (j + 1);
                    if (mx >= x && mx <= x + dim && my >= y && my <= y + dim) {
                        return i * 5 + j;
                    }
                }
            }
            return -1;
        }
        function shuffleArr(array) {
            var _a;
            for (var i = array.length - 1; i > 0; i--) {
                var rand = Math.floor(Math.random() * (i + 1));
                _a = [array[rand], array[i]], array[i] = _a[0], array[rand] = _a[1];
            }
        }
        function renderLoop(time) {
            if (!lastTime) {
                lastTime = time;
            }
            var elapsedTimeMs = time - lastTime;
            var elapsedTimeSec = elapsedTimeMs / 1000;
            lastTime = time;
            renderer.clear();
            renderer.save();
            if (artboardG && artboardBG) {
                var idx = 0;
                if (bgAnim) {
                    bgAnim.advance(elapsedTimeSec);
                    bgAnim.apply(1);
                }
                // for (let i = 0, l = bgMachine.inputCount(); i < l; i++) {
                //   const input = bgMachine.input(i);
                //   // console.log(input, input.name, input.type, input.asNumber().value)
                //   input.asNumber().value += elapsedTimeSec;
                // }
                // 
                if (progressT > 0) {
                    progressT -= 1 * elapsedTimeSec;
                    bgMachineProgress.asNumber().value += 1;
                    if (progressT <= 0) {
                        progressT = 0;
                    }
                }
                bgMachine.advance(elapsedTimeSec);
                renderer.save();
                var x = padX + dim;
                var y = 0;
                renderer.translate(x, y);
                renderer.align(rive.Fit.fitWidth, rive.Alignment.center, {
                    minX: 0,
                    minY: 0,
                    maxX: bgWidth,
                    maxY: canvas.height
                }, artboardBG.bounds);
                artboardBG.advance(elapsedTimeSec);
                // artboardBG.apply(elapsedTimeSec);
                // artboardBG.apply(elapsedTimeSec);
                artboardBG.draw(renderer);
                renderer.restore();
                for (var _i = 0, _a = Array.from(tiles); _i < _a.length; _i++) {
                    var blockInstance = _a[_i];
                    var artboard = blockInstance.artboard, machine = blockInstance.machine, anim = blockInstance.anim, anim2 = blockInstance.anim2, tapTrigger = blockInstance.tapTrigger, x_1 = blockInstance.x, y_1 = blockInstance.y;
                    renderer.save();
                    if (tileAnim[idx].t > 0) {
                        if (tileAnim[idx].type == 1) {
                            anim.advance(elapsedTimeSec);
                            anim.apply(1);
                        }
                        else if (tileAnim[idx].type == 2) {
                            anim2.advance(elapsedTimeSec);
                            anim2.apply(1);
                        }
                        tileAnim[idx].t -= 1 * elapsedTimeSec;
                        if (tileAnim[idx].t <= 0) {
                            tileAnim[idx].t = 0;
                            tileAnim[idx].type = 0;
                            anim.time = 0;
                            anim2.time = 0;
                        }
                    }
                    var textRun = artboard.textRun("Count");
                    textRun.text = tileNums[idx].toString();
                    renderer.translate(x_1, y_1);
                    renderer.align(rive.Fit.contain, rive.Alignment.center, {
                        minX: 0,
                        minY: 0,
                        maxX: dim,
                        maxY: dim
                    }, artboard.bounds);
                    artboard.advance(elapsedTimeSec);
                    artboard.draw(renderer);
                    renderer.restore();
                    idx++;
                }
            }
            renderer.restore();
            rive.requestAnimationFrame(renderLoop);
        }
        var rive, canvas, scaleX, scaleY, padX, padY, dim, bgWidth, renderer, bytes, file, artboardG, bytes2, file2, artboardBG, bgAnim, bgMachine, progressT, bgMachineProgress, i, l, input, tileNums, currTile, currNum, topNum, isCorrect, tileAnim, i, lastTime, tile, tiles, mDown;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, canvas_advanced_1.default)({
                        // Loads Wasm bundle
                        locateFile: function (_) {
                            return "https://unpkg.com/@rive-app/canvas-advanced@2.2.0/rive.wasm";
                        }
                    })];
                case 1:
                    rive = _a.sent();
                    canvas = document.getElementById("rive-canvas");
                    canvas.height = document.documentElement.clientHeight;
                    canvas.width = document.documentElement.clientWidth;
                    scaleX = canvas.width / 1792;
                    scaleY = canvas.height / 922;
                    padX = 10 * scaleX;
                    padY = 10 * scaleY;
                    dim = (canvas.height - padY * 6) / 5;
                    bgWidth = canvas.width - (padX + dim) * 2;
                    renderer = rive.makeRenderer(canvas);
                    return [4 /*yield*/, fetch(new Request("2023-10-23-tile_test-001.riv"))];
                case 2: return [4 /*yield*/, (_a.sent()).arrayBuffer()];
                case 3:
                    bytes = _a.sent();
                    return [4 /*yield*/, rive.load(new Uint8Array(bytes))];
                case 4:
                    file = (_a.sent());
                    artboardG = file.defaultArtboard();
                    return [4 /*yield*/, fetch(new Request("2023-10-23-Background-Test-001.riv"))];
                case 5: return [4 /*yield*/, (_a.sent()).arrayBuffer()];
                case 6:
                    bytes2 = _a.sent();
                    return [4 /*yield*/, rive.load(new Uint8Array(bytes2))];
                case 7:
                    file2 = (_a.sent());
                    artboardBG = file2.defaultArtboard();
                    bgAnim = new rive.LinearAnimationInstance(artboardBG.animationByIndex(0), artboardBG);
                    bgMachine = new rive.StateMachineInstance(artboardBG.stateMachineByName("State Machine"), artboardBG);
                    progressT = 0;
                    for (i = 0, l = bgMachine.inputCount(); i < l; i++) {
                        input = bgMachine.input(i);
                        // console.log(input, input.name, input.type, input.asNumber().value)
                        bgMachineProgress = input;
                    }
                    tileNums = [];
                    currTile = -1;
                    currNum = 1;
                    topNum = 10;
                    isCorrect = false;
                    tileAnim = [];
                    for (i = 0; i < 10; ++i) {
                        tileNums[i] = i + 1;
                        tileAnim[i] = {
                            type: 0,
                            t: 0
                        };
                    }
                    shuffleArr(tileNums);
                    lastTime = 0;
                    tile = file.artboardByName("artboard");
                    tiles = new Set();
                    // console.log(tile);
                    spawnTiles();
                    mDown = false;
                    canvas.addEventListener('mousedown', function (e) {
                        var mx = e.offsetX;
                        var my = e.offsetY;
                        if (!mDown) {
                            mDown = true;
                            currTile = isTileClicked(mx, my);
                            if (currTile > -1) {
                                if (tileAnim[currTile].t == 0) {
                                    if (currNum == tileNums[currTile]) {
                                        isCorrect = true;
                                        currNum++;
                                        tileNums[currTile] = ++topNum;
                                        tileAnim[currTile].type = 1;
                                        tileAnim[currTile].t = 2;
                                        progressT = 0.5;
                                    }
                                    else {
                                        isCorrect = false;
                                        tileAnim[currTile].type = 2;
                                        tileAnim[currTile].t = 2;
                                    }
                                }
                            }
                        }
                    });
                    canvas.addEventListener('mouseup', function (e) {
                        if (mDown) {
                            mDown = false;
                        }
                    });
                    rive.requestAnimationFrame(renderLoop);
                    return [2 /*return*/];
            }
        });
    });
}
main();
