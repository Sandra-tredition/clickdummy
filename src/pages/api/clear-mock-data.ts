// This API endpoint is now disabled since we're using mock data instead of Supabase

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock success response
  return res.status(200).json({
    success: true,
    message:
      "Mock data clearing simulated successfully. No real data was deleted since we're in mock mode.",
    mockData: {
      projectsDeleted: 0,
      authorsDeleted: 0,
      editionsDeleted: 0,
      biographiesDeleted: 0,
    },
  });
}
