@echo off
cd /d C:\Users\bibba\Code\deanslist
call node_modules\.bin\astro.cmd dev --host 0.0.0.0 --port 4321 > dev-server.log 2>&1
