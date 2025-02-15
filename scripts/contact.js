"use strict";

(function (core) {
    class Contact {

        /**
         * Constructor for new contact instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * Get the fullName.
         * @returns {*}
         */
        get fullName() {
            return this._fullName;
        }

        /**
         * Set the fullName, some data validation.
         * @param fullName
         */
        set fullName(fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid full name: must be a non-empty string");
            }

            this._fullName = fullName;
        }

        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * Setting contact number using regex for data validation.
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid phone number");
            }
            this._contactNumber = contactNumber;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(emailAddress) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            if (!emailRegex.test(emailAddress)) {
                throw new Error("Invalid email address");
            }
            this._emailAddress = emailAddress;
        }

        /**
         * Converts the contact details into a readable string.
         * @returns {string}
         */
        toString() {
            return `Full Name: ${this._fullName}\n
                Contact Number: ${this._contactNumber}\n
                Email Address: ${this._emailAddress}\n`
        }

        /**
         * Serializes the contact details into a string format for storage
         * @returns {string|null}
         */
        serialize() {
            if (!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more contact properties are invalid.");
                return null;
            }
            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }

        /**
         * Deserializes data coming from storage location.
         * @param data
         */
        deserialize(data) {
            if (typeof data !== "string" || data.split(",").length !== 3) {
                console.error("Invalid data format for deserializing");
                return
            }

            const propertyArray = data.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }

    }
    core.Contact = Contact;
})(core || (core = {}));