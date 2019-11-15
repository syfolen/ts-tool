@echo off

echo input project dir:

set /p dir=

echo start build %dir% ...

cd bin

node main.js %dir%

pause