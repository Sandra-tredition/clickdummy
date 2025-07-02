-- Create editions table
CREATE TABLE IF NOT EXISTS editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  produktform TEXT NOT NULL,
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
  dimensions TEXT,
  weight TEXT,
  paper_type TEXT,
  cover_finish TEXT,
  spine_text TEXT,
  enable_sample_reading BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table editions;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_editions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_editions_updated_at
BEFORE UPDATE ON editions
FOR EACH ROW
EXECUTE FUNCTION update_editions_updated_at();
