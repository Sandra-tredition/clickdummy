-- Add biography_label column to author_biographies table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'author_biographies' 
    AND column_name = 'biography_label'
  ) THEN
    ALTER TABLE author_biographies ADD COLUMN biography_label TEXT DEFAULT 'Standard';
  END IF;
END$$;

-- Fix the supabase_realtime publication issue
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'authors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE authors;
  END IF;
END$$;
