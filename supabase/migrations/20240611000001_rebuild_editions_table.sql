-- Drop the existing editions table if it exists
DROP TABLE IF EXISTS editions CASCADE;

-- Create editions table with structure matching EditionTabsStoryboard
CREATE TABLE editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  produktform TEXT,
  ausgabenart TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  pages INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  isbn TEXT,
  is_complete BOOLEAN DEFAULT false,
  format_complete BOOLEAN DEFAULT false,
  content_complete BOOLEAN DEFAULT false,
  cover_complete BOOLEAN DEFAULT false,
  pricing_complete BOOLEAN DEFAULT false,
  authors_complete BOOLEAN DEFAULT false,
  content_file TEXT,
  content_upload_date TIMESTAMP WITH TIME ZONE,
  cover_file TEXT,
  cover_upload_date TIMESTAMP WITH TIME ZONE,
  paper_type TEXT DEFAULT 'textdruck-weiss',
  cover_finish TEXT DEFAULT 'matt',
  spine_type TEXT DEFAULT 'gerade',
  color_pages JSONB DEFAULT '[]'::jsonb,
  enable_sample_reading BOOLEAN DEFAULT true,
  custom_width TEXT,
  custom_height TEXT,
  author_commission INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add realtime support
alter publication supabase_realtime add table editions;
