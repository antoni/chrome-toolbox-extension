const fs = require('fs')
const readline = require('readline')
const glob = require('glob')

import { filenameFromPath } from "./utils"

let extensionManifest: chrome.runtime.Manifest = {
  "name": "Web Toolbox",
  "author": "Antoni Rościszewski",
  "default_locale": "en",
  "description": "A set of tools for efficiently managing your web and browser experience.",
  "version": "0.5",
  "icons": { "18": "img/18.png", "192": "img/192.png", "24": "img/24.png", "27": "img/27.png", "36": "img/36.png", "48": "img/48.png", "54": "img/54.png", "72": "img/72.png", "96": "img/96.png", "108": "img/108.png", "144": "img/144.png" },
  "permissions": [
    "management",
    "notifications",
    "tabs",
    "http://*/",
    "https://*/"
  ],
  "browser_action": {
    "default_icon": "img/icon.png",
    "default_popup": "popup.html"
  },
  "options_page": "options.html",
  "background": { "scripts": ["js/background.js"] },
  "manifest_version": 2,

  "web_accessible_resources": [
    "img/18.png", "img/192.png", "img/24.png", "img/27.png", "img/36.png", "img/48.png", "img/54.png", "img/72.png", "img/96.png", "img/108.png", "img/144.png"
  ],

  "commands": {
    "_execute_browser_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+Z",
        "linux": "Ctrl+Shift+Z",
        "windows": "Alt+Shift+Z",
        "mac": "Command+Shift+Z"
      }
    }
  }
}

const readFirstLine = (filename: string) => {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  return new Promise(
    (resolve, reject) => {
      rl.on("line", (line: string) => {
        resolve(line)
      });
    })
}

const main = async () => {
  let contentScripts = []
  const matches = glob.sync("./src/content-scripts/*.ts")

  for (const fullTsPath of matches) {
    const filename = filenameFromPath(fullTsPath)
    const contentScriptMatches = ((await readFirstLine(fullTsPath)) as string).slice(3)

    contentScripts.push({
      "matches": JSON.parse(contentScriptMatches),
      "js": [`js/content-scripts/${filename}.js`]
    })
  }

  extensionManifest["content_scripts"] = contentScripts;

  const prettyPrintedJsonObject = (object: Object) => JSON.stringify(object, null, 2)

  fs.writeFile("dist/manifest.json", prettyPrintedJsonObject(extensionManifest), (err: NodeJS.ErrnoException) => {
    if (err) {
      return console.error(err);
    }

    console.log("manifest.json file saved");
  });
}

main()
