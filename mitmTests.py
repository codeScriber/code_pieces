from __future__ import print_function
from exceptions import *
import sys
import os.path
import datetime
from base64 import b64encode

def response(context ,flow):
	try:
		request = flow.request;
		response = flow.response;
		ip = request.client_conn.address[0];
		print("request/response for ip: {}".format(ip))
		with open('/home/builder/tests/proxy_results/'+ip+".log", 'a') as log:
			host = request.headers.get_first('host', '')
			log.write('------------------request_'+ host + "_" + datetime.datetime.strftime(datetime.datetime.now(), '%Y_%m_%d_%H:%M:%s') + '------------------\n');
			log.write(request._assemble('absolute'));
			log.write('\n');
			log.flush();
			log.write('------------------response_'+ datetime.datetime.strftime(datetime.datetime.now(), '%Y_%m_%d_%H:%M:%s') + '------------------\n');
			ct = response.headers.get_first('content-type')
			ce = response.headers.get_first('content-encoding');
			if ce and (ce == 'gzip' or ce == 'deflate'):
				response.decode();
			if not ct:
				print('error in response, no content type!')
			restowrite = ''
			if ct and (not 'text' in ct  and not 'json' in ct):
				alternate = response._assemble_head()
				if response.content:
					restowrite = alternate + b64encode(response.content)
				else:
					restowrite = alternate
			else:
				restowrite = response._assemble()
			log.write(restowrite)
			log.write('\n------------------end------------------\n');
			log.flush();
	except Exception as e:
		print(str(e), file=sys.stderr);
