# Affiliate Flywheel - Development Makefile
# Mirrors CI pipeline stages for local development

.PHONY: help install lint type-check test test-watch test-coverage build dev clean ci check

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "  Setup:"
	@echo "    make install      - Install dependencies"
	@echo ""
	@echo "  Development:"
	@echo "    make dev          - Start development server"
	@echo "    make test-watch   - Run tests in watch mode"
	@echo ""
	@echo "  CI Pipeline (run before pushing):"
	@echo "    make ci           - Run full CI pipeline locally"
	@echo "    make check        - Quick check (lint + type-check + test)"
	@echo ""
	@echo "  Individual stages:"
	@echo "    make lint         - Run ESLint"
	@echo "    make type-check   - Run TypeScript type checking"
	@echo "    make test         - Run tests once"
	@echo "    make test-coverage- Run tests with coverage"
	@echo "    make build        - Build for production"
	@echo ""
	@echo "  Maintenance:"
	@echo "    make clean        - Remove build artifacts"

# Setup
install:
	npm ci

# Development
dev:
	npm run dev

# CI Pipeline stages (matches .github/workflows/ci.yml)
lint:
	@echo "==> Running ESLint..."
	npm run lint

type-check:
	@echo "==> Running TypeScript type check..."
	npm run type-check

test:
	@echo "==> Running tests..."
	npm run test:run

test-watch:
	npm run test

test-coverage:
	@echo "==> Running tests with coverage..."
	npm run test:coverage

build:
	@echo "==> Building application..."
	npm run build

# Composite commands
check: lint type-check test
	@echo ""
	@echo "✓ All checks passed!"

ci: lint type-check test build
	@echo ""
	@echo "✓ Full CI pipeline passed locally!"

# Maintenance
clean:
	rm -rf .next
	rm -rf out
	rm -rf coverage
	rm -rf node_modules/.cache
	@echo "✓ Cleaned build artifacts"
