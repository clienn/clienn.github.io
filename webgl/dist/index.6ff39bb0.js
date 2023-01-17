// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"lK4D7":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "f64c81136ff39bb0";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"eRSjP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = countries = [
    {
        "capital": "Kabul",
        "code": "af",
        "continent": "Asia",
        "flag": "af.svg",
        "iso": true,
        "name": "Afghanistan"
    },
    {
        "capital": "Mariehamn",
        "code": "ax",
        "continent": "Europe",
        "flag": "ax.svg",
        "iso": true,
        "name": "Aland Islands"
    },
    {
        "capital": "Tirana",
        "code": "al",
        "continent": "Europe",
        "flag": "al.svg",
        "iso": true,
        "name": "Albania"
    },
    {
        "capital": "Algiers",
        "code": "dz",
        "continent": "Africa",
        "flag": "dz.svg",
        "iso": true,
        "name": "Algeria"
    },
    {
        "capital": "Pago Pago",
        "code": "as",
        "continent": "Oceania",
        "flag": "as.svg",
        "iso": true,
        "name": "American Samoa"
    },
    {
        "capital": "Andorra la Vella",
        "code": "ad",
        "continent": "Europe",
        "flag": "ad.svg",
        "iso": true,
        "name": "Andorra"
    },
    {
        "capital": "Luanda",
        "code": "ao",
        "continent": "Africa",
        "flag": "ao.svg",
        "iso": true,
        "name": "Angola"
    },
    {
        "capital": "The Valley",
        "code": "ai",
        "continent": "North America",
        "flag": "ai.svg",
        "iso": true,
        "name": "Anguilla"
    },
    {
        "code": "aq",
        "flag": "aq.svg",
        "iso": true,
        "name": "Antarctica"
    },
    {
        "capital": "St. John's",
        "code": "ag",
        "continent": "North America",
        "flag": "ag.svg",
        "iso": true,
        "name": "Antigua and Barbuda"
    },
    {
        "capital": "Buenos Aires",
        "code": "ar",
        "continent": "South America",
        "flag": "ar.svg",
        "iso": true,
        "name": "Argentina"
    },
    {
        "capital": "Yerevan",
        "code": "am",
        "continent": "Asia",
        "flag": "am.svg",
        "iso": true,
        "name": "Armenia"
    },
    {
        "capital": "Oranjestad",
        "code": "aw",
        "continent": "South America",
        "flag": "aw.svg",
        "iso": true,
        "name": "Aruba"
    },
    {
        "capital": "Georgetown",
        "code": "ac",
        "continent": "Africa",
        "flag": "ac.svg",
        "iso": false,
        "name": "Ascension Island"
    },
    {
        "capital": "Canberra",
        "code": "au",
        "continent": "Oceania",
        "flag": "au.svg",
        "iso": true,
        "name": "Australia"
    },
    {
        "capital": "Vienna",
        "code": "at",
        "continent": "Europe",
        "flag": "at.svg",
        "iso": true,
        "name": "Austria"
    },
    {
        "capital": "Baku",
        "code": "az",
        "continent": "Asia",
        "flag": "az.svg",
        "iso": true,
        "name": "Azerbaijan"
    },
    {
        "capital": "Nassau",
        "code": "bs",
        "continent": "North America",
        "flag": "bs.svg",
        "iso": true,
        "name": "Bahamas"
    },
    {
        "capital": "Manama",
        "code": "bh",
        "continent": "Asia",
        "flag": "bh.svg",
        "iso": true,
        "name": "Bahrain"
    },
    {
        "capital": "Dhaka",
        "code": "bd",
        "continent": "Asia",
        "flag": "bd.svg",
        "iso": true,
        "name": "Bangladesh"
    },
    {
        "capital": "Bridgetown",
        "code": "bb",
        "continent": "North America",
        "flag": "bb.svg",
        "iso": true,
        "name": "Barbados"
    },
    {
        "capital": "Minsk",
        "code": "by",
        "continent": "Europe",
        "flag": "by.svg",
        "iso": true,
        "name": "Belarus"
    },
    {
        "capital": "Brussels",
        "code": "be",
        "continent": "Europe",
        "flag": "be.svg",
        "iso": true,
        "name": "Belgium"
    },
    {
        "capital": "Belmopan",
        "code": "bz",
        "continent": "North America",
        "flag": "bz.svg",
        "iso": true,
        "name": "Belize"
    },
    {
        "capital": "Porto-Novo",
        "code": "bj",
        "continent": "Africa",
        "flag": "bj.svg",
        "iso": true,
        "name": "Benin"
    },
    {
        "capital": "Hamilton",
        "code": "bm",
        "continent": "North America",
        "flag": "bm.svg",
        "iso": true,
        "name": "Bermuda"
    },
    {
        "capital": "Thimphu",
        "code": "bt",
        "continent": "Asia",
        "flag": "bt.svg",
        "iso": true,
        "name": "Bhutan"
    },
    {
        "capital": "Sucre",
        "code": "bo",
        "continent": "South America",
        "flag": "bo.svg",
        "iso": true,
        "name": "Bolivia"
    },
    {
        "capital": "Kralendijk",
        "code": "bq",
        "continent": "South America",
        "flag": "bq.svg",
        "iso": true,
        "name": "Bonaire, Sint Eustatius and Saba"
    },
    {
        "capital": "Sarajevo",
        "code": "ba",
        "continent": "Europe",
        "flag": "ba.svg",
        "iso": true,
        "name": "Bosnia and Herzegovina"
    },
    {
        "capital": "Gaborone",
        "code": "bw",
        "continent": "Africa",
        "flag": "bw.svg",
        "iso": true,
        "name": "Botswana"
    },
    {
        "code": "bv",
        "flag": "bv.svg",
        "iso": true,
        "name": "Bouvet Island"
    },
    {
        "capital": "Bras\xedlia",
        "code": "br",
        "continent": "South America",
        "flag": "br.svg",
        "iso": true,
        "name": "Brazil"
    },
    {
        "capital": "Diego Garcia",
        "code": "io",
        "continent": "Asia",
        "flag": "io.svg",
        "iso": true,
        "name": "British Indian Ocean Territory"
    },
    {
        "capital": "Bandar Seri Begawan",
        "code": "bn",
        "continent": "Asia",
        "flag": "bn.svg",
        "iso": true,
        "name": "Brunei Darussalam"
    },
    {
        "capital": "Sofia",
        "code": "bg",
        "continent": "Europe",
        "flag": "bg.svg",
        "iso": true,
        "name": "Bulgaria"
    },
    {
        "capital": "Ouagadougou",
        "code": "bf",
        "continent": "Africa",
        "flag": "bf.svg",
        "iso": true,
        "name": "Burkina Faso"
    },
    {
        "capital": "Bujumbura",
        "code": "bi",
        "continent": "Africa",
        "flag": "bi.svg",
        "iso": true,
        "name": "Burundi"
    },
    {
        "capital": "Praia",
        "code": "cv",
        "continent": "Africa",
        "flag": "cv.svg",
        "iso": true,
        "name": "Cabo Verde"
    },
    {
        "capital": "Phnom Penh",
        "code": "kh",
        "continent": "Asia",
        "flag": "kh.svg",
        "iso": true,
        "name": "Cambodia"
    },
    {
        "capital": "Yaound\xe9",
        "code": "cm",
        "continent": "Africa",
        "flag": "cm.svg",
        "iso": true,
        "name": "Cameroon"
    },
    {
        "capital": "Ottawa",
        "code": "ca",
        "continent": "North America",
        "flag": "ca.svg",
        "iso": true,
        "name": "Canada"
    },
    {
        "code": "ic",
        "flag": "ic.svg",
        "iso": false,
        "name": "Canary Islands"
    },
    {
        "code": "es-ct",
        "flag": "es-ct.svg",
        "iso": false,
        "name": "Catalonia"
    },
    {
        "code": "es-pv",
        "flag": "es-pv.svg",
        "iso": false,
        "name": "Basque Country"
    },
    {
        "capital": "George Town",
        "code": "ky",
        "continent": "North America",
        "flag": "ky.svg",
        "iso": true,
        "name": "Cayman Islands"
    },
    {
        "capital": "Bangui",
        "code": "cf",
        "continent": "Africa",
        "flag": "cf.svg",
        "iso": true,
        "name": "Central African Republic"
    },
    {
        "code": "cefta",
        "flag": "cefta.svg",
        "iso": false,
        "name": "Central European Free Trade Agreement"
    },
    {
        "code": "ea",
        "flag": "ea.svg",
        "iso": false,
        "name": "Ceuta & Melilla"
    },
    {
        "capital": "N'Djamena",
        "code": "td",
        "continent": "Africa",
        "flag": "td.svg",
        "iso": true,
        "name": "Chad"
    },
    {
        "capital": "Santiago",
        "code": "cl",
        "continent": "South America",
        "flag": "cl.svg",
        "iso": true,
        "name": "Chile"
    },
    {
        "capital": "Beijing",
        "code": "cn",
        "continent": "Asia",
        "flag": "cn.svg",
        "iso": true,
        "name": "China"
    },
    {
        "capital": "Flying Fish Cove",
        "code": "cx",
        "continent": "Asia",
        "flag": "cx.svg",
        "iso": true,
        "name": "Christmas Island"
    },
    {
        "code": "cp",
        "flag": "cp.svg",
        "iso": false,
        "name": "Clipperton Island"
    },
    {
        "capital": "West Island",
        "code": "cc",
        "continent": "Asia",
        "flag": "cc.svg",
        "iso": true,
        "name": "Cocos (Keeling) Islands"
    },
    {
        "capital": "Bogot\xe1",
        "code": "co",
        "continent": "South America",
        "flag": "co.svg",
        "iso": true,
        "name": "Colombia"
    },
    {
        "capital": "Moroni",
        "code": "km",
        "continent": "Africa",
        "flag": "km.svg",
        "iso": true,
        "name": "Comoros"
    },
    {
        "capital": "Avarua",
        "code": "ck",
        "continent": "Oceania",
        "flag": "ck.svg",
        "iso": true,
        "name": "Cook Islands"
    },
    {
        "capital": "San Jos\xe9",
        "code": "cr",
        "continent": "North America",
        "flag": "cr.svg",
        "iso": true,
        "name": "Costa Rica"
    },
    {
        "capital": "Zagreb",
        "code": "hr",
        "continent": "Europe",
        "flag": "hr.svg",
        "iso": true,
        "name": "Croatia"
    },
    {
        "capital": "Havana",
        "code": "cu",
        "continent": "North America",
        "flag": "cu.svg",
        "iso": true,
        "name": "Cuba"
    },
    {
        "capital": "Willemstad",
        "code": "cw",
        "continent": "South America",
        "flag": "cw.svg",
        "iso": true,
        "name": "Cura\xe7ao"
    },
    {
        "capital": "Nicosia",
        "code": "cy",
        "continent": "Europe",
        "flag": "cy.svg",
        "iso": true,
        "name": "Cyprus"
    },
    {
        "capital": "Prague",
        "code": "cz",
        "continent": "Europe",
        "flag": "cz.svg",
        "iso": true,
        "name": "Czech Republic"
    },
    {
        "capital": "Yamoussoukro",
        "code": "ci",
        "continent": "Africa",
        "flag": "ci.svg",
        "iso": true,
        "name": "C\xf4te d'Ivoire"
    },
    {
        "capital": "Kinshasa",
        "code": "cd",
        "continent": "Africa",
        "flag": "cd.svg",
        "iso": true,
        "name": "Democratic Republic of the Congo"
    },
    {
        "capital": "Copenhagen",
        "code": "dk",
        "continent": "Europe",
        "flag": "dk.svg",
        "iso": true,
        "name": "Denmark"
    },
    {
        "code": "dg",
        "flag": "dg.svg",
        "iso": false,
        "name": "Diego Garcia"
    },
    {
        "capital": "Djibouti",
        "code": "dj",
        "continent": "Africa",
        "flag": "dj.svg",
        "iso": true,
        "name": "Djibouti"
    },
    {
        "capital": "Roseau",
        "code": "dm",
        "continent": "North America",
        "flag": "dm.svg",
        "iso": true,
        "name": "Dominica"
    },
    {
        "capital": "Santo Domingo",
        "code": "do",
        "continent": "North America",
        "flag": "do.svg",
        "iso": true,
        "name": "Dominican Republic"
    },
    {
        "capital": "Quito",
        "code": "ec",
        "continent": "South America",
        "flag": "ec.svg",
        "iso": true,
        "name": "Ecuador"
    },
    {
        "capital": "Cairo",
        "code": "eg",
        "continent": "Africa",
        "flag": "eg.svg",
        "iso": true,
        "name": "Egypt"
    },
    {
        "capital": "San Salvador",
        "code": "sv",
        "continent": "North America",
        "flag": "sv.svg",
        "iso": true,
        "name": "El Salvador"
    },
    {
        "capital": "London",
        "code": "gb-eng",
        "continent": "Europe",
        "flag": "gb-eng.svg",
        "iso": false,
        "name": "England"
    },
    {
        "capital": "Malabo",
        "code": "gq",
        "continent": "Africa",
        "flag": "gq.svg",
        "iso": true,
        "name": "Equatorial Guinea"
    },
    {
        "capital": "Asmara",
        "code": "er",
        "continent": "Africa",
        "flag": "er.svg",
        "iso": true,
        "name": "Eritrea"
    },
    {
        "capital": "Tallinn",
        "code": "ee",
        "continent": "Europe",
        "flag": "ee.svg",
        "iso": true,
        "name": "Estonia"
    },
    {
        "capital": "Lobamba, Mbabane",
        "code": "sz",
        "continent": "Africa",
        "flag": "sz.svg",
        "iso": true,
        "name": "Eswatini"
    },
    {
        "capital": "Addis Ababa",
        "code": "et",
        "continent": "Africa",
        "flag": "et.svg",
        "iso": true,
        "name": "Ethiopia"
    },
    {
        "code": "eu",
        "flag": "eu.svg",
        "iso": false,
        "name": "Europe"
    },
    {
        "capital": "Stanley",
        "code": "fk",
        "continent": "South America",
        "flag": "fk.svg",
        "iso": true,
        "name": "Falkland Islands"
    },
    {
        "capital": "T\xf3rshavn",
        "code": "fo",
        "continent": "Europe",
        "flag": "fo.svg",
        "iso": true,
        "name": "Faroe Islands"
    },
    {
        "capital": "Palikir",
        "code": "fm",
        "continent": "Oceania",
        "flag": "fm.svg",
        "iso": true,
        "name": "Federated States of Micronesia"
    },
    {
        "capital": "Suva",
        "code": "fj",
        "continent": "Oceania",
        "flag": "fj.svg",
        "iso": true,
        "name": "Fiji"
    },
    {
        "capital": "Helsinki",
        "code": "fi",
        "continent": "Europe",
        "flag": "fi.svg",
        "iso": true,
        "name": "Finland"
    },
    {
        "capital": "Paris",
        "code": "fr",
        "continent": "Europe",
        "flag": "fr.svg",
        "iso": true,
        "name": "France"
    },
    {
        "capital": "Cayenne",
        "code": "gf",
        "continent": "South America",
        "flag": "gf.svg",
        "iso": true,
        "name": "French Guiana"
    },
    {
        "capital": "Papeete",
        "code": "pf",
        "continent": "Oceania",
        "flag": "pf.svg",
        "iso": true,
        "name": "French Polynesia"
    },
    {
        "capital": "Saint-Pierre, R\xe9union",
        "code": "tf",
        "continent": "Africa",
        "flag": "tf.svg",
        "iso": true,
        "name": "French Southern Territories"
    },
    {
        "capital": "Libreville",
        "code": "ga",
        "continent": "Africa",
        "flag": "ga.svg",
        "iso": true,
        "name": "Gabon"
    },
    {
        "code": "es-ga",
        "flag": "es-ga.svg",
        "iso": false,
        "name": "Galicia"
    },
    {
        "capital": "Banjul",
        "code": "gm",
        "continent": "Africa",
        "flag": "gm.svg",
        "iso": true,
        "name": "Gambia"
    },
    {
        "capital": "Tbilisi",
        "code": "ge",
        "continent": "Asia",
        "flag": "ge.svg",
        "iso": true,
        "name": "Georgia"
    },
    {
        "capital": "Berlin",
        "code": "de",
        "continent": "Europe",
        "flag": "de.svg",
        "iso": true,
        "name": "Germany"
    },
    {
        "capital": "Accra",
        "code": "gh",
        "continent": "Africa",
        "flag": "gh.svg",
        "iso": true,
        "name": "Ghana"
    },
    {
        "capital": "Gibraltar",
        "code": "gi",
        "continent": "Europe",
        "flag": "gi.svg",
        "iso": true,
        "name": "Gibraltar"
    },
    {
        "capital": "Athens",
        "code": "gr",
        "continent": "Europe",
        "flag": "gr.svg",
        "iso": true,
        "name": "Greece"
    },
    {
        "capital": "Nuuk",
        "code": "gl",
        "continent": "North America",
        "flag": "gl.svg",
        "iso": true,
        "name": "Greenland"
    },
    {
        "capital": "St. George's",
        "code": "gd",
        "continent": "North America",
        "flag": "gd.svg",
        "iso": true,
        "name": "Grenada"
    },
    {
        "capital": "Basse-Terre",
        "code": "gp",
        "continent": "North America",
        "flag": "gp.svg",
        "iso": true,
        "name": "Guadeloupe"
    },
    {
        "capital": "Hag\xe5t\xf1a",
        "code": "gu",
        "continent": "Oceania",
        "flag": "gu.svg",
        "iso": true,
        "name": "Guam"
    },
    {
        "capital": "Guatemala City",
        "code": "gt",
        "continent": "North America",
        "flag": "gt.svg",
        "iso": true,
        "name": "Guatemala"
    },
    {
        "capital": "Saint Peter Port",
        "code": "gg",
        "continent": "Europe",
        "flag": "gg.svg",
        "iso": true,
        "name": "Guernsey"
    },
    {
        "capital": "Conakry",
        "code": "gn",
        "continent": "Africa",
        "flag": "gn.svg",
        "iso": true,
        "name": "Guinea"
    },
    {
        "capital": "Bissau",
        "code": "gw",
        "continent": "Africa",
        "flag": "gw.svg",
        "iso": true,
        "name": "Guinea-Bissau"
    },
    {
        "capital": "Georgetown",
        "code": "gy",
        "continent": "South America",
        "flag": "gy.svg",
        "iso": true,
        "name": "Guyana"
    },
    {
        "capital": "Port-au-Prince",
        "code": "ht",
        "continent": "North America",
        "flag": "ht.svg",
        "iso": true,
        "name": "Haiti"
    },
    {
        "code": "hm",
        "flag": "hm.svg",
        "iso": true,
        "name": "Heard Island and McDonald Islands"
    },
    {
        "capital": "Vatican City",
        "code": "va",
        "continent": "Europe",
        "flag": "va.svg",
        "iso": true,
        "name": "Holy See"
    },
    {
        "capital": "Tegucigalpa",
        "code": "hn",
        "continent": "North America",
        "flag": "hn.svg",
        "iso": true,
        "name": "Honduras"
    },
    {
        "capital": "Hong Kong",
        "code": "hk",
        "continent": "Asia",
        "flag": "hk.svg",
        "iso": true,
        "name": "Hong Kong"
    },
    {
        "capital": "Budapest",
        "code": "hu",
        "continent": "Europe",
        "flag": "hu.svg",
        "iso": true,
        "name": "Hungary"
    },
    {
        "capital": "Reykjavik",
        "code": "is",
        "continent": "Europe",
        "flag": "is.svg",
        "iso": true,
        "name": "Iceland"
    },
    {
        "capital": "New Delhi",
        "code": "in",
        "continent": "Asia",
        "flag": "in.svg",
        "iso": true,
        "name": "India"
    },
    {
        "capital": "Jakarta",
        "code": "id",
        "continent": "Asia",
        "flag": "id.svg",
        "iso": true,
        "name": "Indonesia"
    },
    {
        "capital": "Tehran",
        "code": "ir",
        "continent": "Asia",
        "flag": "ir.svg",
        "iso": true,
        "name": "Iran"
    },
    {
        "capital": "Baghdad",
        "code": "iq",
        "continent": "Asia",
        "flag": "iq.svg",
        "iso": true,
        "name": "Iraq"
    },
    {
        "capital": "Dublin",
        "code": "ie",
        "continent": "Europe",
        "flag": "ie.svg",
        "iso": true,
        "name": "Ireland"
    },
    {
        "capital": "Douglas",
        "code": "im",
        "continent": "Europe",
        "flag": "im.svg",
        "iso": true,
        "name": "Isle of Man"
    },
    {
        "capital": "Jerusalem",
        "code": "il",
        "continent": "Asia",
        "flag": "il.svg",
        "iso": true,
        "name": "Israel"
    },
    {
        "capital": "Rome",
        "code": "it",
        "continent": "Europe",
        "flag": "it.svg",
        "iso": true,
        "name": "Italy"
    },
    {
        "capital": "Kingston",
        "code": "jm",
        "continent": "North America",
        "flag": "jm.svg",
        "iso": true,
        "name": "Jamaica"
    },
    {
        "capital": "Tokyo",
        "code": "jp",
        "continent": "Asia",
        "flag": "jp.svg",
        "iso": true,
        "name": "Japan"
    },
    {
        "capital": "Saint Helier",
        "code": "je",
        "continent": "Europe",
        "flag": "je.svg",
        "iso": true,
        "name": "Jersey"
    },
    {
        "capital": "Amman",
        "code": "jo",
        "continent": "Asia",
        "flag": "jo.svg",
        "iso": true,
        "name": "Jordan"
    },
    {
        "capital": "Astana",
        "code": "kz",
        "continent": "Asia",
        "flag": "kz.svg",
        "iso": true,
        "name": "Kazakhstan"
    },
    {
        "capital": "Nairobi",
        "code": "ke",
        "continent": "Africa",
        "flag": "ke.svg",
        "iso": true,
        "name": "Kenya"
    },
    {
        "capital": "South Tarawa",
        "code": "ki",
        "continent": "Oceania",
        "flag": "ki.svg",
        "iso": true,
        "name": "Kiribati"
    },
    {
        "capital": "Pristina",
        "code": "xk",
        "continent": "Europe",
        "flag": "xk.svg",
        "iso": false,
        "name": "Kosovo"
    },
    {
        "capital": "Kuwait City",
        "code": "kw",
        "continent": "Asia",
        "flag": "kw.svg",
        "iso": true,
        "name": "Kuwait"
    },
    {
        "capital": "Bishkek",
        "code": "kg",
        "continent": "Asia",
        "flag": "kg.svg",
        "iso": true,
        "name": "Kyrgyzstan"
    },
    {
        "capital": "Vientiane",
        "code": "la",
        "continent": "Asia",
        "flag": "la.svg",
        "iso": true,
        "name": "Laos"
    },
    {
        "capital": "Riga",
        "code": "lv",
        "continent": "Europe",
        "flag": "lv.svg",
        "iso": true,
        "name": "Latvia"
    },
    {
        "capital": "Beirut",
        "code": "lb",
        "continent": "Asia",
        "flag": "lb.svg",
        "iso": true,
        "name": "Lebanon"
    },
    {
        "capital": "Maseru",
        "code": "ls",
        "continent": "Africa",
        "flag": "ls.svg",
        "iso": true,
        "name": "Lesotho"
    },
    {
        "capital": "Monrovia",
        "code": "lr",
        "continent": "Africa",
        "flag": "lr.svg",
        "iso": true,
        "name": "Liberia"
    },
    {
        "capital": "Tripoli",
        "code": "ly",
        "continent": "Africa",
        "flag": "ly.svg",
        "iso": true,
        "name": "Libya"
    },
    {
        "capital": "Vaduz",
        "code": "li",
        "continent": "Europe",
        "flag": "li.svg",
        "iso": true,
        "name": "Liechtenstein"
    },
    {
        "capital": "Vilnius",
        "code": "lt",
        "continent": "Europe",
        "flag": "lt.svg",
        "iso": true,
        "name": "Lithuania"
    },
    {
        "capital": "Luxembourg City",
        "code": "lu",
        "continent": "Europe",
        "flag": "lu.svg",
        "iso": true,
        "name": "Luxembourg"
    },
    {
        "capital": "Macau",
        "code": "mo",
        "continent": "Asia",
        "flag": "mo.svg",
        "iso": true,
        "name": "Macau"
    },
    {
        "capital": "Antananarivo",
        "code": "mg",
        "continent": "Africa",
        "flag": "mg.svg",
        "iso": true,
        "name": "Madagascar"
    },
    {
        "capital": "Lilongwe",
        "code": "mw",
        "continent": "Africa",
        "flag": "mw.svg",
        "iso": true,
        "name": "Malawi"
    },
    {
        "capital": "Kuala Lumpur",
        "code": "my",
        "continent": "Asia",
        "flag": "my.svg",
        "iso": true,
        "name": "Malaysia"
    },
    {
        "capital": "Mal\xe9",
        "code": "mv",
        "continent": "Asia",
        "flag": "mv.svg",
        "iso": true,
        "name": "Maldives"
    },
    {
        "capital": "Bamako",
        "code": "ml",
        "continent": "Africa",
        "flag": "ml.svg",
        "iso": true,
        "name": "Mali"
    },
    {
        "capital": "Valletta",
        "code": "mt",
        "continent": "Europe",
        "flag": "mt.svg",
        "iso": true,
        "name": "Malta"
    },
    {
        "capital": "Majuro",
        "code": "mh",
        "continent": "Oceania",
        "flag": "mh.svg",
        "iso": true,
        "name": "Marshall Islands"
    },
    {
        "capital": "Fort-de-France",
        "code": "mq",
        "continent": "North America",
        "flag": "mq.svg",
        "iso": true,
        "name": "Martinique"
    },
    {
        "capital": "Nouakchott",
        "code": "mr",
        "continent": "Africa",
        "flag": "mr.svg",
        "iso": true,
        "name": "Mauritania"
    },
    {
        "capital": "Port Louis",
        "code": "mu",
        "continent": "Africa",
        "flag": "mu.svg",
        "iso": true,
        "name": "Mauritius"
    },
    {
        "capital": "Mamoudzou",
        "code": "yt",
        "continent": "Africa",
        "flag": "yt.svg",
        "iso": true,
        "name": "Mayotte"
    },
    {
        "capital": "Mexico City",
        "code": "mx",
        "continent": "North America",
        "flag": "mx.svg",
        "iso": true,
        "name": "Mexico"
    },
    {
        "capital": "Chișinău",
        "code": "md",
        "continent": "Europe",
        "flag": "md.svg",
        "iso": true,
        "name": "Moldova"
    },
    {
        "capital": "Monaco",
        "code": "mc",
        "continent": "Europe",
        "flag": "mc.svg",
        "iso": true,
        "name": "Monaco"
    },
    {
        "capital": "Ulaanbaatar",
        "code": "mn",
        "continent": "Asia",
        "flag": "mn.svg",
        "iso": true,
        "name": "Mongolia"
    },
    {
        "capital": "Podgorica",
        "code": "me",
        "continent": "Europe",
        "flag": "me.svg",
        "iso": true,
        "name": "Montenegro"
    },
    {
        "capital": "Little Bay, Brades, Plymouth",
        "code": "ms",
        "continent": "North America",
        "flag": "ms.svg",
        "iso": true,
        "name": "Montserrat"
    },
    {
        "capital": "Rabat",
        "code": "ma",
        "continent": "Africa",
        "flag": "ma.svg",
        "iso": true,
        "name": "Morocco"
    },
    {
        "capital": "Maputo",
        "code": "mz",
        "continent": "Africa",
        "flag": "mz.svg",
        "iso": true,
        "name": "Mozambique"
    },
    {
        "capital": "Naypyidaw",
        "code": "mm",
        "continent": "Asia",
        "flag": "mm.svg",
        "iso": true,
        "name": "Myanmar"
    },
    {
        "capital": "Windhoek",
        "code": "na",
        "continent": "Africa",
        "flag": "na.svg",
        "iso": true,
        "name": "Namibia"
    },
    {
        "capital": "Yaren District",
        "code": "nr",
        "continent": "Oceania",
        "flag": "nr.svg",
        "iso": true,
        "name": "Nauru"
    },
    {
        "capital": "Kathmandu",
        "code": "np",
        "continent": "Asia",
        "flag": "np.svg",
        "iso": true,
        "name": "Nepal"
    },
    {
        "capital": "Amsterdam",
        "code": "nl",
        "continent": "Europe",
        "flag": "nl.svg",
        "iso": true,
        "name": "Netherlands"
    },
    {
        "capital": "Noum\xe9a",
        "code": "nc",
        "continent": "Oceania",
        "flag": "nc.svg",
        "iso": true,
        "name": "New Caledonia"
    },
    {
        "capital": "Wellington",
        "code": "nz",
        "continent": "Oceania",
        "flag": "nz.svg",
        "iso": true,
        "name": "New Zealand"
    },
    {
        "capital": "Managua",
        "code": "ni",
        "continent": "North America",
        "flag": "ni.svg",
        "iso": true,
        "name": "Nicaragua"
    },
    {
        "capital": "Niamey",
        "code": "ne",
        "continent": "Africa",
        "flag": "ne.svg",
        "iso": true,
        "name": "Niger"
    },
    {
        "capital": "Abuja",
        "code": "ng",
        "continent": "Africa",
        "flag": "ng.svg",
        "iso": true,
        "name": "Nigeria"
    },
    {
        "capital": "Alofi",
        "code": "nu",
        "continent": "Oceania",
        "flag": "nu.svg",
        "iso": true,
        "name": "Niue"
    },
    {
        "capital": "Kingston",
        "code": "nf",
        "continent": "Oceania",
        "flag": "nf.svg",
        "iso": true,
        "name": "Norfolk Island"
    },
    {
        "capital": "Pyongyang",
        "code": "kp",
        "continent": "Asia",
        "flag": "kp.svg",
        "iso": true,
        "name": "North Korea"
    },
    {
        "capital": "Skopje",
        "code": "mk",
        "continent": "Europe",
        "flag": "mk.svg",
        "iso": true,
        "name": "North Macedonia"
    },
    {
        "capital": "Belfast",
        "code": "gb-nir",
        "continent": "Europe",
        "flag": "gb-nir.svg",
        "iso": false,
        "name": "Northern Ireland"
    },
    {
        "capital": "Saipan",
        "code": "mp",
        "continent": "Oceania",
        "flag": "mp.svg",
        "iso": true,
        "name": "Northern Mariana Islands"
    },
    {
        "capital": "Oslo",
        "code": "no",
        "continent": "Europe",
        "flag": "no.svg",
        "iso": true,
        "name": "Norway"
    },
    {
        "capital": "Muscat",
        "code": "om",
        "continent": "Asia",
        "flag": "om.svg",
        "iso": true,
        "name": "Oman"
    },
    {
        "capital": "Islamabad",
        "code": "pk",
        "continent": "Asia",
        "flag": "pk.svg",
        "iso": true,
        "name": "Pakistan"
    },
    {
        "capital": "Ngerulmud",
        "code": "pw",
        "continent": "Oceania",
        "flag": "pw.svg",
        "iso": true,
        "name": "Palau"
    },
    {
        "capital": "Panama City",
        "code": "pa",
        "continent": "North America",
        "flag": "pa.svg",
        "iso": true,
        "name": "Panama"
    },
    {
        "capital": "Port Moresby",
        "code": "pg",
        "continent": "Oceania",
        "flag": "pg.svg",
        "iso": true,
        "name": "Papua New Guinea"
    },
    {
        "capital": "Asunci\xf3n",
        "code": "py",
        "continent": "South America",
        "flag": "py.svg",
        "iso": true,
        "name": "Paraguay"
    },
    {
        "capital": "Lima",
        "code": "pe",
        "continent": "South America",
        "flag": "pe.svg",
        "iso": true,
        "name": "Peru"
    },
    {
        "capital": "Manila",
        "code": "ph",
        "continent": "Asia",
        "flag": "ph.svg",
        "iso": true,
        "name": "Philippines"
    },
    {
        "capital": "Adamstown",
        "code": "pn",
        "continent": "Oceania",
        "flag": "pn.svg",
        "iso": true,
        "name": "Pitcairn"
    },
    {
        "capital": "Warsaw",
        "code": "pl",
        "continent": "Europe",
        "flag": "pl.svg",
        "iso": true,
        "name": "Poland"
    },
    {
        "capital": "Lisbon",
        "code": "pt",
        "continent": "Europe",
        "flag": "pt.svg",
        "iso": true,
        "name": "Portugal"
    },
    {
        "capital": "San Juan",
        "code": "pr",
        "continent": "North America",
        "flag": "pr.svg",
        "iso": true,
        "name": "Puerto Rico"
    },
    {
        "capital": "Doha",
        "code": "qa",
        "continent": "Asia",
        "flag": "qa.svg",
        "iso": true,
        "name": "Qatar"
    },
    {
        "capital": "Brazzaville",
        "code": "cg",
        "continent": "Africa",
        "flag": "cg.svg",
        "iso": true,
        "name": "Republic of the Congo"
    },
    {
        "capital": "Bucharest",
        "code": "ro",
        "continent": "Europe",
        "flag": "ro.svg",
        "iso": true,
        "name": "Romania"
    },
    {
        "capital": "Moscow",
        "code": "ru",
        "continent": "Europe",
        "flag": "ru.svg",
        "iso": true,
        "name": "Russia"
    },
    {
        "capital": "Kigali",
        "code": "rw",
        "continent": "Africa",
        "flag": "rw.svg",
        "iso": true,
        "name": "Rwanda"
    },
    {
        "capital": "Saint-Denis",
        "code": "re",
        "continent": "Africa",
        "flag": "re.svg",
        "iso": true,
        "name": "R\xe9union"
    },
    {
        "capital": "Gustavia",
        "code": "bl",
        "continent": "North America",
        "flag": "bl.svg",
        "iso": true,
        "name": "Saint Barth\xe9lemy"
    },
    {
        "capital": "Jamestown",
        "code": "sh",
        "continent": "Africa",
        "flag": "sh.svg",
        "iso": true,
        "name": "Saint Helena, Ascension and Tristan da Cunha"
    },
    {
        "capital": "Basseterre",
        "code": "kn",
        "continent": "North America",
        "flag": "kn.svg",
        "iso": true,
        "name": "Saint Kitts and Nevis"
    },
    {
        "capital": "Castries",
        "code": "lc",
        "continent": "North America",
        "flag": "lc.svg",
        "iso": true,
        "name": "Saint Lucia"
    },
    {
        "capital": "Marigot",
        "code": "mf",
        "continent": "North America",
        "flag": "mf.svg",
        "iso": true,
        "name": "Saint Martin"
    },
    {
        "capital": "Saint-Pierre",
        "code": "pm",
        "continent": "North America",
        "flag": "pm.svg",
        "iso": true,
        "name": "Saint Pierre and Miquelon"
    },
    {
        "capital": "Kingstown",
        "code": "vc",
        "continent": "North America",
        "flag": "vc.svg",
        "iso": true,
        "name": "Saint Vincent and the Grenadines"
    },
    {
        "capital": "Apia",
        "code": "ws",
        "continent": "Oceania",
        "flag": "ws.svg",
        "iso": true,
        "name": "Samoa"
    },
    {
        "capital": "San Marino",
        "code": "sm",
        "continent": "Europe",
        "flag": "sm.svg",
        "iso": true,
        "name": "San Marino"
    },
    {
        "capital": "S\xe3o Tom\xe9",
        "code": "st",
        "continent": "Africa",
        "flag": "st.svg",
        "iso": true,
        "name": "Sao Tome and Principe"
    },
    {
        "capital": "Riyadh",
        "code": "sa",
        "continent": "Asia",
        "flag": "sa.svg",
        "iso": true,
        "name": "Saudi Arabia"
    },
    {
        "capital": "Edinburgh",
        "code": "gb-sct",
        "continent": "Europe",
        "flag": "gb-sct.svg",
        "iso": false,
        "name": "Scotland"
    },
    {
        "capital": "Dakar",
        "code": "sn",
        "continent": "Africa",
        "flag": "sn.svg",
        "iso": true,
        "name": "Senegal"
    },
    {
        "capital": "Belgrade",
        "code": "rs",
        "continent": "Europe",
        "flag": "rs.svg",
        "iso": true,
        "name": "Serbia"
    },
    {
        "capital": "Victoria",
        "code": "sc",
        "continent": "Africa",
        "flag": "sc.svg",
        "iso": true,
        "name": "Seychelles"
    },
    {
        "capital": "Freetown",
        "code": "sl",
        "continent": "Africa",
        "flag": "sl.svg",
        "iso": true,
        "name": "Sierra Leone"
    },
    {
        "capital": "Singapore",
        "code": "sg",
        "continent": "Asia",
        "flag": "sg.svg",
        "iso": true,
        "name": "Singapore"
    },
    {
        "capital": "Philipsburg",
        "code": "sx",
        "continent": "North America",
        "flag": "sx.svg",
        "iso": true,
        "name": "Sint Maarten"
    },
    {
        "capital": "Bratislava",
        "code": "sk",
        "continent": "Europe",
        "flag": "sk.svg",
        "iso": true,
        "name": "Slovakia"
    },
    {
        "capital": "Ljubljana",
        "code": "si",
        "continent": "Europe",
        "flag": "si.svg",
        "iso": true,
        "name": "Slovenia"
    },
    {
        "capital": "Honiara",
        "code": "sb",
        "continent": "Oceania",
        "flag": "sb.svg",
        "iso": true,
        "name": "Solomon Islands"
    },
    {
        "capital": "Mogadishu",
        "code": "so",
        "continent": "Africa",
        "flag": "so.svg",
        "iso": true,
        "name": "Somalia"
    },
    {
        "capital": "Pretoria",
        "code": "za",
        "continent": "Africa",
        "flag": "za.svg",
        "iso": true,
        "name": "South Africa"
    },
    {
        "capital": "King Edward Point",
        "code": "gs",
        "continent": "Antarctica",
        "flag": "gs.svg",
        "iso": true,
        "name": "South Georgia and the South Sandwich Islands"
    },
    {
        "capital": "Seoul",
        "code": "kr",
        "continent": "Asia",
        "flag": "kr.svg",
        "iso": true,
        "name": "South Korea"
    },
    {
        "capital": "Juba",
        "code": "ss",
        "continent": "Africa",
        "flag": "ss.svg",
        "iso": true,
        "name": "South Sudan"
    },
    {
        "capital": "Madrid",
        "code": "es",
        "continent": "Europe",
        "flag": "es.svg",
        "iso": true,
        "name": "Spain"
    },
    {
        "capital": "Sri Jayawardenepura Kotte, Colombo",
        "code": "lk",
        "continent": "Asia",
        "flag": "lk.svg",
        "iso": true,
        "name": "Sri Lanka"
    },
    {
        "capital": "Ramallah",
        "code": "ps",
        "continent": "Asia",
        "flag": "ps.svg",
        "iso": true,
        "name": "State of Palestine"
    },
    {
        "capital": "Khartoum",
        "code": "sd",
        "continent": "Africa",
        "flag": "sd.svg",
        "iso": true,
        "name": "Sudan"
    },
    {
        "capital": "Paramaribo",
        "code": "sr",
        "continent": "South America",
        "flag": "sr.svg",
        "iso": true,
        "name": "Suriname"
    },
    {
        "capital": "Longyearbyen",
        "code": "sj",
        "continent": "Europe",
        "flag": "sj.svg",
        "iso": true,
        "name": "Svalbard and Jan Mayen"
    },
    {
        "capital": "Stockholm",
        "code": "se",
        "continent": "Europe",
        "flag": "se.svg",
        "iso": true,
        "name": "Sweden"
    },
    {
        "capital": "Bern",
        "code": "ch",
        "continent": "Europe",
        "flag": "ch.svg",
        "iso": true,
        "name": "Switzerland"
    },
    {
        "capital": "Damascus",
        "code": "sy",
        "continent": "Asia",
        "flag": "sy.svg",
        "iso": true,
        "name": "Syria"
    },
    {
        "capital": "Taipei",
        "code": "tw",
        "continent": "Asia",
        "flag": "tw.svg",
        "iso": true,
        "name": "Taiwan"
    },
    {
        "capital": "Dushanbe",
        "code": "tj",
        "continent": "Asia",
        "flag": "tj.svg",
        "iso": true,
        "name": "Tajikistan"
    },
    {
        "capital": "Dodoma",
        "code": "tz",
        "continent": "Africa",
        "flag": "tz.svg",
        "iso": true,
        "name": "Tanzania"
    },
    {
        "capital": "Bangkok",
        "code": "th",
        "continent": "Asia",
        "flag": "th.svg",
        "iso": true,
        "name": "Thailand"
    },
    {
        "capital": "Dili",
        "code": "tl",
        "continent": "Asia",
        "flag": "tl.svg",
        "iso": true,
        "name": "Timor-Leste"
    },
    {
        "capital": "Lom\xe9",
        "code": "tg",
        "continent": "Africa",
        "flag": "tg.svg",
        "iso": true,
        "name": "Togo"
    },
    {
        "capital": "Nukunonu, Atafu,Tokelau",
        "code": "tk",
        "continent": "Oceania",
        "flag": "tk.svg",
        "iso": true,
        "name": "Tokelau"
    },
    {
        "capital": "Nukuʻalofa",
        "code": "to",
        "continent": "Oceania",
        "flag": "to.svg",
        "iso": true,
        "name": "Tonga"
    },
    {
        "capital": "Port of Spain",
        "code": "tt",
        "continent": "South America",
        "flag": "tt.svg",
        "iso": true,
        "name": "Trinidad and Tobago"
    },
    {
        "code": "ta",
        "flag": "ta.svg",
        "iso": false,
        "name": "Tristan da Cunha"
    },
    {
        "capital": "Tunis",
        "code": "tn",
        "continent": "Africa",
        "flag": "tn.svg",
        "iso": true,
        "name": "Tunisia"
    },
    {
        "capital": "Ankara",
        "code": "tr",
        "continent": "Asia",
        "flag": "tr.svg",
        "iso": true,
        "name": "Turkey"
    },
    {
        "capital": "Ashgabat",
        "code": "tm",
        "continent": "Asia",
        "flag": "tm.svg",
        "iso": true,
        "name": "Turkmenistan"
    },
    {
        "capital": "Cockburn Town",
        "code": "tc",
        "continent": "North America",
        "flag": "tc.svg",
        "iso": true,
        "name": "Turks and Caicos Islands"
    },
    {
        "capital": "Funafuti",
        "code": "tv",
        "continent": "Oceania",
        "flag": "tv.svg",
        "iso": true,
        "name": "Tuvalu"
    },
    {
        "capital": "Kampala",
        "code": "ug",
        "continent": "Africa",
        "flag": "ug.svg",
        "iso": true,
        "name": "Uganda"
    },
    {
        "capital": "Kiev",
        "code": "ua",
        "continent": "Europe",
        "flag": "ua.svg",
        "iso": true,
        "name": "Ukraine"
    },
    {
        "capital": "Abu Dhabi",
        "code": "ae",
        "continent": "Asia",
        "flag": "ae.svg",
        "iso": true,
        "name": "United Arab Emirates"
    },
    {
        "capital": "London",
        "code": "gb",
        "continent": "Europe",
        "flag": "gb.svg",
        "iso": true,
        "name": "United Kingdom"
    },
    {
        "code": "un",
        "flag": "un.svg",
        "iso": false,
        "name": "United Nations"
    },
    {
        "capital": "Washington, D.C.",
        "code": "um",
        "continent": "North America",
        "flag": "um.svg",
        "iso": true,
        "name": "United States Minor Outlying Islands"
    },
    {
        "capital": "Washington, D.C.",
        "code": "us",
        "continent": "North America",
        "flag": "us.svg",
        "iso": true,
        "name": "United States of America"
    },
    {
        "code": "xx",
        "flag": "xx.svg",
        "iso": false,
        "name": "Unknown"
    },
    {
        "capital": "Montevideo",
        "code": "uy",
        "continent": "South America",
        "flag": "uy.svg",
        "iso": true,
        "name": "Uruguay"
    },
    {
        "capital": "Tashkent",
        "code": "uz",
        "continent": "Asia",
        "flag": "uz.svg",
        "iso": true,
        "name": "Uzbekistan"
    },
    {
        "capital": "Port Vila",
        "code": "vu",
        "continent": "Oceania",
        "flag": "vu.svg",
        "iso": true,
        "name": "Vanuatu"
    },
    {
        "capital": "Caracas",
        "code": "ve",
        "continent": "South America",
        "flag": "ve.svg",
        "iso": true,
        "name": "Venezuela"
    },
    {
        "capital": "Hanoi",
        "code": "vn",
        "continent": "Asia",
        "flag": "vn.svg",
        "iso": true,
        "name": "Vietnam"
    },
    {
        "capital": "Road Town",
        "code": "vg",
        "continent": "North America",
        "flag": "vg.svg",
        "iso": true,
        "name": "Virgin Islands (British)"
    },
    {
        "capital": "Charlotte Amalie",
        "code": "vi",
        "continent": "North America",
        "flag": "vi.svg",
        "iso": true,
        "name": "Virgin Islands (U.S.)"
    },
    {
        "capital": "Cardiff",
        "code": "gb-wls",
        "continent": "Europe",
        "flag": "gb-wls.svg",
        "iso": false,
        "name": "Wales"
    },
    {
        "capital": "Mata-Utu",
        "code": "wf",
        "continent": "Oceania",
        "flag": "wf.svg",
        "iso": true,
        "name": "Wallis and Futuna"
    },
    {
        "capital": "Laayoune",
        "code": "eh",
        "continent": "Africa",
        "flag": "eh.svg",
        "iso": true,
        "name": "Western Sahara"
    },
    {
        "capital": "Sana'a",
        "code": "ye",
        "continent": "Asia",
        "flag": "ye.svg",
        "iso": true,
        "name": "Yemen"
    },
    {
        "capital": "Lusaka",
        "code": "zm",
        "continent": "Africa",
        "flag": "zm.svg",
        "iso": true,
        "name": "Zambia"
    },
    {
        "capital": "Harare",
        "code": "zw",
        "continent": "Africa",
        "flag": "zw.svg",
        "iso": true,
        "name": "Zimbabwe"
    }
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["lK4D7","eRSjP"], "eRSjP", "parcelRequire8f8a")

//# sourceMappingURL=index.6ff39bb0.js.map
