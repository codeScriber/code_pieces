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
    .goto('https://services.cal-online.co.il/Card-Holders/Screens/PrintedReports/PrintedReports.aspx')
    .wait('#ctl00_FormAreaNoBorder_FormArea_lgnLogin_UserName')
    .type('#ctl00_FormAreaNoBorder_FormArea_lgnLogin_UserName', argv.u)
    .type('#ctl00_FormAreaNoBorder_FormArea_lgnLogin_Password', argv.p)
    .click('#ctl00_FormAreaNoBorder_FormArea_lgnLogin_LoginImageButton')
    .wait('#ctl00_FormAreaNoBorder_FormArea_CalImageButton1')
    .click('#ctl00_FormAreaNoBorder_FormArea_CalImageButton1')
    .wait('#ReportsGrid > tbody > tr:nth-child(1)')
    .click('#ReportsGrid > tbody > tr:nth-child(1)')
    .end()
    .waitDownloadsComplete()
    .then(() => {
        console.log("finished!!")
    })
    .catch(function (error) {
        console.error('Search failed:', error);
    });

