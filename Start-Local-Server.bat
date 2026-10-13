@echo off
title GST NOC Studio Local Server
echo ========================================================
echo  Starting GST NOC Studio on http://localhost:8080 ...
echo  Press Ctrl+C to stop the server anytime.
echo ========================================================
start "" "http://localhost:8080"
python -m http.server 8080
pause
