// This API endpoint is now disabled since we're using mock data instead of Supabase

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock success response
  return res.status(200).json({
    success: true,
    message:
      "Test data creation simulated successfully. No real data was created since we're in mock mode.",
    mockData: {
      projectsCreated: 3,
      authorsCreated: 5,
      editionsCreated: 8,
      biographiesCreated: 7,
    },
  });
}
