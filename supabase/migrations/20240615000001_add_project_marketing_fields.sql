-- Add new marketing fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS target_audience_groups TEXT[],
ADD COLUMN IF NOT EXISTS slogan TEXT,
ADD COLUMN IF NOT EXISTS selling_points TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Enable realtime for the projects table
alter publication supabase_realtime add table projects;
