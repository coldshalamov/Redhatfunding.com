"""
A tiny static file server with SPA-style fallbacks.
- Serves files from the repo root on http://localhost:PORT (default 8080).
- If a path doesn't match a real file and doesn't include a file extension,
  it falls back to index.html so /apply, /privacy, etc. work when opened directly.
"""

from __future__ import annotations

import http.server
import os
import pathlib
import socketserver
from urllib.parse import urlsplit

ROOT = pathlib.Path(__file__).parent.resolve()
PORT = int(os.environ.get("PORT", "8080"))


class SPASimpleHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        # Always serve from the repo root regardless of the working directory.
        path = urlsplit(path).path
        resolved = ROOT.joinpath(path.lstrip("/")).resolve()
        try:
            resolved.relative_to(ROOT)
        except ValueError:
            # Prevent escaping the root.
            resolved = ROOT
        return str(resolved)

    def send_head(self):
        path = self.translate_path(self.path)
        # Directory handling (adds trailing slash and serves index.html if present).
        if os.path.isdir(path):
            if not self.path.endswith("/"):
                self.send_response(301)
                self.send_header("Location", self.path + "/")
                self.end_headers()
                return None
            for index in ("index.html", "index.htm"):
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break

        if os.path.exists(path):
            self.path = "/" + str(pathlib.Path(path).relative_to(ROOT)).replace("\\", "/")
            return http.server.SimpleHTTPRequestHandler.send_head(self)

        # SPA fallback: no matching file and no extension -> serve index.html.
        request_path = urlsplit(self.path).path
        if "." not in os.path.basename(request_path):
            self.path = "/index.html"
            return http.server.SimpleHTTPRequestHandler.send_head(self)

        return http.server.SimpleHTTPRequestHandler.send_head(self)


if __name__ == "__main__":
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), SPASimpleHandler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT} (SPA fallback enabled)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")
