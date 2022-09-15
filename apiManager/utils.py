from rest_framework.response import Response

def api_error(code, msg):
    err_resp = {'error_msg': msg}
    return Response(err_resp, status=code)