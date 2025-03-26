@echo off
echo Starting Spleeter batch script
echo Working directory: %CD%
echo Arguments: %1 %2 %3 %4
call conda activate spleeter
echo Conda environment activated
python %1 %2 %3 %4
set EXIT_CODE=%ERRORLEVEL%
echo Python script completed with exit code: %EXIT_CODE%
exit /b %EXIT_CODE%