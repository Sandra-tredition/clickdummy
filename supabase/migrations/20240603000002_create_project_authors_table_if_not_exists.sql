-- Create project_authors table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  author_id UUID NOT NULL,
  author_role TEXT NOT NULL,
  biography_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
  FOREIGN KEY (biography_id) REFERENCES author_biographies(id) ON DELETE SET NULL
);

-- Enable realtime
alter publication supabase_realtime add table project_authors;
