// Mock genre data with hierarchical structure
export interface GenreOption {
  value: string;
  label: string;
  children?: GenreOption[];
}

export const genreOptions: GenreOption[] = [
  {
    value: "fiction",
    label: "Belletristik",
    children: [
      {
        value: "fiction.literary",
        label: "Literarische Fiktion",
        children: [
          {
            value: "fiction.literary.contemporary",
            label: "Gegenwartsliteratur",
          },
          { value: "fiction.literary.classic", label: "Klassische Literatur" },
          {
            value: "fiction.literary.experimental",
            label: "Experimentelle Literatur",
          },
        ],
      },
      {
        value: "fiction.romance",
        label: "Romantik",
        children: [
          {
            value: "fiction.romance.contemporary",
            label: "Zeitgenössische Romantik",
          },
          {
            value: "fiction.romance.historical",
            label: "Historische Romantik",
          },
          {
            value: "fiction.romance.paranormal",
            label: "Paranormale Romantik",
          },
        ],
      },
      {
        value: "fiction.thriller",
        label: "Thriller",
        children: [
          { value: "fiction.thriller.psychological", label: "Psychothriller" },
          { value: "fiction.thriller.crime", label: "Krimi" },
          { value: "fiction.thriller.suspense", label: "Spannungsroman" },
        ],
      },
      {
        value: "fiction.fantasy",
        label: "Fantasy",
        children: [
          { value: "fiction.fantasy.epic", label: "Epic Fantasy" },
          { value: "fiction.fantasy.urban", label: "Urban Fantasy" },
          { value: "fiction.fantasy.dark", label: "Dark Fantasy" },
        ],
      },
      {
        value: "fiction.scifi",
        label: "Science Fiction",
        children: [
          { value: "fiction.scifi.hard", label: "Hard Science Fiction" },
          { value: "fiction.scifi.space", label: "Space Opera" },
          { value: "fiction.scifi.dystopian", label: "Dystopie" },
        ],
      },
      {
        value: "fiction.historical",
        label: "Historischer Roman",
        children: [
          { value: "fiction.historical.medieval", label: "Mittelalter" },
          { value: "fiction.historical.wwii", label: "Zweiter Weltkrieg" },
          { value: "fiction.historical.ancient", label: "Antike" },
        ],
      },
    ],
  },
  {
    value: "non-fiction",
    label: "Sachbuch",
    children: [
      {
        value: "non-fiction.business",
        label: "Business & Wirtschaft",
        children: [
          {
            value: "non-fiction.business.entrepreneurship",
            label: "Unternehmertum",
          },
          { value: "non-fiction.business.marketing", label: "Marketing" },
          { value: "non-fiction.business.finance", label: "Finanzen" },
          { value: "non-fiction.business.management", label: "Management" },
        ],
      },
      {
        value: "non-fiction.self-help",
        label: "Selbsthilfe & Persönlichkeitsentwicklung",
        children: [
          { value: "non-fiction.self-help.motivation", label: "Motivation" },
          {
            value: "non-fiction.self-help.productivity",
            label: "Produktivität",
          },
          {
            value: "non-fiction.self-help.relationships",
            label: "Beziehungen",
          },
          { value: "non-fiction.self-help.mindfulness", label: "Achtsamkeit" },
        ],
      },
      {
        value: "non-fiction.health",
        label: "Gesundheit & Fitness",
        children: [
          { value: "non-fiction.health.nutrition", label: "Ernährung" },
          { value: "non-fiction.health.fitness", label: "Fitness" },
          { value: "non-fiction.health.mental", label: "Mentale Gesundheit" },
          {
            value: "non-fiction.health.alternative",
            label: "Alternative Medizin",
          },
        ],
      },
      {
        value: "non-fiction.education",
        label: "Bildung & Lernen",
        children: [
          { value: "non-fiction.education.language", label: "Sprachen" },
          { value: "non-fiction.education.skills", label: "Fertigkeiten" },
          { value: "non-fiction.education.academic", label: "Akademisch" },
          {
            value: "non-fiction.education.professional",
            label: "Berufliche Weiterbildung",
          },
        ],
      },
      {
        value: "non-fiction.technology",
        label: "Technologie & Computer",
        children: [
          {
            value: "non-fiction.technology.programming",
            label: "Programmierung",
          },
          {
            value: "non-fiction.technology.ai",
            label: "Künstliche Intelligenz",
          },
          { value: "non-fiction.technology.web", label: "Webentwicklung" },
          { value: "non-fiction.technology.data", label: "Datenanalyse" },
        ],
      },
      {
        value: "non-fiction.publishing",
        label: "Publishing & Schreiben",
        children: [
          {
            value: "non-fiction.publishing.self-publishing",
            label: "Self-Publishing",
          },
          {
            value: "non-fiction.publishing.writing",
            label: "Kreatives Schreiben",
          },
          {
            value: "non-fiction.publishing.editing",
            label: "Lektorat & Korrektorat",
          },
          { value: "non-fiction.publishing.marketing", label: "Buchmarketing" },
        ],
      },
    ],
  },
  {
    value: "children",
    label: "Kinder- & Jugendbuch",
    children: [
      {
        value: "children.picture",
        label: "Bilderbuch",
        children: [
          {
            value: "children.picture.toddler",
            label: "Kleinkinder (0-3 Jahre)",
          },
          {
            value: "children.picture.preschool",
            label: "Vorschule (3-6 Jahre)",
          },
        ],
      },
      {
        value: "children.middle-grade",
        label: "Kinderbuch (6-12 Jahre)",
        children: [
          { value: "children.middle-grade.adventure", label: "Abenteuer" },
          { value: "children.middle-grade.fantasy", label: "Fantasy" },
          {
            value: "children.middle-grade.realistic",
            label: "Realistische Fiktion",
          },
        ],
      },
      {
        value: "children.young-adult",
        label: "Jugendbuch (12+ Jahre)",
        children: [
          { value: "children.young-adult.romance", label: "Romantik" },
          { value: "children.young-adult.dystopian", label: "Dystopie" },
          {
            value: "children.young-adult.contemporary",
            label: "Gegenwartsliteratur",
          },
        ],
      },
    ],
  },
  {
    value: "poetry",
    label: "Lyrik & Poesie",
    children: [
      { value: "poetry.contemporary", label: "Zeitgenössische Lyrik" },
      { value: "poetry.classic", label: "Klassische Lyrik" },
      { value: "poetry.spoken-word", label: "Spoken Word" },
    ],
  },
  {
    value: "biography",
    label: "Biografie & Memoiren",
    children: [
      { value: "biography.autobiography", label: "Autobiografie" },
      { value: "biography.memoir", label: "Memoiren" },
      { value: "biography.celebrity", label: "Prominenten-Biografie" },
    ],
  },
];

