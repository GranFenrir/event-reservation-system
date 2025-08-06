#!/bin/bash

# 🧹 Event Reservation System - Project Cleanup Script
# This script removes unnecessary files and directories to clean up the project

set -e

echo "🧹 Starting Project Cleanup..."
echo "=================================================="

# Function to safely remove files/directories
safe_remove() {
    if [ -e "$1" ]; then
        echo "🗑️  Removing: $1"
        rm -rf "$1"
    else
        echo "⏭️  Already removed: $1"
    fi
}

# Function to show removal summary
show_summary() {
    echo ""
    echo "📊 Cleanup Summary:"
    echo "===================="
    echo "✅ Backup directories removed"
    echo "✅ Old/corrupted configuration files removed"
    echo "✅ Temporary and cache files removed"
    echo "✅ Redundant documentation files removed"
    echo "✅ Build artifacts cleaned up"
    echo "✅ Old component versions removed"
    echo ""
}

echo ""
echo "🔍 Phase 1: Removing backup and old service directories..."
echo "--------------------------------------------------------"

# Remove backup service directory
safe_remove "services/user-service-express-backup"
safe_remove "services"

echo ""
echo "🔍 Phase 2: Removing old and corrupted configuration files..."
echo "-----------------------------------------------------------"

# Remove corrupted and old docker compose files
safe_remove "docker-compose-corrupted.yml"
safe_remove "docker-compose-clean.yml"

echo ""
echo "🔍 Phase 3: Removing excessive documentation files..."
echo "---------------------------------------------------"

# Remove excessive status and completion files
safe_remove "ARCHITECTURAL_FIXES.md"
safe_remove "ARCHITECTURAL_TRANSFORMATION_COMPLETE.md"
safe_remove "DATABASE_AUDIT_FINAL.md"
safe_remove "INTEGRATION_COMPLETE.md"
safe_remove "PHASE_1_COMPLETION.md"
safe_remove "PHASE_2_COMPLETION.md"
safe_remove "PHASE_3_COMPLETION.md"
safe_remove "STATUS_REPORT.md"
safe_remove "MICROSERVICES_SETUP.md"

echo ""
echo "🔍 Phase 4: Removing old component versions..."
echo "---------------------------------------------"

# Remove old admin panel components
safe_remove "admin-panel/src/components-old"
safe_remove "admin-panel/src/App.old.tsx"

echo ""
echo "🔍 Phase 5: Cleaning build artifacts and cache files..."
echo "-----------------------------------------------------"

# Remove TypeScript build info files
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
echo "🗑️  Removed: *.tsbuildinfo files"

# Remove any SQLite database files (they'll be recreated)
find . -name "*.sqlite" -type f -delete 2>/dev/null || true
echo "🗑️  Removed: *.sqlite files"

# Remove any .DS_Store files (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
echo "🗑️  Removed: .DS_Store files"

echo ""
echo "🔍 Phase 6: Cleaning demo and mock files..."
echo "------------------------------------------"

# Remove mock API (if it's not needed)
if [ -d "mock-api" ]; then
    echo "⚠️  mock-api directory found. Keeping it as it might be needed for development."
    echo "   If you don't need it, you can manually remove: rm -rf mock-api"
fi

# Remove demo setup script (keeping it as it might be useful)
echo "⚠️  Keeping scripts/setup-demo.js as it might be useful for development"

echo ""
echo "🔍 Phase 7: Cleaning Windows-specific files..."
echo "---------------------------------------------"

# Remove Windows batch files if on Unix system
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    safe_remove "scripts/start-all.bat"
    safe_remove "scripts/start-all.ps1"
fi

echo ""
echo "🔍 Phase 8: Cleaning reporting service build issues..."
echo "----------------------------------------------------"

# Clean up reporting service build artifacts that might be causing issues
safe_remove "microservices/reporting-service/dist"
safe_remove "microservices/reporting-service/tsconfig.tsbuildinfo"
safe_remove "microservices/reporting-service/tsconfig.build.tsbuildinfo"

echo ""
echo "🔍 Phase 9: Cleaning environment files (keeping templates)..."
echo "----------------------------------------------------------"

# Keep .env.example but note about cleaning sensitive data
echo "⚠️  .env files kept for development. Ensure no sensitive data before git commit!"
echo "   - .env"
echo "   - .env.development"
echo "   - microservices/*/.env"

show_summary

echo "🎉 Project cleanup completed successfully!"
echo ""
echo "📝 Next Steps:"
echo "=============="
echo "1. Run: git status (to see what was removed)"
echo "2. Run: npm run clean (to clean node_modules if needed)"
echo "3. Run: git add . && git commit -m 'Clean up unnecessary files'"
echo "4. Test your services to ensure everything still works"
echo ""
echo "💡 Recommended: Update your .gitignore to prevent future pollution"
echo ""
