"use strict";

import { LoadHeader } from "./header.js";

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {

        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/"
            this.loadRoute(path);
        });

        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });

        // Load the initial route when the page first loads
        console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
        this.loadRoute(location.hash.slice(1));
    }

    navigate(path) {
        location.hash = path;
        this.loadRoute(path);  // Ensure content updates
    }

    loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);

        const basePath = path.split("#")[0];

        if (!this.routes[basePath]) {
            console.warn(`[WARN] Route Not Found! ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }

        fetch(this.routes[basePath])
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}`);
                return response.text();
            })
            .then((html) => {
                document.querySelector("main").innerHTML = html;

                LoadHeader().then(() => {
                    document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
