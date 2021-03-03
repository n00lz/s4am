#!/usr/bin/env bash
username="$1"
user_sid=$(wbinfo --name-to-sid $username)
echo "This is user sid: ${user_sid:0:44}"

distinguished_name=$(samba-tool user show $username --attributes=dn)
echo "Name: $distinguished_name"

user_xid=$(wbinfo --sid-to-uid $user_sid)
user_id="3${user_xid:3}" 
echo "This is user sid: $user_id"

touch user.ldif
cat >user.ldif <<EOL
${distinguished_name}
changetype: modify
add: uid
uid: ${username}
-
add: msSFU30Name
msSFU30Name: ${username}
-
add: msSFU30NisDomain
msSFU30NisDomain: WWFX
-
add: uidNumber
uidNumber: ${user_id}
-
add: gidNumber
gidNumber: 1000
-
add: loginShell
loginShell: /bin/bash
-
add: unixHomeDirectory
unixHomeDirectory: /home/${username}
EOL

ldbmodify -H /usr/local/samba/private/sam.ldb user.ldif

if [ $? -ne 0 ] ; then
	echo error
else echo "done"
fi
