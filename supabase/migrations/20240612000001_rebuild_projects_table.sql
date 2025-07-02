-- Drop existing foreign key constraints first to avoid conflicts
ALTER TABLE IF EXISTS "project_authors" DROP CONSTRAINT IF EXISTS "project_authors_project_id_fkey";
ALTER TABLE IF EXISTS "editions" DROP CONSTRAINT IF EXISTS "editions_project_id_fkey";

-- Clear data from related tables to avoid foreign key violations
DELETE FROM "project_authors";
DELETE FROM "editions";

-- Drop the existing projects table if it exists
DROP TABLE IF EXISTS "projects";

-- Create the projects table with the required structure
CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(255) NOT NULL,
  "subtitle" VARCHAR(255),
  "description" TEXT,
  "cover_image" TEXT,
  "languages" TEXT[] DEFAULT '{}',
  "series" VARCHAR(255),
  "publisher" VARCHAR(255),
  "genres" TEXT[] DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Recreate the foreign key constraints
ALTER TABLE IF EXISTS "project_authors" ADD CONSTRAINT "project_authors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
ALTER TABLE IF EXISTS "editions" ADD CONSTRAINT "editions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;

-- Enable realtime for the projects table
alter publication supabase_realtime add table projects;
