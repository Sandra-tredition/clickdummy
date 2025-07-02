-- Add language column to author_biographies table
ALTER TABLE author_biographies ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Deutsch';

-- Add display_order column to project_authors table
ALTER TABLE project_authors ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Enable realtime for these tables if not already enabled
alter publication supabase_realtime add table author_biographies;
alter publication supabase_realtime add table project_authors;