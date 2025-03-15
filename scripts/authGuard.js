"use strict";

let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = sessionTimeout(() => {
        console.warn(`[WARNING] Session expired due to inactivity.]`)
        sessionStorage.removeItem("user")
        window.dispatchEvent(new CustomEvent("sessionExpired"))
    }, 15 * 60 * 1000) // 15 minute timeout.
}

// Reset the session timeout with user activity.
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);

export function AuthGuard(){
    const user = sessionStorage.getItem("user");
    const protectedRoutes = ['/contact-list', '/edit']

    if(!user && protectedRoutes.includes(location.hash.slice(1))) {
        console.warn("[AUTHGUARD] unauthorized user")
        window.dispatchEvent(new CustomEvent("sessionExpired"))
    } else {
        resetSessionTimeout();
    }
}