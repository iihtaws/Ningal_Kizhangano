@echo off
echo ========================================================
echo   🥔 Starting Potato-O-Meter Full-Stack Application...
echo ========================================================
echo.

echo Launching Python ML Service on http://localhost:8000 ...
start "Potato ML Service (Python FastAPI)" cmd /k "cd ml-service && (py main.py || python main.py)"

echo Launching Express Backend API Gateway on http://localhost:5000 ...
start "Potato Backend (Express & MongoDB)" cmd /k "cd backend && npm run dev"

echo Launching React Frontend UI on http://localhost:3000 ...
start "Potato Frontend (React & Tailwind)" cmd /k "cd frontend && npm run dev"

echo.
echo All 3 services have been launched in separate terminal windows!
echo Open http://localhost:3000 in your browser when ready.
echo ========================================================
