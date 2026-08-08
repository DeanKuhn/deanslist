@echo off
cd /d C:\Users\bibba\Code\deanslist
call node_modules\.bin\astro.cmd build > build.log 2>&1
call node_modules\.bin\astro.cmd preview --host 0.0.0.0 --port 4321 > preview.log 2>&1
