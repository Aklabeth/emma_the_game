@echo off
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
echo Pushing Emma the Doggo to GitHub (https://github.com/Aklabeth/emma_the_game.git)...
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ===================================
    echo Successfully pushed to GitHub!
    echo ===================================
) else (
    echo.
    echo Push failed. If prompted for password, use a GitHub Personal Access Token (PAT).
)
pause
