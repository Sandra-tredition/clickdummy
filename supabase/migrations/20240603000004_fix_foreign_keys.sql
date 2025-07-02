-- Remove foreign key constraints if they exist
ALTER TABLE IF EXISTS project_authors DROP CONSTRAINT IF EXISTS project_authors_project_id_fkey;
ALTER TABLE IF EXISTS project_authors DROP CONSTRAINT IF EXISTS project_authors_author_id_fkey;
ALTER TABLE IF EXISTS project_authors DROP CONSTRAINT IF EXISTS project_authors_biography_id_fkey;

-- Add foreign key constraints with proper options
ALTER TABLE IF EXISTS project_authors
  ADD CONSTRAINT project_authors_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS project_authors
  ADD CONSTRAINT project_authors_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS project_authors
  ADD CONSTRAINT project_authors_biography_id_fkey 
  FOREIGN KEY (biography_id) REFERENCES author_biographies(id) ON DELETE SET NULL;
