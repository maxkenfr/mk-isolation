const Isolation = require('./index');

let isolate = new Isolation('./testFnToIsolate', {cycle:1});

async function test(){
    let res = await isolate.run('test');
    let res1 =await isolate.run('test');
    let res2 = await isolate.run('test');
    let res3 = await isolate.run('test');
    let res4 = await isolate.run('test');
    let res5 = await isolate.run('test');
    console.log(res);
    console.log(res1);
    console.log(res2);
    console.log(res3);
    console.log(res4);
    console.log(res5);
}

test().then().catch(err=>console.log(err));