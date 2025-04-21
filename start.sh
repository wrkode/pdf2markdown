#!/bin/bash

# PDF2Markdown startup script
# This script starts the backend and frontend servers and opens the browser

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
  return $?
}

# Function to kill process on a port
kill_process_on_port() {
  echo -e "${YELLOW}Killing process on port $1...${NC}"
  lsof -ti:"$1" | xargs kill -9 >/dev/null 2>&1
  sleep 1
}

# Clean up function
cleanup() {
  echo -e "\n${YELLOW}Shutting down servers...${NC}"
  
  # Kill processes on ports
  if is_port_in_use 3000; then
    kill_process_on_port 3000
  fi
  
  if is_port_in_use 5173; then
    kill_process_on_port 5173
  fi
  
  echo -e "${GREEN}All servers stopped.${NC}"
  exit 0
}

# Set up trap for clean exit
trap cleanup SIGINT SIGTERM

# Navigate to project root directory
cd "$(dirname "$0")"

# Check if ports are already in use
if is_port_in_use 3000; then
  echo -e "${YELLOW}Port 3000 is already in use.${NC}"
  read -p "Do you want to kill the process and continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill_process_on_port 3000
  else
    echo -e "${RED}Cannot start backend server. Port 3000 is in use.${NC}"
    exit 1
  fi
fi

if is_port_in_use 5173; then
  echo -e "${YELLOW}Port 5173 is already in use.${NC}"
  read -p "Do you want to kill the process and continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill_process_on_port 5173
  else
    echo -e "${RED}Cannot start frontend server. Port 5173 is in use.${NC}"
    exit 1
  fi
fi

# Start the backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Give the backend some time to start up
sleep 2

# Check if backend started successfully
if ! is_port_in_use 3000; then
  echo -e "${RED}Failed to start backend server.${NC}"
  cleanup
  exit 1
fi

# Start the frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be available
echo -e "${YELLOW}Waiting for frontend server to be ready...${NC}"
MAX_ATTEMPTS=30
ATTEMPTS=0

while ! curl -s http://localhost:5173 > /dev/null; do
  ATTEMPTS=$((ATTEMPTS+1))
  if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
    echo -e "${RED}Frontend server did not start within the expected time.${NC}"
    cleanup
    exit 1
  fi
  sleep 1
done

echo -e "${GREEN}Both servers are running!${NC}"
echo -e "${GREEN}Backend server: http://localhost:3000${NC}"
echo -e "${GREEN}Frontend app: http://localhost:5173${NC}"

# Open the browser
echo -e "${GREEN}Opening browser...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open http://localhost:5173
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  xdg-open http://localhost:5173 &> /dev/null
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  # Windows
  start http://localhost:5173
else
  echo -e "${YELLOW}Could not automatically open browser. Please navigate to http://localhost:5173${NC}"
fi

echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Keep the script running to keep background processes alive
wait 