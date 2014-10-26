#!/bin/bash

host=$1

openssl s_client -host ua-cloud.avg.com -port 443 -prexit -showcerts > temp.ssl.certs
gawk -f ~/bin/printLastCert.gawk < temp.ssl.certs > temp.pem
rm temp.ssl.certs
pubkeyname="$(echo $host|tr '\-.' '_').pubkey.der"
openssl x509 -noout -pubkey -in temp.pem |tail -n +2|head -n -1|tr -d '\n'|base64 -d >$pubkeyname
rm temp.pem

