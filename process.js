const {decode, encode} = require('./message');

process.on('message', function(message) {
    let {action, data} = decode(message);
    if (action === "data"){
        let {filePath, args} = data;
        function sendRes(err, res) {
            process.send(encode('data', {
                res : res,
                err : err && err.message ? err.message : err
            }));
        }
        require(filePath)(...args)
            .then(res=>sendRes(null, res))
            .catch(err=>sendRes(err));
    }
    else if (action === "close") process.exit();
});