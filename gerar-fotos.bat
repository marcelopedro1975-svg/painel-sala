@echo off
setlocal enabledelayedexpansion

echo [
> fotos.json

set first=1

for %%f in (fotos\*.jpg fotos\*.jpeg fotos\*.png) do (
    if !first!==1 (
        echo     "%%f" >> fotos.json
        set first=0
    ) else (
        echo     ,"%%f" >> fotos.json
    )
)

echo ] >> fotos.json

echo.
echo fotos.json gerado com sucesso.
pause