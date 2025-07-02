-- Add a default author if none exists
INSERT INTO authors (first_name, last_name, author_type)
SELECT 'Max', 'Mustermann', 'person'
WHERE NOT EXISTS (SELECT 1 FROM authors LIMIT 1);

-- Get the author ID (either the one we just created or an existing one)
DO $$
DECLARE
  author_id UUID;
  project_id UUID;
  biography_id UUID;
BEGIN
  -- Get the first author
  SELECT id INTO author_id FROM authors LIMIT 1;
  
  -- Get the project ID for "The Art of Fiction"
  SELECT id INTO project_id FROM projects WHERE title = 'The Art of Fiction' LIMIT 1;
  
  -- If we have both an author and a project
  IF author_id IS NOT NULL AND project_id IS NOT NULL THEN
    -- Create a biography if one doesn't exist
    INSERT INTO author_biographies (author_id, biography_text, biography_label)
    SELECT author_id, 'Keine Biografie vorhanden.', 'Standard'
    WHERE NOT EXISTS (
      SELECT 1 FROM author_biographies WHERE author_id = author_id LIMIT 1
    )
    RETURNING id INTO biography_id;
    
    -- If no biography was created, get the existing one
    IF biography_id IS NULL THEN
      SELECT id INTO biography_id FROM author_biographies WHERE author_id = author_id LIMIT 1;
    END IF;
    
    -- Add the author to the project if not already added
    INSERT INTO project_authors (project_id, author_id, author_role, biography_id)
    SELECT project_id, author_id, 'Autor', biography_id
    WHERE NOT EXISTS (
      SELECT 1 FROM project_authors 
      WHERE project_id = project_id AND author_id = author_id LIMIT 1
    );
  END IF;
END;
$$;
