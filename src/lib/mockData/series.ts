// Mock data for book series (Buchreihen)
export interface MockSeries {
  id: string;
  name: string;
  project_count?: number;
  created_at: string;
  updated_at: string;
}

export const mockSeries: MockSeries[] = [
  {
    id: "mock-series-1",
    name: "Fantasy-Saga",
    project_count: 3,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "mock-series-2",
    name: "Krimi-Reihe",
    project_count: 5,
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "mock-series-3",
    name: "Ratgeber-Serie",
    project_count: 2,
    created_at: "2024-01-17T14:00:00Z",
    updated_at: "2024-01-17T14:00:00Z",
  },
  {
    id: "mock-series-4",
    name: "Wissenschaftliche Reihe",
    project_count: 4,
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "mock-series-5",
    name: "Kinderbuch-Serie",
    project_count: 6,
    created_at: "2024-01-19T16:45:00Z",
    updated_at: "2024-01-19T16:45:00Z",
  },
  {
    id: "mock-series-6",
    name: "Historische Romane",
    project_count: 3,
    created_at: "2024-01-20T13:15:00Z",
    updated_at: "2024-01-20T13:15:00Z",
  },
  {
    id: "mock-series-7",
    name: "Thriller-Collection",
    project_count: 4,
    created_at: "2024-01-21T08:30:00Z",
    updated_at: "2024-01-21T08:30:00Z",
  },
  {
    id: "mock-series-8",
    name: "Biografien berühmter Persönlichkeiten",
    project_count: 2,
    created_at: "2024-01-22T10:00:00Z",
    updated_at: "2024-01-22T10:00:00Z",
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
