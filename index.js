const { fork } = require('child_process');
const path = require("path");
const {encode, decode} = require("./message");

class Isolation{
    constructor(filePath, options = {}){
        this.filePath = path.join(path.dirname(module.parent.filename), filePath);
        this.child = this._createFork();
        this.cycle = options.cycle || 1;
        this.currentCount = 0;
    }

    _createFork(){
        return fork(path.join(__dirname, './process.js'));
    }

    async _reloadFork(){
        return new Promise((resolve, reject)=> {
            this.child.on('close', ()=> {
                this.child = this._createFork();
                resolve(this.child);
            });
            this.child.send(encode('close'));
        });
    }

    _mustReloadProcess(){
        if (this.currentCount >= this.cycle){
            this.currentCount = 0;
            return true;
        }
        else return false;
    }

    async run(...args){
        if(this._mustReloadProcess()) await this._reloadFork();
        ++this.currentCount;
        return new Promise((resolve, reject)=> {
            this.child.on('message', function(message) {
                try {
                    let {action, data} = decode(message);
                    if (action === "data") {
                        if (data.err) reject(new Error(data.err));
                        else resolve(data.res);
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
            this.child.send(encode('data', {
                filePath : this.filePath,
                args
            }));
        });
    }
}

module.exports = Isolation;