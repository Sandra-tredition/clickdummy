import { supabase } from "../supabase";

export const fetchProjects = async (userId: string) => {
  try {
    console.log("Fetching projects for user:", userId);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return { data: null, error };
  }
};

export const fetchProjectById = async (id: string) => {
  try {
    console.log("API: fetchProjectById called with ID:", id);

    if (!id || id === "[id]") {
      console.error("API: fetchProjectById called with empty or invalid ID");
      return { data: null, error: new Error("Invalid project ID") };
    }

    // Check if this is a demo project request
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    const isDemoUser = currentUser?.email === "demo@example.com";

    if (isDemoUser && (id === "1" || id === "2")) {
      console.log("API: Fetching demo project with ID:", id);
      const demoProjects = JSON.parse(
        localStorage.getItem("demoProjects") || "[]",
      );
      const demoProject = demoProjects.find((p: any) => p.id === id);

      if (demoProject) {
        console.log("API: Demo project found:", demoProject);
        return { data: demoProject, error: null };
      }
    }

    // For any user, if project ID is "1" or "2", try to return demo data
    if (id === "1" || id === "2") {
      console.log("API: Returning demo project data for ID:", id);

      // First check if demo projects exist in localStorage
      const demoProjects = JSON.parse(
        localStorage.getItem("demoProjects") || "[]",
      );
      const demoProject = demoProjects.find((p: any) => p.id === id);

      if (demoProject) {
        console.log("API: Found demo project in localStorage:", demoProject);
        return { data: demoProject, error: null };
      }

      // Fallback to hardcoded demo data
      const fallbackDemoProject = {
        id: id,
        title: id === "1" ? "Mein erstes Buchprojekt" : "Zweites Buchprojekt",
        subtitle:
          id === "1"
            ? "Eine spannende Geschichte"
            : "Fortsetzung der Geschichte",
        description:
          id === "1"
            ? "Dies ist mein erstes Buchprojekt mit einer faszinierenden Geschichte."
            : "Die Fortsetzung meiner ersten Geschichte mit neuen Abenteuern.",
        cover_image:
          id === "1"
            ? "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"
            : "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        languages: ["Deutsch"],
        genres: ["fiction.literary"],
        target_audience: "Allgemeines Publikum",
        target_audience_groups: ["Erwachsene"],
        slogan: "Ein Beispiel für die Plattform",
        selling_points: "Einfach zu verstehen, Gut strukturiert, Hilfreich",
        keywords: "Beispiel, Demo, Test",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { data: fallbackDemoProject, error: null };
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    console.log("API: fetchProjectById result:", { data, error });

    if (error) {
      console.error("API: Error in fetchProjectById query:", error);
      throw error;
    }
    return { data, error: null };
  } catch (error: any) {
    console.error("API: Error in fetchProjectById:", error);
    return { data: null, error };
  }
};

export const createProject = async (projectData: any) => {
  try {
    console.log("Creating project with data:", projectData);
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    console.log("Project created successfully:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { data: null, error };
  }
};

export const updateProject = async (id: string, projectData: any) => {
  try {
    console.log("updateProject called with:", { id, projectData });

    // Make sure we have all required fields
    const dataToUpdate = {
      ...projectData,
      updated_at: new Date().toISOString(),
    };

    console.log("Sending update to supabase for project ID:", id);
    const { data, error } = await supabase
      .from("projects")
      .update(dataToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase returned error on update:", error);
      throw error;
    }

    console.log("updateProject result:", { data, error });
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return { data: null, error };
  }
};

export const deleteProject = async (id: string) => {
  try {
    // First delete related records in project_authors and editions
    await supabase.from("project_authors").delete().eq("project_id", id);
    await supabase.from("editions").delete().eq("project_id", id);

    // Then delete the project
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { error };
  }
};
