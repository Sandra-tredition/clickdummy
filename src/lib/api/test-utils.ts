// Mock test utilities - no longer connecting to Supabase

/**
 * Mock function to simulate clearing all mock data
 * This is a utility function to help with testing in mock mode
 */
export async function clearAllMockData() {
  try {
    console.log("Simulating mock data clearing...");

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Mock data cleanup simulation completed");
    return {
      success: true,
      message:
        "Mock data clearing simulated successfully. No real data was affected.",
      itemsDeleted: {
        projects: 0,
        authors: 0,
        editions: 0,
        biographies: 0,
      },
    };
  } catch (error) {
    console.error("Error in mock data clearing simulation:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error in mock simulation",
      error: "Error processing mock request",
    };
  }
}

/**
 * Mock function to simulate creating a complete set of test data
 */
export async function createTestDataWithLinking() {
  try {
    console.log("Simulating test data creation...");

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock data structure
    const mockResult = {
      success: true,
      project: {
        id: "mock-project-1",
        title: "Mock Test Project with Proper Linking",
        description: "This project was created to simulate proper data linking",
        languages: ["Deutsch"],
        genres: ["fiction.literary"],
      },
      authors: [
        {
          author: {
            id: "mock-author-1",
            first_name: "Mock1",
            last_name: "Author1",
            author_type: "person",
          },
          biography: {
            id: "mock-bio-1",
            biography_text: "Mock biography for author 1",
            biography_label: "Standard",
          },
          projectAuthor: {
            id: "mock-pa-1",
            author_role: "Autor",
            display_order: 0,
          },
        },
        {
          author: {
            id: "mock-author-2",
            first_name: "Mock2",
            last_name: "Author2",
            author_type: "person",
          },
          biography: {
            id: "mock-bio-2",
            biography_text: "Mock biography for author 2",
            biography_label: "Standard",
          },
          projectAuthor: {
            id: "mock-pa-2",
            author_role: "Illustrator",
            display_order: 1,
          },
        },
        {
          author: {
            id: "mock-author-3",
            first_name: "Mock3",
            last_name: "Author3",
            author_type: "person",
          },
          biography: {
            id: "mock-bio-3",
            biography_text: "Mock biography for author 3",
            biography_label: "Standard",
          },
          projectAuthor: {
            id: "mock-pa-3",
            author_role: "Übersetzer",
            display_order: 2,
          },
        },
      ],
      editions: [
        {
          id: "mock-edition-1",
          title: "Mock Edition 1 (Softcover)",
          produktform: "Softcover",
          price: 14.99,
          status: "Draft",
        },
        {
          id: "mock-edition-2",
          title: "Mock Edition 2 (Hardcover)",
          produktform: "Hardcover",
          price: 19.99,
          status: "Draft",
        },
        {
          id: "mock-edition-3",
          title: "Mock Edition 3 (E-Book)",
          produktform: "E-Book",
          price: 24.99,
          status: "Draft",
        },
      ],
      message: "Test data creation simulated successfully with proper linking",
    };

    console.log("Mock test data creation completed");
    return mockResult;
  } catch (error) {
    console.error("Error in mock test data creation:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error in mock test data creation",
      error: "Error processing mock request",
    };
  }
}
