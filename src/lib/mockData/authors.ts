// Mock data for authors (Urheber)
export interface MockAuthor {
  id: string;
  author_type: "person" | "organization";
  first_name?: string;
  last_name?: string;
  company_name?: string;
  is_pseudonym: boolean;
  birth_date?: string;
  death_date?: string;
  isni?: string;
  profession?: string;
  company?: string;
  website?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export const mockAuthors: MockAuthor[] = [
  {
    id: "author-1",
    author_type: "person",
    first_name: "Maria",
    last_name: "Schmidt",
    is_pseudonym: false,
    birth_date: "1975-03-15",
    death_date: undefined,
    isni: "0000 0001 2345 6789",
    profession: "Schriftstellerin und Schreibcoach",
    company: "Schmidt Schreibwerkstatt GmbH",
    website: "https://maria-schmidt-autorin.de",
    additional_info:
      "Spezialisiert auf Ratgeber und Sachbücher. Über 20 veröffentlichte Werke, davon 8 Bestseller. Regelmäßige Auftritte in Literaturmagazinen und Schreibworkshops. Mitglied im Verband deutscher Schriftsteller (VS). Ausgezeichnet mit dem Deutschen Sachbuchpreis 2019.",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "author-2",
    author_type: "person",
    first_name: "Thomas",
    last_name: "Weber",
    is_pseudonym: false,
    birth_date: "1968-11-22",
    profession: "Lektor und Autor",
    company: "Literaturverlag München",
    website: "https://thomas-weber-lektor.com",
    additional_info: "15 Jahre Erfahrung in der Verlagsbranche",
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "author-3",
    author_type: "organization",
    company_name: "Literaturverlag GmbH",
    is_pseudonym: false,
    website: "https://literaturverlag-gmbh.de",
    additional_info: "Renommierter Verlag für Fachliteratur",
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
  },
  {
    id: "author-4",
    author_type: "person",
    first_name: "Anna",
    last_name: "Müller",
    is_pseudonym: true,
    birth_date: "1982-07-08",
    profession: "Romanautorin",
    website: "https://anna-mueller-books.de",
    additional_info: "Schreibt unter Pseudonym, bekannt für Fantasy-Romane",
    created_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-12T16:45:00Z",
  },
  {
    id: "author-5",
    author_type: "person",
    first_name: "Dr. Michael",
    last_name: "Hoffmann",
    is_pseudonym: false,
    birth_date: "1965-04-30",
    profession: "Wissenschaftler und Autor",
    company: "Universität Hamburg",
    website: "https://dr-hoffmann-research.de",
    additional_info: "Professor für Literaturwissenschaft",
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "author-6",
    author_type: "person",
    first_name: "Sarah",
    last_name: "Klein",
    is_pseudonym: false,
    birth_date: "1990-12-03",
    profession: "Illustratorin",
    website: "https://sarah-klein-illustration.com",
    additional_info: "Spezialisiert auf Kinderbuch-Illustrationen",
    created_at: "2024-01-20T13:15:00Z",
    updated_at: "2024-01-20T13:15:00Z",
  },
  {
    id: "author-7",
    author_type: "person",
    first_name: "Robert",
    last_name: "Fischer",
    is_pseudonym: false,
    birth_date: "1978-09-14",
    profession: "Übersetzer",
    website: "https://robert-fischer-translations.de",
    additional_info: "Übersetzt aus dem Englischen und Französischen",
    created_at: "2024-01-22T08:30:00Z",
    updated_at: "2024-01-22T08:30:00Z",
  },
  {
    id: "author-8",
    author_type: "organization",
    company_name: "Bildungsverlag Nord",
    is_pseudonym: false,
    website: "https://bildungsverlag-nord.de",
    additional_info: "Verlag für Bildungs- und Lehrmaterialien",
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
  {
    id: "author-9",
    author_type: "person",
    first_name: "Lisa",
    last_name: "Wagner",
    is_pseudonym: true,
    birth_date: "1985-06-18",
    profession: "Krimi-Autorin",
    website: "https://lisa-wagner-krimis.de",
    additional_info: "Bestseller-Autorin im Krimi-Genre",
    created_at: "2024-01-28T15:45:00Z",
    updated_at: "2024-01-28T15:45:00Z",
  },
  {
    id: "author-10",
    author_type: "person",
    first_name: "Prof. Dr. Klaus",
    last_name: "Zimmermann",
    is_pseudonym: false,
    birth_date: "1955-02-12",
    profession: "Emeritierter Professor",
    company: "TU Berlin",
    website: "https://prof-zimmermann.de",
    additional_info: "Experte für Technikgeschichte",
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-02-01T09:00:00Z",
  },
  {
    id: "author-11",
    author_type: "person",
    first_name: "Elena",
    last_name: "Richter",
    is_pseudonym: false,
    birth_date: "1987-08-25",
    profession: "Schreibtrainerin und Autorin",
    website: "https://elena-richter-schreibtraining.de",
    additional_info: "Expertin für kreatives Schreiben und Storytelling",
    created_at: "2024-02-05T10:30:00Z",
    updated_at: "2024-02-05T10:30:00Z",
  },
  {
    id: "author-12",
    author_type: "person",
    first_name: "Dr. Marcus",
    last_name: "Bauer",
    is_pseudonym: false,
    birth_date: "1972-11-14",
    profession: "Literaturwissenschaftler und Autor",
    company: "Universität München",
    website: "https://dr-marcus-bauer.de",
    additional_info: "Spezialist für moderne deutsche Literatur",
    created_at: "2024-02-06T14:15:00Z",
    updated_at: "2024-02-06T14:15:00Z",
  },
];

export interface MockAuthorBiography {
  id: string;
  author_id: string;
  biography_text: string;
  biography_label?: string;
  language: string;
  is_standard?: boolean;
  created_at: string;
  updated_at: string;
}

export const mockAuthorBiographies: MockAuthorBiography[] = [
  // Maria Schmidt Biographies
  {
    id: "bio-author-1-1",
    author_id: "author-1",
    biography_text:
      "Maria Schmidt ist eine erfahrene Autorin und Schreibcoach mit über 15 Jahren Erfahrung in der Verlagsbranche. Sie hat bereits mehrere erfolgreiche Ratgeber veröffentlicht und gibt regelmäßig Workshops für angehende Autoren.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },

  // Thomas Weber Biographies
  {
    id: "bio-author-2-1",
    author_id: "author-2",
    biography_text:
      "Thomas Weber hat als Lektor bei mehreren großen Verlagen gearbeitet und teilt sein Wissen über den Publikationsprozess. Seine Expertise umfasst sowohl die redaktionelle Bearbeitung als auch die strategische Buchvermarktung.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },
  // Literaturverlag GmbH Biography
  {
    id: "bio-author-3-1",
    author_id: "author-3",
    biography_text:
      "Die Literaturverlag GmbH ist ein renommierter Verlag für Fachliteratur im Bereich Schreiben und Publizieren. Seit über 20 Jahren unterstützt der Verlag Autoren bei der Veröffentlichung hochwertiger Sachbücher.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
  },
  // Anna Müller Biographies
  {
    id: "bio-author-4-1",
    author_id: "author-4",
    biography_text:
      "Anna Müller schreibt unter Pseudonym und ist bekannt für ihre fesselnden Fantasy-Romane. Ihre Werke haben bereits mehrere Literaturpreise gewonnen und stehen regelmäßig auf den Bestsellerlisten.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-12T16:45:00Z",
  },
  // Dr. Michael Hoffmann Biographies
  {
    id: "bio-author-5-1",
    author_id: "author-5",
    biography_text:
      "Dr. Michael Hoffmann ist Professor für Literaturwissenschaft an der Universität Hamburg. Er hat zahlreiche wissenschaftliche Artikel und Bücher über moderne Literatur veröffentlicht und ist ein gefragter Experte in seinem Fachgebiet.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  // Sarah Klein Biographies
  {
    id: "bio-author-6-1",
    author_id: "author-6",
    biography_text:
      "Sarah Klein ist eine talentierte Illustratorin, die sich auf Kinderbuch-Illustrationen spezialisiert hat. Ihre farbenfrohen und fantasievollen Zeichnungen haben bereits viele Kinderbücher zum Leben erweckt.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-20T13:15:00Z",
    updated_at: "2024-01-20T13:15:00Z",
  },
  // Robert Fischer Biographies
  {
    id: "bio-author-7-1",
    author_id: "author-7",
    biography_text:
      "Robert Fischer ist ein erfahrener Übersetzer, der sich auf literarische Übersetzungen aus dem Englischen und Französischen spezialisiert hat. Seine Übersetzungen zeichnen sich durch ihre Präzision und sprachliche Eleganz aus.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-22T08:30:00Z",
    updated_at: "2024-01-22T08:30:00Z",
  },
  // Bildungsverlag Nord Biography
  {
    id: "bio-author-8-1",
    author_id: "author-8",
    biography_text:
      "Der Bildungsverlag Nord ist ein etablierter Verlag für Bildungs- und Lehrmaterialien. Mit einem Fokus auf innovative Lernkonzepte unterstützt der Verlag Bildungseinrichtungen und Lernende aller Altersgruppen.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
  // Lisa Wagner Biographies
  {
    id: "bio-author-9-1",
    author_id: "author-9",
    biography_text:
      "Lisa Wagner schreibt unter Pseudonym und ist eine der erfolgreichsten Krimi-Autorinnen Deutschlands. Ihre spannungsgeladenen Thriller stehen regelmäßig auf den Bestsellerlisten und wurden bereits für das Fernsehen adaptiert.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-01-28T15:45:00Z",
    updated_at: "2024-01-28T15:45:00Z",
  },
  // Prof. Dr. Klaus Zimmermann Biographies
  {
    id: "bio-author-10-1",
    author_id: "author-10",
    biography_text:
      "Prof. Dr. Klaus Zimmermann ist emeritierter Professor der TU Berlin und anerkannter Experte für Technikgeschichte. Seine Forschungsarbeiten und Publikationen haben maßgeblich zur Entwicklung seines Fachgebiets beigetragen.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-02-01T09:00:00Z",
  },
  // Elena Richter Biographies
  {
    id: "bio-author-11-1",
    author_id: "author-11",
    biography_text:
      "Elena Richter ist eine erfahrene Schreibtrainerin und Autorin, die sich auf kreatives Schreiben und Storytelling spezialisiert hat. Sie leitet Workshops für angehende Autoren und hat bereits mehrere erfolgreiche Ratgeber zum Thema Schreiben veröffentlicht.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-02-05T10:30:00Z",
    updated_at: "2024-02-05T10:30:00Z",
  },
  // Dr. Marcus Bauer Biographies
  {
    id: "bio-author-12-1",
    author_id: "author-12",
    biography_text:
      "Dr. Marcus Bauer ist Literaturwissenschaftler an der Universität München und Experte für moderne deutsche Literatur. Er verbindet wissenschaftliche Expertise mit praktischen Schreibtechniken und hat bereits mehrere Fachbücher über Literaturanalyse und Schreibmethoden veröffentlicht.",
    biography_label: "Standard",
    language: "Deutsch",
    is_standard: true,
    created_at: "2024-02-06T14:15:00Z",
    updated_at: "2024-02-06T14:15:00Z",
  },
];

// Helper function to get biographies for a specific author
export const getBiographiesForAuthor = (
  authorId: string,
): MockAuthorBiography[] => {
  return mockAuthorBiographies.filter((bio) => bio.author_id === authorId);
};

// Helper function to get author by ID
export const getAuthorById = (authorId: string): MockAuthor | undefined => {
  return mockAuthors.find((author) => author.id === authorId);
};

// Helper function to get all authors of a specific type
export const getAuthorsByType = (
  type: "person" | "organization",
): MockAuthor[] => {
  return mockAuthors.filter((author) => author.author_type === type);
};

// Mock project assignments for authors
export interface MockProjectAssignment {
  id: string;
  author_id: string;
  project_id: string;
  project_title: string;
  author_role: string;
  project_status?: string;
  created_at: string;
}

// Mock project assignments with biography associations
export interface MockProjectAssignmentWithBio {
  id: string;
  author_id: string;
  project_id: string;
  project_title: string;
  author_role: string;
  project_status?: string;
  biography_id: string; // Links to specific biography
  created_at: string;
}

export const mockProjectAssignments: MockProjectAssignment[] = [
  // Assignments for the three main projects (1, 2, 3) that demo@example.com user sees

  // Project 1: "Digitales Publizieren Meistern" - Maria Schmidt (Hauptautor) + Thomas Weber (Co-Autor)
  {
    id: "assignment-1-1",
    author_id: "author-1",
    project_id: "1",
    project_title: "Digitales Publizieren Meistern",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "assignment-1-2",
    author_id: "author-2",
    project_id: "1",
    project_title: "Digitales Publizieren Meistern",
    author_role: "Co-Autor",
    project_status: "Veröffentlicht",
    created_at: "2024-01-16T09:30:00Z",
  },

  // Project 2: "Kreatives Schreiben für Anfänger" - Elena Richter (Hauptautor)
  {
    id: "assignment-2-1",
    author_id: "author-11",
    project_id: "2",
    project_title: "Kreatives Schreiben für Anfänger",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    created_at: "2024-02-05T10:30:00Z",
  },

  // Project 3: "Marketing für Kleinunternehmen" - Dr. Marcus Bauer (Hauptautor) + Sarah Klein (Illustrator)
  {
    id: "assignment-3-1",
    author_id: "author-12",
    project_id: "3",
    project_title: "Marketing für Kleinunternehmen",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    created_at: "2024-02-06T14:15:00Z",
  },
  {
    id: "assignment-3-2",
    author_id: "author-6",
    project_id: "3",
    project_title: "Marketing für Kleinunternehmen",
    author_role: "Illustrator",
    project_status: "Veröffentlicht",
    created_at: "2024-01-20T13:15:00Z",
  },

  // Additional assignments for other authors to show in author management
  {
    id: "assignment-other-1",
    author_id: "author-1",
    project_id: "project-other-1",
    project_title: "Schreibtipps für Fortgeschrittene",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    id: "assignment-other-1b",
    author_id: "author-1",
    project_id: "project-other-1b",
    project_title: "Buchmarketing ohne Budget",
    author_role: "Autor",
    project_status: "Geplant",
    created_at: "2024-03-15T10:00:00Z",
  },
  {
    id: "assignment-other-2",
    author_id: "author-2",
    project_id: "project-other-2",
    project_title: "Verlagsmanagement kompakt",
    author_role: "Hauptautor",
    project_status: "Geplant",
    created_at: "2024-02-20T09:30:00Z",
  },
  // Literaturverlag GmbH assignments
  {
    id: "assignment-5",
    author_id: "author-3",
    project_id: "project-5",
    project_title: "Verlagshandbuch 2024",
    author_role: "Herausgeber",
    project_status: "Veröffentlicht",
    created_at: "2024-01-10T14:00:00Z",
  },
  // Anna Müller assignments - Standard biography gets multiple projects
  {
    id: "assignment-6",
    author_id: "author-4",
    project_id: "project-6",
    project_title: "Die Chroniken von Aetheria",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-01-12T16:45:00Z",
  },
  {
    id: "assignment-7",
    author_id: "author-4",
    project_id: "project-7",
    project_title: "Magische Welten Band 2",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    created_at: "2024-02-15T16:45:00Z",
  },
  {
    id: "assignment-7b",
    author_id: "author-4",
    project_id: "project-7c",
    project_title: "Fantasy Welten Kompendium",
    author_role: "Hauptautor",
    project_status: "Geplant",
    created_at: "2024-03-15T16:45:00Z",
  },
  // Dr. Michael Hoffmann assignments
  {
    id: "assignment-8",
    author_id: "author-5",
    project_id: "project-8",
    project_title: "Moderne Literaturanalyse",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-01-18T11:20:00Z",
  },
  // Sarah Klein assignments - only one project (she has only one biography)
  {
    id: "assignment-9",
    author_id: "author-6",
    project_id: "project-9",
    project_title: "Bunte Kinderwelt",
    author_role: "Illustrator",
    project_status: "Veröffentlicht",
    created_at: "2024-01-20T13:15:00Z",
  },
  {
    id: "assignment-9b",
    author_id: "author-6",
    project_id: "project-9b",
    project_title: "Märchenwelt Illustrationen",
    author_role: "Illustrator",
    project_status: "In Bearbeitung",
    created_at: "2024-02-20T13:15:00Z",
  },
  // Robert Fischer assignments
  {
    id: "assignment-11",
    author_id: "author-7",
    project_id: "project-11",
    project_title: "Shakespeare Übersetzungen",
    author_role: "Übersetzer",
    project_status: "Veröffentlicht",
    created_at: "2024-01-22T08:30:00Z",
  },
  // Lisa Wagner assignments - Standard biography gets multiple projects
  {
    id: "assignment-12",
    author_id: "author-9",
    project_id: "project-12",
    project_title: "Mord in München",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-01-28T15:45:00Z",
  },
  {
    id: "assignment-13",
    author_id: "author-9",
    project_id: "project-13",
    project_title: "Der Fall Schneider",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    created_at: "2024-02-25T15:45:00Z",
  },
  {
    id: "assignment-13b",
    author_id: "author-9",
    project_id: "project-13c",
    project_title: "Krimi-Sammlung Band 1",
    author_role: "Hauptautor",
    project_status: "Geplant",
    created_at: "2024-03-25T15:45:00Z",
  },
  // Prof. Dr. Klaus Zimmermann assignments
  {
    id: "assignment-14",
    author_id: "author-10",
    project_id: "project-14",
    project_title: "Geschichte der Technik",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-02-01T09:00:00Z",
  },
  // Elena Richter assignments - Standard biography gets multiple projects
  {
    id: "assignment-15",
    author_id: "author-11",
    project_id: "project-15",
    project_title: "Kreatives Schreiben Handbuch",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-02-05T10:30:00Z",
  },
  {
    id: "assignment-16",
    author_id: "author-11",
    project_id: "project-16",
    project_title: "Storytelling Workshop",
    author_role: "Hauptautor",
    project_status: "Geplant",
    created_at: "2024-03-01T10:30:00Z",
  },
  {
    id: "assignment-16b",
    author_id: "author-11",
    project_id: "project-16c",
    project_title: "Schreibtechniken für Profis",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    created_at: "2024-03-15T10:30:00Z",
  },
  // Dr. Marcus Bauer assignments - Standard biography gets multiple projects
  {
    id: "assignment-17",
    author_id: "author-12",
    project_id: "project-17",
    project_title: "Literaturanalyse Methoden",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    created_at: "2024-02-06T14:15:00Z",
  },
  {
    id: "assignment-18",
    author_id: "author-12",
    project_id: "project-18",
    project_title: "Moderne Schreibtechniken",
    author_role: "Hauptautor",
    project_status: "Geplant",
    created_at: "2024-02-20T14:15:00Z",
  },
  {
    id: "assignment-18b",
    author_id: "author-12",
    project_id: "project-18c",
    project_title: "Literaturwissenschaft heute",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    created_at: "2024-02-28T14:15:00Z",
  },
];

// New assignments with biography associations
export const mockProjectAssignmentsWithBio: MockProjectAssignmentWithBio[] = [
  // Assignments for the three main projects (1, 2, 3) that demo@example.com user sees

  // Project 1: "Digitales Publizieren Meistern" - Maria Schmidt (Autor) + Thomas Weber (Co-Autor)
  {
    id: "assignment-bio-1-1",
    author_id: "author-1",
    project_id: "1",
    project_title: "Digitales Publizieren Meistern",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-1-1", // Standard biography
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "assignment-bio-1-2",
    author_id: "author-2",
    project_id: "1",
    project_title: "Digitales Publizieren Meistern",
    author_role: "Co-Autor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-2-1", // Standard biography
    created_at: "2024-01-16T09:30:00Z",
  },

  // Project 2: "Kreatives Schreiben für Anfänger" - Elena Richter (Autor)
  {
    id: "assignment-bio-2-1",
    author_id: "author-11",
    project_id: "2",
    project_title: "Kreatives Schreiben für Anfänger",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-11-1", // Standard biography
    created_at: "2024-02-05T10:30:00Z",
  },

  // Project 3: "Marketing für Kleinunternehmen" - Dr. Marcus Bauer (Autor) + Sarah Klein (Illustrator)
  {
    id: "assignment-bio-3-1",
    author_id: "author-12",
    project_id: "3",
    project_title: "Marketing für Kleinunternehmen",
    author_role: "Autor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-12-1", // Standard biography
    created_at: "2024-02-06T14:15:00Z",
  },
  {
    id: "assignment-bio-3-2",
    author_id: "author-6",
    project_id: "3",
    project_title: "Marketing für Kleinunternehmen",
    author_role: "Illustrator",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-6-1", // Standard biography
    created_at: "2024-01-20T13:15:00Z",
  },

  // Additional assignments for other projects to show in author management
  {
    id: "assignment-bio-other-1",
    author_id: "author-1",
    project_id: "project-other-1",
    project_title: "Schreibtipps für Fortgeschrittene",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    biography_id: "bio-author-1-1", // Standard biography
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    id: "assignment-bio-other-1b",
    author_id: "author-1",
    project_id: "project-other-1b",
    project_title: "Buchmarketing ohne Budget",
    author_role: "Autor",
    project_status: "Geplant",
    biography_id: "", // No biography assigned - will show "Ohne Biografie"
    created_at: "2024-03-15T10:00:00Z",
  },
  {
    id: "assignment-bio-other-2",
    author_id: "author-2",
    project_id: "project-other-2",
    project_title: "Verlagsmanagement kompakt",
    author_role: "Hauptautor",
    project_status: "Geplant",
    biography_id: "bio-author-2-2", // Wissenschaftlich biography
    created_at: "2024-02-20T09:30:00Z",
  },
  // Anna Müller - Standard biography gets multiple projects
  {
    id: "assignment-bio-4-1",
    author_id: "author-4",
    project_id: "project-6",
    project_title: "Die Chroniken von Aetheria",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-4-1", // Standard biography
    created_at: "2024-01-12T16:45:00Z",
  },
  {
    id: "assignment-bio-4-2",
    author_id: "author-4",
    project_id: "project-7",
    project_title: "Magische Welten Band 2",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    biography_id: "bio-author-4-1", // Same Standard biography
    created_at: "2024-02-15T16:45:00Z",
  },
  {
    id: "assignment-bio-4-3",
    author_id: "author-4",
    project_id: "project-7c",
    project_title: "Fantasy Welten Kompendium",
    author_role: "Hauptautor",
    project_status: "Geplant",
    biography_id: "bio-author-4-2", // Kurz biography gets different project
    created_at: "2024-03-15T16:45:00Z",
  },
  // Lisa Wagner - Standard biography gets multiple projects
  {
    id: "assignment-bio-9-1",
    author_id: "author-9",
    project_id: "project-12",
    project_title: "Mord in München",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-9-1", // Standard biography
    created_at: "2024-01-28T15:45:00Z",
  },
  {
    id: "assignment-bio-9-2",
    author_id: "author-9",
    project_id: "project-13",
    project_title: "Der Fall Schneider",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    biography_id: "bio-author-9-1", // Same Standard biography
    created_at: "2024-02-25T15:45:00Z",
  },
  {
    id: "assignment-bio-9-3",
    author_id: "author-9",
    project_id: "project-13c",
    project_title: "Krimi-Sammlung Band 1",
    author_role: "Hauptautor",
    project_status: "Geplant",
    biography_id: "bio-author-9-2", // Kurz biography gets different project
    created_at: "2024-03-25T15:45:00Z",
  },
  // Elena Richter - Standard biography gets multiple projects
  {
    id: "assignment-bio-11-1",
    author_id: "author-11",
    project_id: "project-15",
    project_title: "Kreatives Schreiben Handbuch",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-11-1", // Standard biography
    created_at: "2024-02-05T10:30:00Z",
  },
  {
    id: "assignment-bio-11-2",
    author_id: "author-11",
    project_id: "project-16",
    project_title: "Storytelling Workshop",
    author_role: "Hauptautor",
    project_status: "Geplant",
    biography_id: "bio-author-11-1", // Same Standard biography
    created_at: "2024-03-01T10:30:00Z",
  },
  {
    id: "assignment-bio-11-3",
    author_id: "author-11",
    project_id: "project-16c",
    project_title: "Schreibtechniken für Profis",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    biography_id: "bio-author-11-2", // Kurz biography gets different project
    created_at: "2024-03-15T10:30:00Z",
  },
  // Dr. Marcus Bauer - Standard biography gets multiple projects
  {
    id: "assignment-bio-12-1",
    author_id: "author-12",
    project_id: "project-17",
    project_title: "Literaturanalyse Methoden",
    author_role: "Hauptautor",
    project_status: "In Bearbeitung",
    biography_id: "bio-author-12-1", // Standard biography
    created_at: "2024-02-06T14:15:00Z",
  },
  {
    id: "assignment-bio-12-2",
    author_id: "author-12",
    project_id: "project-18",
    project_title: "Moderne Schreibtechniken",
    author_role: "Hauptautor",
    project_status: "Geplant",
    biography_id: "bio-author-12-1", // Same Standard biography
    created_at: "2024-02-20T14:15:00Z",
  },
  {
    id: "assignment-bio-12-3",
    author_id: "author-12",
    project_id: "project-18c",
    project_title: "Literaturwissenschaft heute",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-12-2", // Kurz biography gets different project
    created_at: "2024-02-28T14:15:00Z",
  },
  // Single biography authors
  {
    id: "assignment-bio-3-1",
    author_id: "author-3",
    project_id: "project-5",
    project_title: "Verlagshandbuch 2024",
    author_role: "Herausgeber",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-3-1",
    created_at: "2024-01-10T14:00:00Z",
  },
  {
    id: "assignment-bio-5-1",
    author_id: "author-5",
    project_id: "project-8",
    project_title: "Moderne Literaturanalyse",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-5-1",
    created_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "assignment-bio-6-1",
    author_id: "author-6",
    project_id: "project-9",
    project_title: "Bunte Kinderwelt",
    author_role: "Illustrator",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-6-1",
    created_at: "2024-01-20T13:15:00Z",
  },
  {
    id: "assignment-bio-6-2",
    author_id: "author-6",
    project_id: "project-9b",
    project_title: "Märchenwelt Illustrationen",
    author_role: "Illustrator",
    project_status: "In Bearbeitung",
    biography_id: "", // No biography assigned - will show "Ohne Biografie"
    created_at: "2024-02-20T13:15:00Z",
  },
  {
    id: "assignment-bio-7-1",
    author_id: "author-7",
    project_id: "project-11",
    project_title: "Shakespeare Übersetzungen",
    author_role: "Übersetzer",
    project_status: "Veröffentlicht",
    biography_id: "", // No biography assigned - will show "Ohne Biografie"
    created_at: "2024-01-22T08:30:00Z",
  },
  {
    id: "assignment-bio-8-1",
    author_id: "author-8",
    project_id: "project-10",
    project_title: "Bildungshandbuch 2024",
    author_role: "Herausgeber",
    project_status: "Veröffentlicht",
    biography_id: "bio-author-8-1",
    created_at: "2024-01-25T10:00:00Z",
  },
  {
    id: "assignment-bio-10-1",
    author_id: "author-10",
    project_id: "project-14",
    project_title: "Geschichte der Technik",
    author_role: "Hauptautor",
    project_status: "Veröffentlicht",
    biography_id: "", // No biography assigned - will show "Ohne Biografie"
    created_at: "2024-02-01T09:00:00Z",
  },
];

// Helper function to get project assignments for a specific author
export const getProjectAssignmentsForAuthor = (
  authorId: string,
): MockProjectAssignment[] => {
  return mockProjectAssignments.filter(
    (assignment) => assignment.author_id === authorId,
  );
};

// Helper function to get project assignments for a specific author biography
export const getProjectAssignmentsForAuthorBiography = (
  authorId: string,
  biographyId: string,
): MockProjectAssignmentWithBio[] => {
  return mockProjectAssignmentsWithBio.filter(
    (assignment) =>
      assignment.author_id === authorId &&
      assignment.biography_id === biographyId,
  );
};

// Project-specific biography data structure
export interface ProjectBiography {
  id: string;
  project_id: string;
  author_id: string;
  biography_text: string;
  language: string;
  is_standard_based?: boolean; // Whether this was created from a standard biography
  standard_biography_id?: string; // Reference to the standard biography it was based on
  created_at: string;
  updated_at: string;
}

// Mock project-specific biographies
export const mockProjectBiographies: ProjectBiography[] = [
  // Project 1: "Digitales Publizieren Meistern"
  {
    id: "proj-bio-1-author-1",
    project_id: "1",
    author_id: "author-1",
    biography_text:
      "Maria Schmidt ist eine erfahrene Autorin und Schreibcoach mit über 15 Jahren Erfahrung in der Verlagsbranche. Sie hat bereits mehrere erfolgreiche Ratgeber veröffentlicht und gibt regelmäßig Workshops für angehende Autoren. Ihre Expertise im Bereich Self-Publishing macht sie zur idealen Autorin für diesen umfassenden Leitfaden.",

    language: "Deutsch",
    is_standard_based: true,
    standard_biography_id: "bio-author-1-1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "proj-bio-1-author-2",
    project_id: "1",
    author_id: "author-2",
    biography_text:
      "Thomas Weber hat als Lektor bei mehreren großen Verlagen gearbeitet und teilt sein Wissen über den Publikationsprozess. Seine Expertise umfasst sowohl die redaktionelle Bearbeitung als auch die strategische Buchvermarktung. Als Co-Autor bringt er wertvolle Branchenkenntnisse ein.",

    language: "Deutsch",
    is_standard_based: true,
    standard_biography_id: "bio-author-2-1",
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },

  // Project 2: "Kreatives Schreiben für Anfänger"
  {
    id: "proj-bio-2-author-11",
    project_id: "2",
    author_id: "author-11",
    biography_text:
      "Elena Richter ist eine erfahrene Schreibtrainerin und Autorin, die sich auf kreatives Schreiben und Storytelling spezialisiert hat. Sie leitet Workshops für angehende Autoren und hat bereits mehrere erfolgreiche Ratgeber zum Thema Schreiben veröffentlicht. Ihre praktische Herangehensweise hilft Anfängern dabei, ihre ersten Romane zu vollenden.",

    language: "Deutsch",
    is_standard_based: true,
    standard_biography_id: "bio-author-11-1",
    created_at: "2024-02-05T10:30:00Z",
    updated_at: "2024-02-05T10:30:00Z",
  },

  // Project 3: "Marketing für Kleinunternehmen"
  {
    id: "proj-bio-3-author-12",
    project_id: "3",
    author_id: "author-12",
    biography_text:
      "Dr. Marcus Bauer ist Literaturwissenschaftler an der Universität München und Experte für moderne deutsche Literatur. Er verbindet wissenschaftliche Expertise mit praktischen Schreibtechniken und hat bereits mehrere Fachbücher über Literaturanalyse und Schreibmethoden veröffentlicht. Seine analytischen Fähigkeiten bringt er auch in die Marketingberatung ein.",

    language: "Deutsch",
    is_standard_based: true,
    standard_biography_id: "bio-author-12-1",
    created_at: "2024-02-06T14:15:00Z",
    updated_at: "2024-02-06T14:15:00Z",
  },
  {
    id: "proj-bio-3-author-6",
    project_id: "3",
    author_id: "author-6",
    biography_text:
      "Sarah Klein ist eine talentierte Illustratorin, die sich auf Kinderbuch-Illustrationen spezialisiert hat. Ihre farbenfrohen und fantasievollen Zeichnungen haben bereits viele Kinderbücher zum Leben erweckt. Für dieses Marketingbuch erstellt sie anschauliche Grafiken und Diagramme.",

    language: "Deutsch",
    is_standard_based: true,
    standard_biography_id: "bio-author-6-1",
    created_at: "2024-01-20T13:15:00Z",
    updated_at: "2024-01-20T13:15:00Z",
  },
];

// Helper function to get project-specific biographies for a project
export const getProjectBiographiesForProject = (
  projectId: string,
): ProjectBiography[] => {
  return mockProjectBiographies.filter((bio) => bio.project_id === projectId);
};

// Helper function to get project-specific biography for an author in a project
export const getProjectBiographyForAuthor = (
  projectId: string,
  authorId: string,
): ProjectBiography | undefined => {
  return mockProjectBiographies.find(
    (bio) => bio.project_id === projectId && bio.author_id === authorId,
  );
};

// Helper function to get standard biography for an author
export const getStandardBiographyForAuthor = (
  authorId: string,
): MockAuthorBiography | undefined => {
  return mockAuthorBiographies.find(
    (bio) => bio.author_id === authorId && bio.is_standard === true,
  );
};

// Helper function to get project-specific biographies for an author
export const getProjectSpecificBiographiesForAuthor = (
  authorId: string,
): ProjectBiography[] => {
  return mockProjectBiographies.filter((bio) => bio.author_id === authorId);
};

// Helper function to mark a biography as standard
export const markBiographyAsStandard = (
  authorId: string,
  biographyId: string,
): void => {
  // In a real app, this would update the database
  console.log(
    `Marking biography ${biographyId} as standard for author ${authorId}`,
  );
  // This could update a 'is_standard' flag in the biography record
};

// Helper function to create project biography from standard
export const createProjectBiographyFromStandard = (
  projectId: string,
  authorId: string,
  standardBiographyId: string,
): ProjectBiography => {
  const standardBio = getBiographiesForAuthor(authorId).find(
    (bio) => bio.id === standardBiographyId,
  );

  if (!standardBio) {
    throw new Error("Standard biography not found");
  }

  return {
    id: `proj-bio-${projectId}-${authorId}-${Date.now()}`,
    project_id: projectId,
    author_id: authorId,
    biography_text: standardBio.biography_text,

    language: standardBio.language,
    is_standard_based: true,
    standard_biography_id: standardBiographyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Helper function to search authors by name
export const searchAuthors = (searchTerm: string): MockAuthor[] => {
  const term = searchTerm.toLowerCase();
  return mockAuthors.filter((author) => {
    if (author.author_type === "person") {
      const fullName =
        `${author.first_name || ""} ${author.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (author.first_name && author.first_name.toLowerCase().includes(term)) ||
        (author.last_name && author.last_name.toLowerCase().includes(term))
      );
    } else {
      return (
        author.company_name && author.company_name.toLowerCase().includes(term)
      );
    }
  });
};
