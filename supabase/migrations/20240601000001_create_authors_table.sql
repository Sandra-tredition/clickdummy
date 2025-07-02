-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_type TEXT NOT NULL CHECK (author_type IN ('person', 'organization')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  is_pseudonym BOOLEAN DEFAULT FALSE,
  birth_date DATE,
  death_date DATE,
  isni TEXT,
  profession TEXT,
  company TEXT,
  website TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT author_name_check CHECK (
    (author_type = 'person' AND last_name IS NOT NULL AND company_name IS NULL) OR
    (author_type = 'organization' AND company_name IS NOT NULL AND first_name IS NULL AND last_name IS NULL)
  )
);

-- Create author biographies table (one-to-many relationship)
CREATE TABLE IF NOT EXISTS author_biographies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  biography_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create author types table (for categorization)
CREATE TABLE IF NOT EXISTS author_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Insert default author types
INSERT INTO author_types (name, description) VALUES
('Autor', 'Verfasser des Werks'),
('Übersetzer', 'Übersetzer des Werks'),
('Herausgeber', 'Herausgeber des Werks'),
('Illustrator', 'Illustrator des Werks')
ON CONFLICT (name) DO NOTHING;

-- Create author_type_mappings table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS author_type_mappings (
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  type_id UUID REFERENCES author_types(id) ON DELETE CASCADE,
  PRIMARY KEY (author_id, type_id)
);

-- Enable realtime for authors table
alter publication supabase_realtime add table authors;
alter publication supabase_realtime add table author_biographies;
alter publication supabase_realtime add table author_types;
alter publication supabase_realtime add table author_type_mappings;
