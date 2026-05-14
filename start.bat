@echo off
set "ESBUILD_BINARY_PATH=C:\Users\tavog\AppData\Local\Temp\esbuild.exe"
if not exist "%ESBUILD_BINARY_PATH%" (
  copy "node_modules\@esbuild\win32-x64\esbuild.exe" "%ESBUILD_BINARY_PATH%" >nul
)
set "VITE_BIN=node_modules\vite\bin\vite.js"
node "%VITE_BIN%" --host --port 5173
