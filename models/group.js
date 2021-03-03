const { exec, spawn, execSync }  = require('child_process');

function cmd(shell_cmd){
    exec(shell_cmd, (error, stdout, stderr) => {
        if(error){
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        if(stderr != '')
        console.log(`stderr: ${stderr}`);
    })
}


function createGroup(groupName){
    let cli = `samba-tool group add ${groupName}`;
    let res = cmd(cli);
    return res;
}

function deleteGroup(groupname){
    let cli = `samba-tool group delete ${groupname}`;
    let res = execSync(cli);
    return res;
}

function getGroups(){
    let cli = 'samba-tool group list';
    let res = execSync(cli);
    return res.toString().split('\n');
}

exports.createGroup = createGroup;
exports.deleteGroup = deleteGroup;
exports.getGroups = getGroups;