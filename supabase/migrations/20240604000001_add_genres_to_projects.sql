-- Add genres column to projects table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'genres') THEN
    ALTER TABLE projects ADD COLUMN genres TEXT[] DEFAULT '{}' NOT NULL;
  END IF;
END $$;

-- Update the supabase_realtime publication to include the projects table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'projects') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE projects;
  END IF;
END $$;