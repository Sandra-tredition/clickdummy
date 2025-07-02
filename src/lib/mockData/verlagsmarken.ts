// Mock data for publisher brands (Verlagsmarken)
export interface MockVerlagsmarke {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  contact_email?: string;
  project_count?: number;
  created_at: string;
  updated_at: string;
}

export const mockVerlagsmarken: MockVerlagsmarke[] = [
  {
    id: "verlag-1",
    name: "Beispiel Verlag",
    description: "Ein Beispielverlag für die Demonstration der Plattform.",
    website: "https://beispielverlag.de",
    contact_email: "kontakt@beispielverlag.de",
    project_count: 12,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
  },
  {
    id: "verlag-2",
    name: "Literatur Verlag",
    description: "Spezialisiert auf literarische Werke und Belletristik.",
    website: "https://literaturverlag.de",
    contact_email: "info@literaturverlag.de",
    project_count: 8,
    created_at: "2024-01-11T09:30:00Z",
    updated_at: "2024-01-11T09:30:00Z",
  },
  {
    id: "verlag-3",
    name: "Wissenschaftsverlag",
    description: "Fachverlag für wissenschaftliche Publikationen.",
    website: "https://wissenschaftsverlag.de",
    contact_email: "redaktion@wissenschaftsverlag.de",
    project_count: 15,
    created_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-12T16:45:00Z",
  },
  {
    id: "verlag-4",
    name: "Kinderbuchverlag",
    description: "Spezialisiert auf Kinder- und Jugendbücher.",
    website: "https://kinderbuchverlag.de",
    contact_email: "lektorat@kinderbuchverlag.de",
    project_count: 25,
    created_at: "2024-01-13T11:20:00Z",
    updated_at: "2024-01-13T11:20:00Z",
  },
  {
    id: "verlag-5",
    name: "Ratgeber Verlag",
    description: "Praktische Ratgeber für alle Lebensbereiche.",
    website: "https://ratgeberverlag.de",
    contact_email: "info@ratgeberverlag.de",
    project_count: 18,
    created_at: "2024-01-14T13:15:00Z",
    updated_at: "2024-01-14T13:15:00Z",
  },
  {
    id: "verlag-6",
    name: "Thriller & Krimi Verlag",
    description: "Spezialisiert auf spannende Thriller und Kriminalromane.",
    website: "https://thriller-krimi-verlag.de",
    contact_email: "redaktion@thriller-krimi-verlag.de",
    project_count: 22,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
  },
  {
    id: "verlag-7",
    name: "Historischer Verlag",
    description: "Historische Romane und Sachbücher zur Geschichte.",
    website: "https://historischerverlag.de",
    contact_email: "geschichte@historischerverlag.de",
    project_count: 10,
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "verlag-8",
    name: "Bildungsverlag Nord",
    description: "Verlag für Bildungs- und Lehrmaterialien.",
    website: "https://bildungsverlag-nord.de",
    contact_email: "bildung@bildungsverlag-nord.de",
    project_count: 30,
    created_at: "2024-01-17T15:45:00Z",
    updated_at: "2024-01-17T15:45:00Z",
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
