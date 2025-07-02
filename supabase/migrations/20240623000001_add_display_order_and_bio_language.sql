-- Add display_order column to project_authors table
ALTER TABLE project_authors ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add language column to author_biographies table
ALTER TABLE author_biographies ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'de';