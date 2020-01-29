const { fork } = require('child_process');
const path = require("path");

async function isolate(filePath = "", args = []) {
    return new Promise(function (resolve, reject) {
        let messageToSend = {
            filePath : path.join(path.dirname(module.parent.filename), filePath),
            args
        };
        const child = fork(path.join(__dirname, './process.js'));

        let data = undefined;
        let err = null;

        child.on('message', function(message) {
            try {
                let res = JSON.parse(message);
                data = res.data;
                err = res.err;
            }
            catch (e) {
                err = e;
            }
        });

        child.on('close', function() {
            if (err) reject(new Error(err));
            else resolve(data);
        });

        child.send(JSON.stringify(messageToSend));
    })
}

module.exports = isolate;