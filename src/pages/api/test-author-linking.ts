// This API endpoint is now disabled since we're using mock data instead of Supabase

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Return mock success response
  return res.status(200).json({
    success: true,
    message:
      "This endpoint is now in mock mode. No real data operations are performed.",
    mockData: {
      project: {
        id: "mock-project-1",
        title: "Mock Test Project",
        description: "This is a mock project for testing",
      },
      author: {
        id: "mock-author-1",
        first_name: "Mock",
        last_name: "Author",
        author_type: "person",
      },
      biography: {
        id: "mock-bio-1",
        biography_text: "Mock biography text",
        biography_label: "Standard",
      },
    },
  });
}
