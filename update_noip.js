var page = require('webpage').create();
var system = require('system');
var env = system.env;
page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};
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
conosle.log(new Date());
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
function clickSelectorOrExit(selector, tag){
	var result = page.evaluate(function(selector){
		var domItem = document.querySelector(selector);
		if( domItem != undefined && domItem != null ){
			domItem.click();
			return true;
		}
		return false;
	}, selector);
	if( ! result ){
		console.error("failed to find selector: " + selector);
		printScreenshot(true, tag);
	}
}

function clickOnHost(){
	clickSelectorOrExit('#content-wrapper > div.row > div.col-lg-8.col-md-8' + 
		'.col-sm-12 > div:nth-child(1) > div:nth-child(1) > div > div > div ' + 
		'> div > div > span.text-bg.text-success', 'host');
}

function clickOnModify(){
    clickSelectorOrExit('#host-panel > table > tbody > tr > td.hidden-xs.' + 
		'clearfix > div > div', 'modity');
}

function clickOnUpdate(){
    clickSelectorOrExit('#host-modal > div > div > div > div > div > form > div.panel-body > div.form-footer.text-right > span', 'update');
}

var printScreenshot=function(isExit, tag){
    page.render('screenshot' + tag + '.jpg')
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

