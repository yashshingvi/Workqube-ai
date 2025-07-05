@echo off
echo ==========================================
echo   Automation Platform Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if Docker is installed
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not installed or not running. Some features may not work.
)

REM Create environment file if it doesn't exist
echo [INFO] Setting up environment configuration...
if not exist .env (
    copy env.example .env
    echo [SUCCESS] Created .env file from template
    echo [WARNING] Please review and update .env file with your configuration
) else (
    echo [WARNING] .env file already exists. Skipping creation.
)

REM Install root dependencies
echo [INFO] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies.
    pause
    exit /b 1
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b 1
)
cd ..

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)
cd ..

echo.
echo [SUCCESS] Setup completed!
echo.
echo What would you like to do next?
echo 1. Start development environment
echo 2. Exit
echo.
set /p choice="Enter your choice (1-2): "

if "%choice%"=="1" (
    echo.
    echo [INFO] Starting development environment...
    echo [INFO] Starting infrastructure services...
    docker-compose up -d postgres redis mongodb rabbitmq elasticsearch kibana minio
    
    echo [INFO] Waiting for services to be ready...
    timeout /t 30 /nobreak >nul
    
    echo [INFO] Starting backend services...
    start "Backend Services" cmd /k "cd backend && npm run dev"
    
    echo [INFO] Starting frontend...
    start "Frontend" cmd /k "cd frontend && npm start"
    
    echo.
    echo [SUCCESS] Development environment started!
    echo.
    echo Access the application:
    echo   Frontend: http://localhost:3000
    echo   API Gateway: http://localhost:8000
    echo   Kong Admin: http://localhost:8001
    echo   Kibana: http://localhost:5601
    echo   MinIO Console: http://localhost:9001
    echo   RabbitMQ Management: http://localhost:15672
    echo.
    echo Press any key to continue...
    pause >nul
) else if "%choice%"=="2" (
    echo [SUCCESS] Setup completed. You can start development later with:
    echo   npm run dev
) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
pause 