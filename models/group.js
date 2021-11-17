const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function cmd(shell_cmd) {
    const { stdout, stderr } = await exec(shell_cmd);
    console.log('stdout:', stdout);
    if(stderr != ''){
        console.error('stderr:', stderr);
    }
    return stdout;
}
// const { exec, spawn, execSync }  = require('child_process');

// function cmd(shell_cmd){
//     exec(shell_cmd, (error, stdout, stderr) => {
//         if(error){
//             console.error(`exec error: ${error}`);
//             return;
//         }
//         console.log(`stdout: ${stdout}`);
//         if(stderr != '')
//         console.log(`stderr: ${stderr}`);
//     })
// }


function createGroup(groupName){
    let cli = `samba-tool group add ${groupName}`;
    let res = cmd(cli);
    return res;
}

async function deleteGroup(groupname){
    let cli = `samba-tool group delete ${groupname}`;
    let res = await cmd(cli);
    return res;
}

async function getGroups(){
    let cli = 'samba-tool group list';
    let res = await cmd(cli);
    return res.toString().split('\n');
}

exports.createGroup = createGroup;
exports.deleteGroup = deleteGroup;
exports.getGroups = getGroups;