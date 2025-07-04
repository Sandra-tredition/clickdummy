// Mock data for projects that connects with authors, series, and publishers
export interface MockProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  cover_image?: string;
  languages: string[];
  genres: string[];
  series_id?: string;
  publisher_id?: string;
  target_audience?: string;
  target_audience_groups?: string[];
  slogan?: string;
  selling_points?: string;
  keywords?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const mockProjects: MockProject[] = [
  {
    id: "1",
    title: "Digitales Publizieren Meistern",
    subtitle: "Der komplette Leitfaden für Self-Publisher",
    description:
      "Ein vollständiger Leitfaden für Autoren, die ihre Bücher digital und im Print-on-Demand veröffentlichen möchten. Von der Manuskripterstellung bis zur erfolgreichen Vermarktung.",
    cover_image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    languages: ["Deutsch"],
    genres: ["non-fiction.publishing", "business", "education"],
    series_id: "series-1",
    publisher_id: "verlag-1",
    target_audience: "Angehende Self-Publisher und erfahrene Autoren",
    target_audience_groups: ["Erwachsene", "Fachpublikum", "Unternehmer"],
    slogan: "Vom Manuskript zum Marktführer",
    selling_points:
      "Schritt-für-Schritt Anleitung, Praxiserprobte Strategien, Insider-Tipps, Rechtliche Hinweise, Marketingvorlagen",
    keywords:
      "Self-Publishing, Digitales Publizieren, Buchvermarktung, Print-on-Demand, E-Book, Autorenleitfaden",
    status: "Veröffentlicht",
    created_at: "2023-08-01T10:00:00Z",
    updated_at: "2023-12-15T16:30:00Z",
    user_id: "demo@example.com",
  },
  {
    id: "2",
    title: "Kreatives Schreiben für Anfänger",
    subtitle: "Von der Idee zum fertigen Roman",
    description:
      "Ein praktischer Ratgeber für alle, die ihren ersten Roman schreiben möchten. Mit Übungen, Tipps und Techniken von erfolgreichen Autoren.",
    cover_image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    languages: ["Deutsch"],
    genres: ["non-fiction.writing", "education", "creativity"],
    series_id: "series-1",
    publisher_id: "verlag-1",
    target_audience: "Schreibanfänger und Hobbyautoren",
    target_audience_groups: ["Erwachsene", "Hobbyisten", "Kreative"],
    slogan: "Jeder kann schreiben lernen",
    selling_points:
      "Praktische Übungen, Schritt-für-Schritt Anleitung, Motivationstipps, Charakterentwicklung, Plotstrukturen",
    keywords:
      "Kreatives Schreiben, Roman schreiben, Schreibtipps, Storytelling, Charakterentwicklung, Plot",
    status: "Veröffentlicht",
    created_at: "2023-09-15T14:00:00Z",
    updated_at: "2023-12-20T10:15:00Z",
    user_id: "demo@example.com",
  },
  {
    id: "3",
    title: "Marketing für Kleinunternehmen",
    subtitle: "Erfolgreich werben mit kleinem Budget",
    description:
      "Praktische Marketingstrategien speziell für kleine Unternehmen und Startups. Lernen Sie, wie Sie mit begrenzten Ressourcen maximale Wirkung erzielen.",
    cover_image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    languages: ["Deutsch"],
    genres: [
      "non-fiction.business",
      "non-fiction.marketing",
      "entrepreneurship",
    ],
    series_id: "series-2",
    publisher_id: "verlag-2",
    target_audience: "Kleinunternehmer und Startup-Gründer",
    target_audience_groups: ["Erwachsene", "Unternehmer", "Fachpublikum"],
    slogan: "Großer Erfolg, kleines Budget",
    selling_points:
      "Kosteneffektive Strategien, Praxisbeispiele, Social Media Marketing, Lokales Marketing, Messbare Ergebnisse",
    keywords:
      "Marketing, Kleinunternehmen, Startup, Social Media, Werbung, Budget, ROI, Kundengewinnung",
    status: "Veröffentlicht",
    created_at: "2023-10-01T09:30:00Z",
    updated_at: "2023-12-18T15:45:00Z",
    user_id: "demo@example.com",
  },
];

// Helper function to get project by ID
export const getProjectById = (projectId: string): MockProject | undefined => {
  return mockProjects.find((project) => project.id === projectId);
};

// Helper function to get projects by user
export const getProjectsByUser = (userId: string): MockProject[] => {
  return mockProjects.filter((project) => project.user_id === userId);
};

// Helper function to get projects by series
export const getProjectsBySeries = (seriesId: string): MockProject[] => {
  return mockProjects.filter((project) => project.series_id === seriesId);
};

// Helper function to get projects by publisher
export const getProjectsByPublisher = (publisherId: string): MockProject[] => {
  return mockProjects.filter((project) => project.publisher_id === publisherId);
};
