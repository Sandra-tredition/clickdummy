-- Create projects table if it doesn't exist yet
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

alter publication supabase_realtime add table projects;
