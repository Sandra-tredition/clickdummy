// Mock data for publisher brands (Verlagsmarken)
export interface MockVerlagsmarke {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  project_count?: number;
  created_at: string;
  updated_at: string;
}

export const mockVerlagsmarken: MockVerlagsmarke[] = [
  {
    id: "1",
    name: "Eigenverlag Premium",
    description:
      "Premium Self-Publishing Verlagsmarke für hochwertige Ratgeber und Sachbücher mit professionellem Layout und Marketing-Support.",
    website: "https://eigenverlag-premium.de",
    project_count: 2,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
  },
  {
    id: "2",
    name: "Kreativ Verlag",
    description:
      "Spezialisiert auf kreative Schreibratgeber und Storytelling-Bücher für angehende Autoren und Kreative.",
    website: "https://kreativverlag.de",
    project_count: 2,
    created_at: "2024-01-11T09:30:00Z",
    updated_at: "2024-01-11T09:30:00Z",
  },
];

// Helper function to get Verlagsmarke by ID
export const getVerlagsmarkeById = (
  verlagsmarkeId: string,
): MockVerlagsmarke | undefined => {
  return mockVerlagsmarken.find(
    (verlagsmarke) => verlagsmarke.id === verlagsmarkeId,
  );
};

// Helper function to search Verlagsmarken by name
export const searchVerlagsmarken = (searchTerm: string): MockVerlagsmarke[] => {
  const term = searchTerm.toLowerCase();
  return mockVerlagsmarken.filter(
    (verlagsmarke) =>
      verlagsmarke.name.toLowerCase().includes(term) ||
      verlagsmarke.description.toLowerCase().includes(term),
  );
};
