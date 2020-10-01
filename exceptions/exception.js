class Exception {
    constructor(id, message, input = null){
        this.id = id;
        this.message = message;
        this.input = input;
    }
}

module.exports = Exception;