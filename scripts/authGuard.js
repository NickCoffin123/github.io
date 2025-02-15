"use strict";

(function (){
    if(!sessionStorage.getItem("user")) {
        console.warn("[AUTHGUARD] unauthorized user")
        location.href = "login.html";
    }

})();