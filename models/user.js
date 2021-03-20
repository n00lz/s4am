const { exec, execSync }  = require('child_process');
const fs = require('fs');
const { Duplex } = require('stream');

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

function disableUser(username){
    let cli = `samba-tool user disable ${username}`;
    let res = execSync(cli);
    return res;
}

function enableUser(username){
    let cli = `samba-tool user enable ${username}`;
    let res = execSync(cli);
    return res;
}

function resetPassword(username, password){
    let cli = `samba-tool user setpassword ${username} --newpassword=${password}`;
    let res = execSync(cli);
    return res;
}

function getNewTicket(){
    let cli = 'kinit administrator@WWFX.INT -kt /root/krb5.keytab';
    let res = cmd(cli);
    return res;
}

function disabledUsers(){
    let commands = [];
    commands.push("ldapsearch -H ldap://192.168.20.2 -Y GSSAPI -b 'DC=wwfx,DC=int' '(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))'");
    commands.push("sed -n 's/^[ \t]*uid:[ \t]*\\(.*\\)/\\1/p'");
    let cli = commands.join('|');
    console.log(cli);
    let res = execSync(cli);
    return res.toString().split('\n').filter(function(i){return i});
}

function getUsers(){
    let users = {'result': []};
    let dUsers = disabledUsers();
    // let commands = [];
    // commands.push('samba-tool user list');
    // commands.push('egrep -v "Guest|krbtgt"');
    // let cli = commands.join('|');
    // let res = ('samba-tool user list|egrep -v "Guest|krbtgt"');
    let cli = execSync('pdbedit -Lf');
    let listUsers = cli.toString().split('\n');

    for(let i = 0;  i < listUsers.length; i++){
        if(listUsers[i].split(':')[2]){
            users['result'].push({'username': listUsers[i].split(':')[0], 'id': listUsers[i].split(':')[1], 'fullName': listUsers[i].split(':')[2]});
        }
    }

    // Remove disabled users from users array
    for(let i = 0; i < users.result.length; i++){
        dUsers.forEach(user => {
            if(user == users.result[i].username){
                users.result.splice(i, 1);
            }
        })
    }

    return users;
}

exports.createUser = createUser;
exports.resetPassword = resetPassword;
exports.getNewTicket = getNewTicket;
exports.deleteUser = deleteUser;
exports.disableUser = disableUser;
exports.enableUser = enableUser;
exports.disabledUsers = disabledUsers;
exports.getUsers = getUsers;