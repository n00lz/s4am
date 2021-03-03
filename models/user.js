const { exec, execSync }  = require('child_process');
const fs = require('fs');

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
    
function createUser(username, password, givenName, surname){
    let commands = [];
    commands.push(`samba-tool user create ${username} ${password} --given-name=${givenName} --surname=${surname}`);
    commands.push('bash unix_id.sh ' + username);
    let cli = commands.join(' && ');
    let res = cmd(cli);
    // Add unix attributes to a user
    // const unixAttr = execSync('bash unix_id.sh ' + username);
    // console.log(unixAttr.toString());
    // let userSid = cmd(`wbinfo --name-to-sid ${username}`);
    // let userXid = cmd(`wbinfo --sid-to-uid ${userSid}`);
    // let userId = `3${userXid}`;
    // // Create ldif file to add unix attributes for user
    // let ldif = [
    //     `dn: CN = ${givenName} ${surname}, CN = Users, DC = wwfx, DC = int\n`,
    //     `changetype: modify\n`,
    //     'add: uid\n',
    //     `uid: ${username}\n`,
    //     '-\n',
    //     'add: msSFU30Name\n',
    //     `msSFU30Name: ${username}\n`,
    //     '-\n',
    //     'add: msSFU30NisDomain\n',
    //     'msSFU30NisDomain: WWFX\n',
    //     '-\n',
    //     'add: uidNumber\n',
    //     `uidNumber: 111111\n`,
    //     '-\n',
    //     'add: gidNumber\n',
    //     'gidNumber: 1000\n',
    //     '-\n',
    //     'add: loginShell\n',
    //     'loginShell: /bin/bash\n',
    //     '-\n',
    //     'add: unixHomeDirectory\n',
    //     `unixHomeDirectory: /home/${username}`
    // ];
    // // Append ldif array to a ldif file
    // ldif.forEach(element => {
    //     fs.appendFileSync('user.ldif', element, (err) => {
    //         if(err) throw err;
    //         console.log('Data was appended successfuly.');
    //     })
    // });
    return res;
}

function deleteUser(username){
    let cli = `samba-tool user delete ${username}`;
    let res = execSync(cli);
    return res;
}

function resetPassword(username, password){
    let cli = `samba-tool user setpassword ${username} --newpassword=${password}`;
    let res = execSync(cli);
    return res;
}

function getUsers(){
    let users = {'result': []};
    // let commands = [];
    // commands.push('samba-tool user list');
    // commands.push('egrep -v "Guest|krbtgt"');
    // let cli = commands.join('|');
    // let res = ('samba-tool user list|egrep -v "Guest|krbtgt"');
    let cli = execSync('pdbedit -Lf');
    let listUsers = cli.toString().split('\n');
    // console.log(listUsers[0].split(':')[2]);

    for(let i = 0;  i < listUsers.length; i++){
        if(listUsers[i].split(':')[2]){
            users['result'].push({'username': listUsers[i].split(':')[0], 'fullName': listUsers[i].split(':')[2]});
        } //else {
        //     users['result'].push({'username': user.split(':')[0], 'fullName': user.split(':')[0]()});
        // }
    }
    return users;
}

exports.createUser = createUser;
exports.resetPassword = resetPassword;
exports.deleteUser = deleteUser;
exports.getUsers = getUsers;