#!/bin/bash

# DevFlx Frontend-Backend Integration Test Script
# Tests critical endpoints and verifies connectivity

API_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}DevFlx Integration Test Suite${NC}"
echo -e "${BLUE}================================${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health/db")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Database health check passed${NC}"
  echo "  Response: $BODY"
else
  echo -e "${RED}✗ Database health check failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 2: Root endpoint
echo -e "${YELLOW}Test 2: API Root Endpoint${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ API root endpoint accessible${NC}"
  echo "  Response: $BODY"
else
  echo -e "${RED}✗ API root endpoint failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 3: Frontend accessibility
echo -e "${YELLOW}Test 3: Frontend Accessibility${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Frontend accessible on port 3000${NC}"
else
  echo -e "${RED}✗ Frontend not accessible (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 4: Login endpoint
echo -e "${YELLOW}Test 4: Login Endpoint (Invalid Credentials)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✓ Login endpoint responding correctly${NC}"
  echo "  Response: $BODY"
else
  echo -e "${YELLOW}⚠ Login endpoint returned HTTP $HTTP_CODE${NC}"
fi
echo ""

# Test 5: Users endpoint (no auth - should fail)
echo -e "${YELLOW}Test 5: Users Endpoint (No Auth - Expected to Fail)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/superadmin/users")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Authentication required (as expected)${NC}"
else
  echo -e "${YELLOW}⚠ Users endpoint returned HTTP $HTTP_CODE${NC}"
fi
echo ""

# Test 6: CORS headers
echo -e "${YELLOW}Test 6: CORS Headers${NC}"
RESPONSE=$(curl -s -i "$API_URL/" 2>&1 | grep -i "access-control")

if [ ! -z "$RESPONSE" ]; then
  echo -e "${GREEN}✓ CORS headers present${NC}"
  echo "  $RESPONSE"
else
  echo -e "${YELLOW}⚠ CORS headers check (may be filtered)${NC}"
fi
echo ""

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Integration Test Complete${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${YELLOW}Quick Links:${NC}"
echo -e "  Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "  Backend API: ${BLUE}http://localhost:4000${NC}"
echo -e "  API Health: ${BLUE}http://localhost:4000/health/db${NC}\n"

echo -e "${YELLOW}Test Credentials (from seeding):${NC}"
echo -e "  Email: ${BLUE}saqib.mustafa@gmail.com${NC}"
echo -e "  Password: ${BLUE}Saqib@123${NC}\n"
