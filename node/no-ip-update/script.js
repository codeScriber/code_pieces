var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

var argv = require('optimist')
    .usage('update no-ip domain')
    .demand(['u', 'p'])
    .alias('u', 'user')
    .describe('u', 'user name')
    .alias('p', 'password')
    .describe('p', 'password of the user')
    .argv;

nightmare
  .goto('https://my.noip.com/#!/dynamic-dns')
  .type('#clogs > input:nth-child(1)', argv.u)
  .type('#clogs > input:nth-child(2)', argv.p)
  .click('#clogs > button')
  .wait('#content-wrapper > div.row > div.col-lg-8.col-md-8.col-sm-12 > div:nth-child(1) > div:nth-child(1) > div > div > div > div > div > span.text-bg.text-success')
  .click('#content-wrapper > div.row > div.col-lg-8.col-md-8.col-sm-12 > div:nth-child(1) > div:nth-child(1) > div > div > div > div > div > span.text-bg.text-success')
  .wait('#host-panel > table > tbody > tr > td.hidden-xs.clearfix > div')
  .click('#host-panel > table > tbody > tr > td.hidden-xs.clearfix > div')
  .wait('#host-modal > div > div > div > div > div > form > div.panel-body > div.form-footer.text-right > span')
  .click('#host-modal > div > div > div > div > div > form > div.panel-body > div.form-footer.text-right > span')
  .wait(3000)
  .end()
  .then(function () {
    console.log('finished')
  })  
  .catch(function (error) {
    console.error("failed: " + error)
  }); 
