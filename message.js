function encode(action = "unknown", data = {}){
    return `[${action}]${JSON.stringify(data)}`;
}

function decode(message = "") {
    let found = message.match(/^\[([a-zA-Z]+)\]/);
    if (found && found[1]){
        let dataStr = message.replace(found[0], '');
        return {
            action : found[1],
            data : JSON.parse(dataStr)
        }
    }
    else return {action: "unknown", data:{}};
}

module.exports = {
    encode,
    decode
};