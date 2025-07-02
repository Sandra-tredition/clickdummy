import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Clears all mock data from the database
 * This is a utility function to help with testing
 */
export async function clearAllMockData() {
  try {
    console.log("Starting to clear mock data...");

    // First, find all test projects (those with titles containing "Test" or "Mock")
    const { data: testProjects, error: projectsQueryError } = await supabase
      .from("projects")
      .select("id")
      .or("title.ilike.%Test%,title.ilike.%Mock%");

    if (projectsQueryError) {
      console.error("Error querying test projects:", projectsQueryError);
      return {
        success: false,
        message: "Error querying test projects",
        error: projectsQueryError.message,
      };
    }

    if (testProjects && testProjects.length > 0) {
      const projectIds = testProjects.map((p) => p.id);
      console.log(`Found ${projectIds.length} test projects to delete`);

      // Delete editions linked to these projects
      const { error: editionsError } = await supabase
        .from("editions")
        .delete()
        .in("project_id", projectIds);

      if (editionsError) {
        console.error("Error deleting editions:", editionsError);
        return {
          success: false,
          message: "Error deleting editions",
          error: editionsError.message,
        };
      }

      // Delete project_authors entries for these projects
      const { error: projectAuthorsError } = await supabase
        .from("project_authors")
        .delete()
        .in("project_id", projectIds);

      if (projectAuthorsError) {
        console.error("Error deleting project_authors:", projectAuthorsError);
        return {
          success: false,
          message: "Error deleting project authors",
          error: projectAuthorsError.message,
        };
      }

      // Delete the projects themselves
      const { error: projectsError } = await supabase
        .from("projects")
        .delete()
        .in("id", projectIds);

      if (projectsError) {
        console.error("Error deleting projects:", projectsError);
        return {
          success: false,
          message: "Error deleting projects",
          error: projectsError.message,
        };
      }
    }

    // Find test authors (those with names containing "Test" or "Mock")
    const { data: testAuthors, error: authorsQueryError } = await supabase
      .from("authors")
      .select("id")
      .or(
        "first_name.ilike.%Test%,last_name.ilike.%Test%,first_name.ilike.%Mock%,last_name.ilike.%Mock%,company_name.ilike.%Test%,company_name.ilike.%Mock%",
      );

    if (authorsQueryError) {
      console.error("Error querying test authors:", authorsQueryError);
      return {
        success: false,
        message: "Error querying test authors",
        error: authorsQueryError.message,
      };
    }

    if (testAuthors && testAuthors.length > 0) {
      const authorIds = testAuthors.map((a) => a.id);
      console.log(`Found ${authorIds.length} test authors to delete`);

      // Delete biographies for these authors
      const { error: biographiesError } = await supabase
        .from("author_biographies")
        .delete()
        .in("author_id", authorIds);

      if (biographiesError) {
        console.error("Error deleting biographies:", biographiesError);
        return {
          success: false,
          message: "Error deleting author biographies",
          error: biographiesError.message,
        };
      }

      // Delete project_authors entries for these authors
      const { error: authorProjectsError } = await supabase
        .from("project_authors")
        .delete()
        .in("author_id", authorIds);

      if (authorProjectsError) {
        console.error(
          "Error deleting author project links:",
          authorProjectsError,
        );
        return {
          success: false,
          message: "Error deleting author project links",
          error: authorProjectsError.message,
        };
      }

      // Delete the authors themselves
      const { error: authorsError } = await supabase
        .from("authors")
        .delete()
        .in("id", authorIds);

      if (authorsError) {
        console.error("Error deleting authors:", authorsError);
        return {
          success: false,
          message: "Error deleting authors",
          error: authorsError.message,
        };
      }
    }

    console.log("Mock data cleanup completed");
    return { success: true, message: "Mock data cleared successfully" };
  } catch (error) {
    console.error("Error clearing mock data:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error clearing mock data",
      error: "Error processing request",
    };
  }
}

