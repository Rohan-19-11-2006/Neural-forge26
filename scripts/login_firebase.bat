@echo off
title Firebase Login
cls
echo ========================================================
echo         FIREBASE LOGIN FOR NEURAL FORGE 26
echo ========================================================
echo.
echo Launching Google Sign-in in your browser...
echo.
call npx firebase login
echo.
echo ========================================================
echo Login completed! You can close this window now.
echo ========================================================
pause
