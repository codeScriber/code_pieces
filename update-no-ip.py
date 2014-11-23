import mechanize
import sys
MyUrl ='https://www.no-ip.com/login/';

br = mechanize.Browser();
print "now opening " + MyUrl;
br.open(MyUrl);
print "loggin in";
br.select_form(nr=1);
if len(sys.argv) > 2:
    br['username'] = sys.argv[1]
    br['password'] = sys.argv[2]
else:
    br['username']='user@mail.com';
    br['password']='userPass';
response = br.submit();
print "now getting manage hosts and modify button";
br.follow_link(text='Manage Hosts');
br.follow_link(text='Modify');
print "modifying host";
br.select_form(nr=0);
br.submit();
print "the end!";
