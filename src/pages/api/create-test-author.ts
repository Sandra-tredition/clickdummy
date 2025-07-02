// This file is not used in Vite and can be removed or modified to use Vite's API approach
import { supabase } from "@/lib/supabase";

type RequestData = {
  firstName: string;
  lastName: string;
  authorType: string;
};

type ResponseData = {
  author?: any;
  biography?: any;
  message?: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { firstName, lastName, authorType } = req.body as RequestData;

    // Create author
    const { data: author, error: authorError } = await supabase
      .from("authors")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          author_type: authorType || "person",
        },
      ])
      .select();

    if (authorError) throw authorError;

    if (!author || author.length === 0) {
      return res.status(500).json({ message: "Failed to create author" });
    }

    // Create default biography
    const { data: biography, error: bioError } = await supabase
      .from("author_biographies")
      .insert([
        {
          author_id: author[0].id,
          biography_text: `Biografie von ${firstName} ${lastName}`,
          biography_label: "Standard",
        },
      ])
      .select();

    if (bioError) throw bioError;

    return res
      .status(200)
      .json({ author: author[0], biography: biography ? biography[0] : null });
  } catch (error: any) {
    console.error("Error creating test author:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}
