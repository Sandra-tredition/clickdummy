import { supabase } from "../supabase";

export const fetchEditionsByProjectId = async (projectId: string) => {
  try {
    console.log(
      "API: fetchEditionsByProjectId called with projectId:",
      projectId,
    );
    if (!projectId || projectId === "[id]") {
      console.error(
        "API: fetchEditionsByProjectId called with empty or invalid projectId",
      );
      return { data: null, error: new Error("Invalid project ID") };
    }

    const { data, error } = await supabase
      .from("editions")
      .select("*")
      .eq("project_id", projectId);

    console.log("API: fetchEditionsByProjectId result:", { data, error });

    if (error) {
      console.error("API: Error in fetchEditionsByProjectId query:", error);
      throw error;
    }
    return { data, error: null };
  } catch (error: any) {
    console.error("API: Error fetching editions:", error);
    return { data: null, error };
  }
};

export const createEdition = async (editionData: any) => {
  try {
    console.log("Creating edition with data:", editionData);
    const { data, error } = await supabase
      .from("editions")
      .insert([
        {
          ...editionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    console.log("Edition created successfully:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating edition:", error);
    return { data: null, error };
  }
};

export const updateEdition = async (id: string, editionData: any) => {
  try {
    console.log("API: Updating edition with ID", id, "and data:", editionData);
    const { data, error } = await supabase
      .from("editions")
      .update({
        ...editionData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    console.log("API: Edition updated successfully:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating edition:", error);
    return { data: null, error };
  }
};

export const deleteEdition = async (id: string) => {
  try {
    const { error } = await supabase.from("editions").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting edition:", error);
    return { error };
  }
};
