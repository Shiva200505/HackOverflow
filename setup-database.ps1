# Database Setup Script
# Run this after updating your password in .env.local

Write-Host "🚀 Starting Database Setup..." -ForegroundColor Green
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prisma client generated successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Push schema to database
Write-Host "🗄️  Step 2: Pushing schema to Supabase..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema to database" -ForegroundColor Red
    Write-Host "⚠️  Make sure you updated the password in .env.local" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Database schema created successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Verify connection
Write-Host "🔍 Step 3: Verifying database connection..." -ForegroundColor Cyan
npx prisma db pull --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: Could not verify connection, but schema might be created" -ForegroundColor Yellow
} else {
    Write-Host "✅ Database connection verified!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Register your first account!" -ForegroundColor White
Write-Host ""
