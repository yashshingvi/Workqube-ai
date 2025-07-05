#!/bin/bash

# Automation Platform Setup Script
# This script sets up the entire platform for development

set -e

echo "🚀 Setting up Automation Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Create environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Created .env file from template"
        print_warning "Please review and update .env file with your configuration"
    else
        print_warning ".env file already exists. Skipping creation."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    print_success "All dependencies installed"
}

# Start development environment
start_development() {
    print_status "Starting development environment..."
    
    # Start infrastructure services
    print_status "Starting infrastructure services (PostgreSQL, Redis, etc.)..."
    docker-compose up -d postgres redis mongodb rabbitmq elasticsearch kibana minio
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Start backend services
    print_status "Starting backend services..."
    cd backend && npm run dev &
    cd ..
    
    # Start frontend
    print_status "Starting frontend..."
    cd frontend && npm start &
    cd ..
    
    print_success "Development environment started!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   API Gateway: http://localhost:8000"
    echo "   Kong Admin: http://localhost:8001"
    echo "   Kibana: http://localhost:5601"
    echo "   MinIO Console: http://localhost:9001"
    echo "   RabbitMQ Management: http://localhost:15672"
    echo ""
    echo "📊 Monitoring:"
    echo "   Prometheus: http://localhost:9090"
    echo "   Grafana: http://localhost:3007"
    echo ""
    echo "🔧 Development Tools:"
    echo "   Database: localhost:5432 (postgres/password)"
    echo "   Redis: localhost:6379"
    echo "   MongoDB: localhost:27017"
    echo ""
    print_warning "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Stop all services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop frontend and backend processes
    pkill -f "npm start" || true
    pkill -f "npm run dev" || true
    
    # Stop Docker containers
    docker-compose down
    
    print_success "All services stopped"
}

# Main setup function
main() {
    echo "=========================================="
    echo "  Automation Platform Setup Script"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_docker
    check_node
    check_npm
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Ask user what to do next
    echo ""
    echo "Setup completed! What would you like to do next?"
    echo "1. Start development environment"
    echo "2. Stop all services"
    echo "3. Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            start_development
            ;;
        2)
            stop_services
            ;;
        3)
            print_success "Setup completed. You can start development later with:"
            echo "   npm run dev"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Handle script arguments
case "${1:-}" in
    "start")
        start_development
        ;;
    "stop")
        stop_services
        ;;
    "install")
        check_docker
        check_node
        check_npm
        setup_environment
        install_dependencies
        print_success "Installation completed!"
        ;;
    *)
        main
        ;;
esac 