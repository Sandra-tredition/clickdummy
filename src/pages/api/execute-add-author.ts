import { addAuthorToProject } from "./add-author-to-project";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await addAuthorToProject();
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    console.error("Error executing add author:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal server error",
      });
  }
}
