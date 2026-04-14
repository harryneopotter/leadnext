#!/bin/bash
set -e

echo "Running Supabase migrations..."

# Check if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set, skipping migrations"
  exit 0
fi

# Run migrations using the Supabase CLI (if available)
if command -v supabase &> /dev/null; then
  supabase migration up --db-url "$SUPABASE_URL"
else
  echo "Supabase CLI not found, attempting to run migrations manually..."
  # Alternative: use psql if available
  if command -v psql &> /dev/null; then
    psql "$SUPABASE_URL" -f supabase/migrations/*.sql
  else
    echo "Error: Neither supabase CLI nor psql found. Cannot run migrations."
    exit 1
  fi
fi

echo "Migrations completed successfully"