-- Add status_history column to editions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'status_history') THEN
    ALTER TABLE editions ADD COLUMN status_history JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Ensure status column has the correct type and default value
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'editions' 
             AND column_name = 'status') THEN
    ALTER TABLE editions ALTER COLUMN status SET DEFAULT 'Draft';
  ELSE
    ALTER TABLE editions ADD COLUMN status TEXT DEFAULT 'Draft';
  END IF;

  -- Add content_upload_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'content_upload_date') THEN
    ALTER TABLE editions ADD COLUMN content_upload_date TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add cover_upload_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'cover_upload_date') THEN
    ALTER TABLE editions ADD COLUMN cover_upload_date TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add content_complete if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'content_complete') THEN
    ALTER TABLE editions ADD COLUMN content_complete BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add cover_complete if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'cover_complete') THEN
    ALTER TABLE editions ADD COLUMN cover_complete BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add pricing_complete if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'pricing_complete') THEN
    ALTER TABLE editions ADD COLUMN pricing_complete BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add is_complete if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'editions' 
                AND column_name = 'is_complete') THEN
    ALTER TABLE editions ADD COLUMN is_complete BOOLEAN DEFAULT FALSE;
  END IF;

  -- Initialize status_history for existing editions if empty
  UPDATE editions 
  SET status_history = json_build_array(json_build_object(
    'status', COALESCE(status, 'Draft'),
    'timestamp', COALESCE(created_at, NOW())
  ))::jsonb
  WHERE status_history IS NULL OR status_history = '[]'::jsonb;

END $$;