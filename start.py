import http.server

handler_class = http.server.SimpleHTTPRequestHandler
handler_class.extensions_map['.js'] = 'text/javascript'
handler_class.extensions_map['.mjs'] = 'text/javascript'

http.server.test(handler_class, port = 8080)