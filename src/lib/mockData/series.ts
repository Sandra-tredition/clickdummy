// Mock data for book series (Buchreihen)
export interface MockSeries {
  id: string;
  name: string;
  description?: string;
  project_count?: number;
  created_at: string;
  updated_at: string;
}

export const mockSeries: MockSeries[] = [
  {
    id: "series-1",
    name: "Self-Publishing Ratgeber",
    description:
      "Umfassende Ratgeber-Serie für Self-Publisher und Autoren, die den gesamten Prozess von der Ideenfindung bis zur Vermarktung abdeckt.",
    project_count: 2,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "series-2",
    name: "Kreatives Schreiben Kompakt",
    description:
      "Praktische Anleitungen für kreatives Schreiben mit Fokus auf Storytelling, Charakterentwicklung und Schreibtechniken.",
    project_count: 2,
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "series-3",
    name: "Business Essentials",
    description:
      "Grundlagen für Kleinunternehmer und Startups - von der Geschäftsidee bis zur erfolgreichen Umsetzung.",
    project_count: 3,
    created_at: "2024-01-17T14:00:00Z",
    updated_at: "2024-01-17T14:00:00Z",
  },
  {
    id: "mock-series-4",
    name: "Wissenschaftliche Reihe",
    description:
      "Akademische Publikationen und Forschungsarbeiten aus verschiedenen wissenschaftlichen Disziplinen.",
    project_count: 4,
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
];

// Helper function to get series by ID
export const getSeriesById = (seriesId: string): MockSeries | undefined => {
  return mockSeries.find((series) => series.id === seriesId);
};

// Helper function to search series by name
export const searchSeries = (searchTerm: string): MockSeries[] => {
  const term = searchTerm.toLowerCase();
  return mockSeries.filter((series) =>
    series.name.toLowerCase().includes(term),
  );
};
