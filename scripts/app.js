"use strict";
// IIFE - Immediately Invoked Functional Expression
(function () {

    function Start(){

        function DisplayHomePage(){
            console.log("Calling DisplayHomePage");

            let AboutUsButton = document.getElementById("AboutUsBtn");
            AboutUsButton.addEventListener("click", function(){
                console.log("Button clicked");
                location.href = "about.html";
            });

            let MainContent = document.getElementsByTagName("main")[0];
            let MainParagraph = document.createElement("p");

            MainParagraph.setAttribute("id", "MainParagraph");
            MainParagraph.setAttribute("class", "mt-3");
            MainParagraph.textContent = "This is my first main paragraph.";

            MainContent.appendChild(MainParagraph);

            let FirstString = "This is";
            // String literal example.
            let SecondString = `${FirstString} my second string.`;
            MainParagraph.textContent = SecondString;

            MainContent.appendChild(MainParagraph);

            let DocumentBody = document.body;

            let Article = document.createElement("article");
            let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my first article paragraph.</p>`
            Article.setAttribute("class", "container");
            Article.innerHTML = ArticleParagraph;

            DocumentBody.appendChild(Article);


        }

        function DisplayProductsPage(){
            console.log("Calling DisplayProductsPage");
        }

        function DisplayServicesPage(){
            console.log("Calling DisplayServicesPage");
        }

        function DisplayAboutPage(){
            console.log("Calling DisplayAboutPage");
        }

        function DisplayContactsPage(){
            console.log("Calling DisplayContactPage");
        }

        console.log("Starting App...");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactsPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
        }
    }

    window.addEventListener("load", Start);
})()
