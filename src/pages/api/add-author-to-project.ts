import { supabase } from "@/lib/supabase";

export async function addAuthorToProject() {
  const authorId = "17db89d8-6983-42a5-a5e5-cd09a14b9f81";
  const projectId = "1"; // ID für "The Art of Fiction"
  const authorRole = "Autor";

  try {
    // Prüfen, ob der Autor bereits eine Biografie hat
    const { data: biographies, error: bioFetchError } = await supabase
      .from("author_biographies")
      .select("*")
      .eq("author_id", authorId);

    if (bioFetchError) throw bioFetchError;

    let biographyId;

    // Wenn keine Biografie existiert, erstelle eine
    if (!biographies || biographies.length === 0) {
      const { data: newBio, error: bioError } = await supabase
        .from("author_biographies")
        .insert([
          {
            author_id: authorId,
            biography_text: "Keine Biografie vorhanden.",
            biography_label: "Standard",
          },
        ])
        .select();

      if (bioError) throw bioError;

      if (newBio && newBio.length > 0) {
        biographyId = newBio[0].id;
      }
    } else {
      biographyId = biographies[0].id;
    }

    // Prüfen, ob der Autor bereits dem Projekt zugeordnet ist
    const { data: existingAssignment, error: checkError } = await supabase
      .from("project_authors")
      .select("*")
      .eq("project_id", projectId)
      .eq("author_id", authorId);

    if (checkError) throw checkError;

    // Wenn der Autor bereits zugeordnet ist, nichts tun
    if (existingAssignment && existingAssignment.length > 0) {
      console.log("Autor ist bereits dem Projekt zugeordnet.");
      return {
        success: true,
        message: "Autor ist bereits dem Projekt zugeordnet.",
      };
    }

    // Autor zum Projekt hinzufügen
    const insertData = {
      project_id: projectId,
      author_id: authorId,
      author_role: authorRole,
      biography_id: biographyId,
    };

    const { error } = await supabase
      .from("project_authors")
      .insert([insertData]);

    if (error) throw error;

    return {
      success: true,
      message: "Autor erfolgreich zum Projekt hinzugefügt.",
    };
  } catch (error: any) {
    console.error("Fehler beim Hinzufügen des Autors zum Projekt:", error);
    return {
      success: false,
      message: error.message || "Interner Serverfehler",
    };
  }
}
