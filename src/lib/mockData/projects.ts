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
    target_audience: "Angehende Self-Publisher und erfahrene Autoren",
    target_audience_groups: ["Erwachsene", "Fachpublikum", "Unternehmer"],
    slogan: "Vom Manuskript zum Marktführer",
    selling_points:
      "Detaillierte Schritt-für-Schritt Anleitung, Praxiserprobte und bewährte Strategien, Wertvolle Insider-Tipps von Experten, Umfassende rechtliche Hinweise, Professionelle Marketingvorlagen zum Download",
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
    target_audience: "Schreibanfänger und Hobbyautoren",
    target_audience_groups: ["Erwachsene", "Hobbyisten", "Kreative"],
    slogan: "Jeder kann schreiben lernen",
    selling_points:
      "Über 50 kreative Schreibübungen, Strukturierte Schritt-für-Schritt Anleitung, Praktische Motivationstipps für Autoren, Professionelle Charakterentwicklung und Psychologie, Bewährte Plotstrukturen und Erzähltechniken",
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
    series_id: "1",
    publisher_id: "1",
    target_audience: "Kleinunternehmer und Startup-Gründer",
    target_audience_groups: ["Erwachsene", "Unternehmer", "Fachpublikum"],
    slogan: "Großer Erfolg, kleines Budget",
    selling_points:
      "Bewährte kosteneffektive Marketing-Strategien, Über 30 detaillierte Praxisbeispiele, Umfassender Social Media Marketing Leitfaden, Lokales Marketing für maximale Reichweite, Messbare Ergebnisse und ROI-Optimierung",
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

// KI Text Generation Mock Data
export interface ProjectAIData {
  hasBookContent: boolean;
  fieldGenerationCounts: { [key: string]: number };
  generatedTexts?: {
    description?: string;
    genres?: string[];
    slogan?: string;
    targetAudience?: string;
    sellingPoints?: string;
    keywords?: string | string[];
  };
}

export const projectAIData: { [projectId: string]: ProjectAIData } = {
  "3": {
    hasBookContent: true,
    fieldGenerationCounts: {
      description: 2,
      genres: 1,
      slogan: 3,
      targetAudience: 1,
      sellingPoints: 2,
      keywords: 1,
      titleSuggestions: 1,
    },
    generatedTexts: {
      description:
        "Ein umfassender Leitfaden für effektives Marketing mit begrenzten Ressourcen. Dieses Buch zeigt Kleinunternehmern und Startup-Gründern, wie sie mit kreativen und kostengünstigen Strategien ihre Zielgruppe erreichen und nachhaltiges Wachstum erzielen können.",
      genres: [
        "non-fiction.business.marketing",
        "non-fiction.business.entrepreneurship",
        "non-fiction.self-help.productivity",
      ],
      slogan: "Maximale Wirkung, minimaler Aufwand",
      targetAudience:
        "Ideal für Kleinunternehmer, Startup-Gründer und Selbstständige, die mit begrenztem Budget effektive Marketingstrategien umsetzen möchten. Besonders geeignet für alle, die praktische, sofort umsetzbare Lösungen suchen.",
      sellingPoints:
        "Praxiserprobte Strategien, Kosteneffektive Lösungen, Schritt-für-Schritt Anleitungen, Messbare Ergebnisse",
      keywords: [
        "Marketing",
        "Kleinunternehmen",
        "Budget",
        "Strategie",
        "Wachstum",
      ],
      titleSuggestions: [
        {
          title: "Marketing Meisterschaft",
          subtitle:
            "Wie Kleinunternehmen mit kleinem Budget große Erfolge erzielen",
        },
        {
          title: "Der smarte Unternehmer",
          subtitle: "Effektive Marketingstrategien ohne Millionenbudget",
        },
        {
          title: "Wachstum ohne Grenzen",
          subtitle: "Kreative Marketinglösungen für clevere Unternehmer",
        },
        {
          title: "Budget-Marketing Bibel",
          subtitle: "Maximaler Erfolg mit minimalen Ressourcen",
        },
        {
          title: "Klein aber oho!",
          subtitle: "Wie Startups und Kleinunternehmen erfolgreich werben",
        },
      ],
    },
  },
};

// Helper function to get AI data for a project
export const getProjectAIData = (
  projectId: string,
): ProjectAIData | undefined => {
  return projectAIData[projectId];
};

// Project author assignments with project-specific biography references
export interface ProjectAuthorAssignment {
  id: string;
  project_id: string;
  author_id: string;
  author_role: string;
  project_biography_id?: string; // Reference to project-specific biography
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Mock project author assignments - empty by default
export const mockProjectAuthorAssignments: ProjectAuthorAssignment[] = [
  // No default assignments - all associations are managed via localStorage
];

// Helper function to get project author assignments for a project
export const getProjectAuthorAssignments = (
  projectId: string,
): ProjectAuthorAssignment[] => {
  return mockProjectAuthorAssignments.filter(
    (assignment) => assignment.project_id === projectId,
  );
};

// Helper function to get project author assignment for specific author in project
export const getProjectAuthorAssignment = (
  projectId: string,
  authorId: string,
): ProjectAuthorAssignment | undefined => {
  return mockProjectAuthorAssignments.find(
    (assignment) =>
      assignment.project_id === projectId && assignment.author_id === authorId,
  );
};
