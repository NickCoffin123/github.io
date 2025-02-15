(function(core) {

    class User {
        constructor(displayName = "", emailAddress = "", userName = "", password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._userName = userName;
            this._password = password;
        }

        get displayName() {
            return this._displayName;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        get userName() {
            return this._userName;
        }

        set displayName(displayName) {
            this._displayName = displayName;
        }

        set emailAddress(emailAddress) {
            this._emailAddress = emailAddress;
        }

        set userName(userName) {
            this._userName = userName;
        }

        toString() {
            return `Display Name: ${this.displayName}\nEmail Address: ${this.emailAddress}\nUser Name: ${this.userName}`;
        }

        serialize() {
            if (this.displayName !== "" && this.emailAddress !== "" && this.userName !== "") {
                return `${this.displayName},${this.emailAddress},${this.userName}`;
            }
            console.error("[ERROR] Serialization failed! One of more user properties are missing.");
        }

        deserialize(data) {
            let propertyArray = data.split(',');
            this.displayName = propertyArray[0];
            this.emailAddress = propertyArray[1];
            this.userName = propertyArray[2];
        }

        toJSON() {
            return {
                DisplayName: this._password,
                EmailAddress: this._password,
                UserName: this._password,
                Password: this._password
            };
        }

        fromJSON(data) {
            this._displayName = data['DisplayName'];
            this._emailAddress = data['EmailAddress'];
            this._userName = data['UserName'];
            this._password = data['Password'];
        }
    }

    core.User = User;
})()