#!/bin/bash

# Script to generate secure values for production deployment

echo "🔐 DevFlx Deployment Secrets Generator"
echo "======================================"
echo ""
echo "This script generates secure values needed for production deployment."
echo ""

# Generate JWT Secret
echo "Generating JWT_SECRET..."
JWT_SECRET=$(openssl rand -base64 32)
echo "✓ JWT_SECRET: $JWT_SECRET"
echo ""

# Generate cookie string
echo "Other important settings:"
echo "- COOKIE_SECURE: true (for production with HTTPS)"
echo "- COOKIE_SAME_SITE: strict (recommended for security)"
echo "- SALT_ROUNDS: 10 (for bcrypt)"
echo "- JWT_EXPIRES_IN: 7d (or adjust as needed)"
echo ""

echo "📋 Environment Variables for Railway (Backend):"
echo "================================================"
echo "DATABASE_URL=postgresql://[from Railway PostgreSQL]"
echo "PORT=4000"
echo "NODE_ENV=production"
echo "FRONTEND_ORIGIN=https://[your-vercel-frontend-url].vercel.app"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_EXPIRES_IN=7d"
echo "SALT_ROUNDS=10"
echo "COOKIE_SECURE=true"
echo "COOKIE_SAME_SITE=strict"
echo ""

echo "📋 Environment Variables for Vercel (Frontend):"
echo "================================================"
echo "NEXT_PUBLIC_API_URL=https://[your-railway-backend-url].railway.app"
echo ""

echo "✅ Copy the JWT_SECRET above and set it in your Railway dashboard"
echo "✅ See DEPLOYMENT.md for detailed setup instructions"
