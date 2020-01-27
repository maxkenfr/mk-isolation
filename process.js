process.on('message', function(message) {
    let {filePath, args} = JSON.parse(message);
    function sendAndClose(err, data) {
        process.send(JSON.stringify({
            data : data,
            err : err.message || err
        }));
        process.exit();
    }
    require(filePath)(...args)
        .then(res=>sendAndClose(null, res))
        .catch(err=>sendAndClose(err));
});