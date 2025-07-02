-- Add missing columns to editions table if they don't exist

-- Check if spine_type column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'editions' AND column_name = 'spine_type') THEN
        ALTER TABLE editions ADD COLUMN spine_type text;
    END IF;
END
$$;

-- Check if color_pages column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'editions' AND column_name = 'color_pages') THEN
        ALTER TABLE editions ADD COLUMN color_pages integer[] DEFAULT '{}'::integer[];
    END IF;
END
$$;

-- Check if enable_sample_reading column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'editions' AND column_name = 'enable_sample_reading') THEN
        ALTER TABLE editions ADD COLUMN enable_sample_reading boolean DEFAULT true;
    END IF;
END
$$;