// AI-suggested genres based on content analysis
export const getAISuggestedGenres = (bookContent?: string): string[] => {
  // This would normally analyze the book content using AI
  // For now, return some mock suggestions based on common patterns

  if (!bookContent) {
    return [
      "non-fiction.business.marketing",
      "non-fiction.business.entrepreneurship",
      "non-fiction.self-help.productivity",
    ];
  }

  const content = bookContent.toLowerCase();
  const suggestions: string[] = [];

  // Business & Marketing
  if (
    content.includes("marketing") ||
    content.includes("business") ||
    content.includes("unternehmen")
  ) {
    suggestions.push(
      "non-fiction.business.marketing",
      "non-fiction.business.entrepreneurship",
    );
  }

  // Self-Publishing
  if (
    content.includes("publishing") ||
    content.includes("autor") ||
    content.includes("schreiben")
  ) {
    suggestions.push(
      "non-fiction.publishing.self-publishing",
      "non-fiction.publishing.writing",
    );
  }

  // Technology
  if (
    content.includes("technologie") ||
    content.includes("computer") ||
    content.includes("digital")
  ) {
    suggestions.push(
      "non-fiction.technology.programming",
      "non-fiction.technology.ai",
    );
  }

  // Health & Fitness
  if (
    content.includes("gesundheit") ||
    content.includes("fitness") ||
    content.includes("ernährung")
  ) {
    suggestions.push(
      "non-fiction.health.nutrition",
      "non-fiction.health.fitness",
    );
  }

  // Romance
  if (
    content.includes("liebe") ||
    content.includes("romantik") ||
    content.includes("beziehung")
  ) {
    suggestions.push(
      "fiction.romance.contemporary",
      "fiction.romance.historical",
    );
  }

  // Thriller/Crime
  if (
    content.includes("mord") ||
    content.includes("krimi") ||
    content.includes("spannung")
  ) {
    suggestions.push(
      "fiction.thriller.crime",
      "fiction.thriller.psychological",
    );
  }

  // Fantasy
  if (
    content.includes("magie") ||
    content.includes("fantasy") ||
    content.includes("drache")
  ) {
    suggestions.push("fiction.fantasy.epic", "fiction.fantasy.urban");
  }

  // Default suggestions if no specific content matches
  if (suggestions.length === 0) {
    suggestions.push(
      "fiction.literary.contemporary",
      "non-fiction.self-help.motivation",
      "non-fiction.business.marketing",
    );
  }

  return suggestions.slice(0, 5); // Return max 5 suggestions
};

// Helper function to get genre label by value
export const getGenreLabel = (value: string): string => {
  const findGenre = (
    genres: GenreOption[],
    targetValue: string,
  ): string | null => {
    for (const genre of genres) {
      if (genre.value === targetValue) {
        return genre.label;
      }
      if (genre.children) {
        const found = findGenre(genre.children, targetValue);
        if (found) return found;
      }
    }
    return null;
  };

  return findGenre(genreOptions, value) || value.split(".").pop() || value;
};
