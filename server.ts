/**
 * @file Contains the code too run the web server that runs the level editor.
 * @author Marcus Bartlett
 */

import * as fs from "node:fs/promises"
import * as http from "node:http";
import * as path from "node:path";

/** The port the web server listens for requests (on the localhost) on. */
const PORT = 8000;

/** The relative path to the editor html document. */
const WEBPAGE_PATH = path.sep + "editor.html";

/** 
 * The index page's key in the read files map, i.e., the HTTP request path to 
 * the index.html file. */
const INDEX_PAGE_KEY = "/";

/** The relative path to the level editor's stylesheet. */
const STYLESHEET_PATH = path.sep + "css" + path.sep + "editor.css";

/** The relative path to the level editor's main script. */
const SCRIPT_PATH = path.sep + "js" + path.sep + "editor" + path.sep + "editor.mjs";

/** The relative path to the script containing the App class. */
const APP_PATH = path.sep + "js" + path.sep + "editor" + path.sep + "app.mjs";

/** The relative path to the script containing the Tilemap class. */
const TILEMAP_PATH = path.sep + "js" + path.sep + "editor" + path.sep + "tilemap.mjs";

/** The relative path to the sprite sheet. */
const SPRITES_PATH = path.sep + "img" + path.sep + "sheet_16.png";

/** The relative path to the favicon. */
const FAVICON_PATH = path.sep + "favicon.ico";

/** Drives the program. */
function main() {
    let ws = new WebServer();
    ws.start();
}

/** Contains the functions and properties to run the web server. */
class WebServer {
    /** A map of read files. The key is the HTTP request path to the file. */
    private _readFiles: Map<string, Buffer>

    /** Constructs a WebServer object. */
    constructor() {
        this._readFiles = new Map();
        this.registerFile(WEBPAGE_PATH, INDEX_PAGE_KEY);
        this.registerFile(STYLESHEET_PATH);
        this.registerFile(SCRIPT_PATH);
        this.registerFile(SPRITES_PATH);
        this.registerFile(APP_PATH);
        this.registerFile(TILEMAP_PATH);
        this.registerFile(FAVICON_PATH);
    }

    /** Starts listening for and handles HTTP requests. */
    start() {
        let server = http.createServer(async (theReq:http.IncomingMessage, 
                                        theRes:http.ServerResponse) => {
            if (theReq.url != undefined) {
                let resource = theReq.url;
                let type = "";
                let ext = path.extname(resource);
                if (ext === ".html") {
                    type = "text/html";
                } else if (ext === ".js" || ext === ".mjs") {
                    type = "text/javascript"
                } else if (ext === ".css") {
                    type = "text/css";
                } else if (ext === ".png") {
                    type = "image/png";
                } else if (ext === ".ico") {
                    type = "image/vnd.microsoft.icon";
                }
                theRes.setHeader("Content-Type", type);
                theRes.writeHead(200);
                let contents: Buffer | undefined;
                if (this._readFiles.has(resource)) {
                    contents = this._readFiles.get(resource);
                } else {
                    // Read whatever is requested that was not read manually.
                    // This shouldn't happen but is here as a safety valve.
                    console.log(`${resource} requested. Reading...`);
                    resource = resource.split("/").join(path.sep);
                    await fs.readFile(process.cwd() + resource)
                        .then((theContents) => {
                            contents = theContents;
                        })
                        .catch((theError) => {
                            console.error(theError);
                            process.exit(1);
                        });
                    console.log("Done.");
                }
                theRes.end(contents);
            }
        });
        server.listen(PORT, "localhost", () => {
            console.log("Web server is now running. Open a web browser and " + 
                "visit http://localhost:" + PORT + " to use the level editor."
            );
            console.log("Press Ctrl + C to kill web server.");
        });
    }

    /**
     * Reads a file and registers it to the _readFiles map.
     * @param thePath - The relative path to the file to be read.
     * @param theKey - The optional key in the _readFiles map.
     */
    private registerFile(thePath: string, theKey?: string) {
        fs.readFile(process.cwd() + thePath)
            .then((theContents) => {
                let k: string;
                if (theKey === undefined) {
                    k = thePath.split(path.sep).join("/");
                } else {
                    k = theKey;
                }
                this._readFiles.set(k, theContents);
            })
            .catch((theError) => {
                console.error(theError);
                process.exit(1);
            })
    }
}

main();
