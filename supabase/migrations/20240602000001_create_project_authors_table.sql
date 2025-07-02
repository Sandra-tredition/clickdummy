-- Create projects table first
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  cover_image TEXT,
  languages TEXT[],
  series VARCHAR(255),
  publisher VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'projects'
  ) THEN
    alter publication supabase_realtime add table projects;
  END IF;
END$;

-- Then create project_authors table that references projects
CREATE TABLE IF NOT EXISTS project_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  author_id UUID NOT NULL,
  author_role VARCHAR(100) NOT NULL,
  biography_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
  FOREIGN KEY (biography_id) REFERENCES author_biographies(id) ON DELETE SET NULL,
  UNIQUE (project_id, author_id)
);

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'project_authors'
  ) THEN
    alter publication supabase_realtime add table project_authors;
  END IF;
END$;
