"use strict";
// IIFE - Immediately Invoked Functional Expression
(function () {

    function checkLogin(){
        console.log("checking is user logged in...");

        const loginNav = document.getElementById("login");

        if (!loginNav) {
            console.warn("login nav element not found");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if (userSession) {
            loginNav.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Logout`
            loginNav.href = "#"
            loginNav.addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "index.html";
            });
        }
    }

    function updateActiveNavLink() {
        console.log("[INFO] update Active Nav Link");

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a')

        navLinks.forEach(link => {
            if(link.textContent.trim() === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * function to add the header and remove the code from every html page
     * @returns {Promise<void>}
     */
    async function LoadHeader() {
        console.log("Loading Header");


            return fetch("header.html")
                .then(response => response.text())
                .then(data => {
                    document.querySelector("header").innerHTML = data;
                    updateActiveNavLink();
                })
                .catch(error => console.log("[ERROR] Unable to load Header"));

    }

    function DisplayLoginPage() {
        console.log("[INFO] Displaying Login Page");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("submitButton");
        const cancelButton = document.getElementById("cancelButton");

        messageArea.style.display = "none"

        if (!loginButton) {
            console.error("No login button found.")
            return;
        }

        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP response failed. ${response.status}`);
                }

                const jsonData = await response.json();
                //console.log(jsonData);

                const users = jsonData.users;
                if(!Array.isArray(users)) {
                    throw new Error("JSON data doesn't contain an array");
                }

                let success = false;
                let authenticatedUser = null;

                for (const user of users) {
                    if (user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName : authenticatedUser.DisplayName,
                        EmailAddress : authenticatedUser.EmailAddress,
                        Username : authenticatedUser.Username,
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    location.href = "contact-list.html";
                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid Username or Password";

                    document.getElementById("username").focus()
                    document.getElementById("username").select()
                }

            } catch (error) {
                console.error("Login failed", error);
            }
        });

        cancelButton.addEventListener("click", (e) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        });
    }

    function DisplayRegisterPage() {
        console.log("[INFO] Displaying Register Page");
    }

    /**
     * Redirects the user back to the contact-list page.
     */
    function handleCancelClick() {
        location.href = "contact-list.html";
    }

    /**
     * Handles the process of editing an existing contact.
     * @param event
     * @param contact - Contact to update.
     * @param page - Unique contact id.
     */
    function handleEditClick(event, contact, page) {
        event.preventDefault();

        if(!validateForm()){
            alert("Invalid data! Please check your inputs");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Update the contact object with the new values.
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        // Save the updated contact (in local storage).
        localStorage.setItem(page, contact.serialize());

        // Redirect
        location.href = "contact-list.html";
    }

    /**
     * Handels the process of adding a new contact.
     * @param event - the event object to prevent default form submission.
     */
    function handleAddClick(event) {
        event.preventDefault();

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Create the contact in localStorage
        addContact(fullName, contactNumber, emailAddress);

        // Redirect
        location.href = "contact-list.html";
    }

    /**
     * validate the entire form by checking the validity of each input.
     * @returns {boolean}
     */
    function validateForm() {
        return (
            validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress")
        );
    }

    /**
     * Attaches validation event listeners to form input fields dynamically.
     * @param elementId
     * @param event
     * @param handler
     */
    function addEventListenerOnce(elementId, event, handler) {
        // Retrieve element from DOM
        const element = document.getElementById(elementId);

        if(element) {
            // Remove current event if one exists.
            element.removeEventListener(event, handler);

            // Attach currently needed event.
            element.addEventListener(event, handler);
        } else {
            console.warn(`[WARN] Element with id '${elementId}' not found'`)
        }
    }

    function attachValidationListeners() {
        console.log('[INFO] Attaching validation listeners...');

        Object.keys(VALIDATION_RULES).forEach((fieldId) => {
            const field = document.getElementById(fieldId);

            if(!field){
                console.warn(`[WARN] field ${fieldId} not found. Skipping listener`);
                return;
            }
            // Event listener attached with a centeralized validation method.
            addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));

        });
    }

    /**
     * Validates an input based on a predefined validation rule.
     * @param fieldId
     * @returns {boolean} - returns true if valid.
     */
    function validateInput(fieldId) {

        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rules not found for: ${fieldId}`);
            return false;
        }

        // Check for empty input
        if (field.value.trim() === "") {
            errorElement.textContent = "this field is required";
            errorElement.style.display = "block";
            return false;
        }

        // Check against regex expression.
        if(!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;


    }


    /**
     * Centralized validation rules for input fields.
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // Allows for only letters and spaces
            errorMessage: "Full name can only contain letters and spaces."
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact number must be in ###-###-#### format"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Invalid email address"
        }
    }

    function addContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() triggered...");

        if(!validateForm()){
            alert("Form contains errors, please correct before submitting");
            return;
        }


        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = `contact_${(Date.now())}`;
            localStorage.setItem(key, contact.serialize())
            console.log(`[INFO] Contact added: ${key}`);

        } else {
            console.log("[ERROR] Contact serialization failed");
        }

        // Redirect
        location.href = "contact-list.html";
    }

    function DisplayEditPage(){
        console.log("Calling Display Edit Page")

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");

        switch(page){
            case "add": //add contact
            {
                document.title = "Add Contact";
                document.querySelector("main>h1").textContent = "Add Contact";


                if (editButton) {
                    editButton.innerHTML = `<i class=\"fa-solid fa-user-plus\"></i> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");


                }

                addEventListenerOnce("editButton", "click", handleAddClick);
                addEventListenerOnce("cancelButton", "click", handleCancelClick);

                break;
            }
            default: //edit existing
            {

                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) {
                    contact.deserialize(contactData);
                }

                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                addEventListenerOnce("editButton", "click",
                    (event) => handleEditClick(event, contact, page));
                addEventListenerOnce("cancelButton", "click", handleCancelClick);
                break;
            }
        }
    }

    async function DisplayWeather(){

        const apiKey = "e90fdb0efbc170ba98366c6f5c1bbe28";
        const city = "Toronto";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            console.log(data);

            const weatherDataElement = document.getElementById("weatherData")

            weatherDataElement.innerHTML = `<strong>City: </strong>${data.name}<br>
                                            <strong>Temperature: </strong> ${data.main.temp}°C<br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        } catch(error){
            console.log("Error calling weather site");
            document.getElementById("weatherData").textContent = "Unable to fetch weather data";
        }
    }

    async function Start(){

        function DisplayHomePage(){
            console.log("Calling DisplayHomePage");

            DisplayWeather();

            let AboutUsButton = document.getElementById("AboutUsBtn");
            AboutUsButton.addEventListener("click", () => {
                location.href = "about.html";
            });


            document.querySelector("main").insertAdjacentHTML(
                'beforeend',
                `<p id="MainParagraph" class="mt-5">This is my first main paragraph</p>`
            )

            document.body.insertAdjacentHTML(
                'beforeend',
                `<article class="container">
                        <p id="ArticleParagraph" class="mt-3">This is my first article paragraph</p>
                    </article>`
            )

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

            let sendButton = document.getElementById("sendButton");
            let subscribeCheckbox = document.getElementById("subscribeCheckbox");

            sendButton.addEventListener("click", function(){
                if(subscribeCheckbox.checked){
                    addContact(
                        document.getElementById("fullName").value,
                        document.getElementById("contactNumber").value,
                        document.getElementById("emailAddress").value
                    );
                    alert("Contact added!");
                }

            });
        }

        function DisplayContactListPage(){
            console.log("Calling DisplayContact-listPage");

            if(localStorage.length > 0){
                let contactList = document.getElementById("contactList");
                let data = "";

                let keys = Object.keys(localStorage);
                console.log("keys")

                let index = 1;

                for(const key of keys){
                    if(key.startsWith("contact_")){
                        let contactData = localStorage.getItem(key);

                        try{
                            console.log(contactData);
                            let contact = new core.Contact();
                            contact.deserialize(contactData);
                            data += `<tr><th scope="row" class="text-center">${index}</th>
                                     <td>${contact.fullName}</td>
                                     <td>${contact.contactNumber}</td>
                                     <td>${contact.emailAddress}</td>
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen-to-square"></i> Edit
                                        </button>
                                     </td>
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash-can"></i> Delete
                                        </button>
                                     </td>
                                     </tr>`;
                            index++;

                        }catch(error){
                            console.error("Error deserializing of data")
                        }
                    }else{
                        console.warn(`Skipping non-contact key: ${key}`)
                    }
                }
                contactList.innerHTML = data;
            }

            const addButton = document.getElementById("addButton");
            addButton.addEventListener("click", ()=> {
                location.href = "edit.html#add";
            });

            const deleteButtons = document.querySelectorAll("button.delete");
            deleteButtons.forEach((button)=>{
                button.addEventListener("click", function() {
                    if (confirm("Are you sure you want to delete?")){
                        localStorage.removeItem(this.value);
                        location.href = "contact-list.html";
                    }
                });
            });

            const editButtons = document.querySelectorAll("button.edit");
            editButtons.forEach((button)=>{
                button.addEventListener("click", function() {
                    location.href = "edit.html#" + this.value;
                });
            });

        }

        LoadHeader().then(() => {
            checkLogin();
        });

        //console.log("Starting App...");

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
                attachValidationListeners();
                DisplayContactsPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contact-list":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                attachValidationListeners();
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching case for page title.")
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM Fully loaded and parsed")
        Start();
    });
})()
