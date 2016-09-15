#!/usr/bin/env node

'use strict';

var argv = require('optimist')
    .usage('download visa file to a directory')
    .demand(['d', 'u', 'p'])
    .alias('d', 'directory')
    .describe('d', 'Directory to save the pdf in')
    .alias('u', 'user')
    .describe('u', 'user name')
    .alias('p', 'password')
    .describe('p', 'password of the user')
    .argv;

let path = require('path')
let Nightmare = require('nightmare');
require('nightmare-download-manager')(Nightmare);
let nightmare = Nightmare({ show: true })

nightmare.on('download', function(state, downloadItem){
    if(state == 'started'){
        console.log(downloadItem)
        console.log("downloading..." + downloadItem.filename)
        nightmare.emit('download', path.join(argv.d, downloadItem.filename), downloadItem);
    }
});
nightmare
    .downloadManager()
    .goto('https://service.isracard.co.il/IMS_logon.jsp?customerCode=MTE2MDgwMjAwMDE5MDE0NzE=')
    .wait('#idNumber')
    .type('#idNumber', argv.u)
    .type('#cardNumber', argv.p)
    .click('#userCard > a > img')
    .wait('#second > a > img')
    .click('#second > a > img')
    .end()
    .waitDownloadsComplete()
    .then(() => {
        console.log("finished!!")
    })
    .catch(function (error) {
        console.error('Search failed:', error);
    });

