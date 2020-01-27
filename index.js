const { fork } = require('child_process');
const path = require("path");

const rootDirname = path.dirname(require.main.filename || process.mainModule.filename);

async function isolate(filePath = "", args = []) {
    return new Promise(function (resolve, reject) {
        let messageToSend = {
            filePath : path.join(rootDirname, filePath),
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