var page = require('webpage').create();
var system = require('system');
var env = system.env;
console.log('The default user agent is ' + page.settings.userAgent);
if (env['NO_IP_USERNAME'] === undefined || env['NO_IP_USERNAME'] === null || env['NO_IP_USERNAME'] === ''){
    console.log('no user name in env. variables, please define your user name in the ENV as NO_IP_USERNAME and rerun.')
    phantom.exit();
}
if (env['NO_IP_PASSWORD'] === undefined || env['NO_IP_PASSWORD'] === null || env['NO_IP_PASSWORD'] === ''){
    console.log('no password in env. variables, please define your password in the ENV as NO_IP_PASSWORD and rerun.')
    phantom.exit();
}
page.settings.userAgent = 'SpecialAgent';
page.viewportSize = { width: 1920, height: 1080 };
page.open('https://www.noip.com/login', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
    phantom.exit()
  }else{
    console.log("successfully opened the page")
    runAutomation()
  }
})  
//login

function doLogin(){
    var ua = page.evaluate(function(env) {
        var form=document.querySelector('#clogs')
        var name=form.querySelector('input:nth-child(1)')
        var pass=form.querySelector('input:nth-child(2)')
        var username = env['NO_IP_USERNAME']
        var password = env['NO_IP_PASSWORD']
        console.log('will be using user: ' + username + ' pass: ' + password)
        if( form == null || form == undefined ){
            console.log("could not find form")
            phantom.exit()
        }
        if( name != undefined && name != null ){
            name.value=username
        }
        if( pass != undefined && pass != null ){      
            pass.value=password;
        }
        form.submit() 
        return "logged in"
    }, env);
    console.log(ua)
}
function clickOnHost(){
    page.evaluate(function(){
        document.querySelector('#content-wrapper > div.row > div.col-lg-8.col-md-8.col-sm-12 > div:nth-child(1) > div:nth-child(1) > div > div > div > div > span.text-bg.text-success').click()
    })
}

function clickOnModify(){
    page.evaluate(function(){
        document.querySelector('#host-panel > table > tbody > tr > td.hidden-xs.clearfix > div > div').click()
    })
}

function clickOnUpdate(){
    page.evaluate(function(){
        document.querySelector('#host-modal > div > div > div > form > div.panel-body > div.form-footer.text-right > span').click()
    })
}

var printScreenshot=function(isExit){
    page.render('screenshot.jpg')
    if( isExit === true ){
        phantom.exit()
    }
}

function runAutomation(){
    doLogin()
    setTimeout(function(){ 
        clickOnHost()
        setTimeout(function(){
            clickOnModify()
            setTimeout(function(){
               clickOnUpdate()
               console.log("success!")
               phantom.exit()
            },2000)
        },5000)
    }, 10000)
}

