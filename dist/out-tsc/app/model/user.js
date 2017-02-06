export var user = (function () {
    function user(email) {
        this.email = email;
    }
    return user;
}());
export var list = (function () {
    function list(isFinished, title, description, language, name, email, users) {
        this.isFinished = isFinished;
        this.title = title;
        this.description = description;
        this.language = language;
        this.name = name;
        this.email = email;
        this.users = users;
    }
    return list;
}());
//# sourceMappingURL=/Users/grubert/WebstormProjects/cas-projekt2.1/src/app/model/user.js.map