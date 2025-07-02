import { supabase } from "../supabase";

export const fetchAllSeries = async () => {
  try {
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching series:", error);
    return { data: null, error };
  }
};

export const fetchProjectsBySeries = async (seriesId: string) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title")
      .eq("series", seriesId)
      .order("title", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching projects by series:", error);
    return { data: null, error };
  }
};

export const removeProjectFromSeries = async (projectId: string) => {
  try {
    // First get the current series to update the count later
    const { data: projectData } = await supabase
      .from("projects")
      .select("series")
      .eq("id", projectId)
      .single();

    const seriesId = projectData?.series;

    // Remove the project from the series
    const { data, error } = await supabase
      .from("projects")
      .update({ series: null })
      .eq("id", projectId)
      .select();

    // If successful and we had a series, decrement the project count
    if (!error && seriesId) {
      // Get current count
      const { data: seriesData } = await supabase
        .from("series")
        .select("project_count")
        .eq("id", seriesId)
        .single();

      const currentCount = seriesData?.project_count || 0;

      // Update the count (ensure it doesn't go below 0)
      await supabase
        .from("series")
        .update({ project_count: Math.max(0, currentCount - 1) })
        .eq("id", seriesId);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error removing project from series:", error);
    return { data: null, error };
  }
};

export const fetchSeriesById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching series by ID:", error);
    return { data: null, error };
  }
};

export const createSeries = async (seriesData: any) => {
  try {
    const { data, error } = await supabase
      .from("series")
      .insert([seriesData])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating series:", error);
    return { data: null, error };
  }
};

export const updateSeries = async (id: string, seriesData: any) => {
  try {
    const { data, error } = await supabase
      .from("series")
      .update(seriesData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating series:", error);
    return { data: null, error };
  }
};

export const deleteSeries = async (id: string) => {
  try {
    const { error } = await supabase.from("series").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting series:", error);
    return { error };
  }
};
