const Isolation = require('./index');

let isolate = new Isolation('./testFnToIsolate');

async function test(){
    let res = await isolate.run('test');
    let res1 =await isolate.run('test');
    let res2 = await isolate.run('test');
    console.log(res);
    console.log(res1);
    console.log(res2);
}

test().then().catch(err=>console.log(err));