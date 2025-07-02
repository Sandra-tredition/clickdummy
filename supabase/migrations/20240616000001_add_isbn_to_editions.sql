-- Add ISBN column to editions table if it doesn't exist already
DO $$ 
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'editions' 
              AND column_name = 'isbn') THEN
    ALTER TABLE editions ADD COLUMN isbn VARCHAR(17);
  END IF;
END $$;

-- Add realtime support for the editions table
alter publication supabase_realtime add table editions;