/**
 * Creates a complete set of test data with proper linking
 */
export async function createTestDataWithLinking() {
  try {
    // Create a test project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          title: "Test Project with Proper Linking",
          description: "This project was created to test proper data linking",
          languages: ["Deutsch"],
          genres: ["fiction.literary"],
        },
      ])
      .select();

    if (projectError) {
      console.error("Error creating project:", projectError);
      return {
        success: false,
        message: "Failed to create test project",
        error: projectError.message,
      };
    }

    if (!project || project.length === 0) {
      return {
        success: false,
        message: "Failed to create test project - no data returned",
        error: "No project data returned",
      };
    }

    const projectId = project[0].id;

    // Create test authors
    const authors = [];
    const authorRoles = ["Autor", "Illustrator", "Übersetzer"];

    for (let i = 0; i < 3; i++) {
      // Create author
      const { data: author, error: authorError } = await supabase
        .from("authors")
        .insert([
          {
            first_name: `Test${i + 1}`,
            last_name: `Author${i + 1}`,
            author_type: "person",
          },
        ])
        .select();

      if (authorError) {
        console.error(`Error creating author ${i + 1}:`, authorError);
        return {
          success: false,
          message: `Failed to create test author ${i + 1}`,
          error: authorError.message,
        };
      }

      if (!author || author.length === 0) {
        return {
          success: false,
          message: `Failed to create test author ${i + 1} - no data returned`,
          error: "No author data returned",
        };
      }

      const authorId = author[0].id;

      // Create biography
      const { data: biography, error: bioError } = await supabase
        .from("author_biographies")
        .insert([
          {
            author_id: authorId,
            biography_text: `Test biography for author ${i + 1}`,
            biography_label: "Standard",
          },
        ])
        .select();

      if (bioError) {
        console.error(
          `Error creating biography for author ${i + 1}:`,
          bioError,
        );
        return {
          success: false,
          message: `Failed to create biography for author ${i + 1}`,
          error: bioError.message,
        };
      }

      if (!biography || biography.length === 0) {
        return {
          success: false,
          message: `Failed to create biography for author ${i + 1} - no data returned`,
          error: "No biography data returned",
        };
      }

      // Link author to project
      const { data: projectAuthor, error: linkError } = await supabase
        .from("project_authors")
        .insert([
          {
            project_id: projectId,
            author_id: authorId,
            author_role: authorRoles[i],
            biography_id: biography[0].id,
            display_order: i,
          },
        ])
        .select();

      if (linkError) {
        console.error(`Error linking author ${i + 1} to project:`, linkError);
        return {
          success: false,
          message: `Failed to link author ${i + 1} to project`,
          error: linkError.message,
        };
      }

      authors.push({
        author: author[0],
        biography: biography[0],
        projectAuthor: projectAuthor ? projectAuthor[0] : null,
      });
    }

    // Create editions for the project
    const editionTypes = ["Softcover", "Hardcover", "E-Book"];
    const editions = [];

    for (let i = 0; i < 3; i++) {
      const { data: edition, error: editionError } = await supabase
        .from("editions")
        .insert([
          {
            project_id: projectId,
            title: `Test Edition ${i + 1} (${editionTypes[i]})`,
            produktform: editionTypes[i],
            price: 14.99 + i * 5,
            status: "Draft",
          },
        ])
        .select();

      if (editionError) {
        console.error(`Error creating edition ${i + 1}:`, editionError);
        return {
          success: false,
          message: `Failed to create test edition ${i + 1}`,
          error: editionError.message,
        };
      }

      if (edition && edition.length > 0) {
        editions.push(edition[0]);
      }
    }

    return {
      success: true,
      project: project[0],
      authors,
      editions,
      message: "Test data created successfully with proper linking",
    };
  } catch (error) {
    console.error("Error creating test data:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error creating test data",
      error: "Error processing request",
    };
  }
}
