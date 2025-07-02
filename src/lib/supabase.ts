// This file now provides mock data instead of connecting to Supabase

// Mock data store
const mockDataStore = {
  projects: [
    {
      id: "1",
      title: "Die Kunst des Schreibens",
      subtitle: "Ein Leitfaden für angehende Autoren",
      description:
        "Ein umfassender Leitfaden für angehende Autoren, der alle Aspekte des kreativen Schreibprozesses abdeckt.",
      cover_image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      languages: ["Deutsch"],
      genres: ["non-fiction.writing", "education"],
      series: "series-1",
      publisher: "Selbstverlag",
      created_at: "2023-01-15T10:30:00Z",
      updated_at: "2023-06-20T14:45:00Z",
      user_id: "user-1",
      target_audience: "Angehende Autoren und Schriftsteller",
      target_audience_groups: ["Erwachsene", "Studenten"],
      slogan: "Schreiben wie die Profis",
      selling_points:
        "Praxisnahe Übungen, Expertentipps, Leicht verständliche Erklärungen",
      keywords: "Schreiben, Kreatives Schreiben, Autorenleitfaden",
    },
    {
      id: "2",
      title: "Der Weg zum Bestseller",
      subtitle: "Vom Manuskript zum Erfolg",
      description:
        "Ein praktischer Ratgeber für Autoren, die ihre Werke erfolgreich vermarkten möchten.",
      cover_image:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
      languages: ["Deutsch", "English"],
      genres: ["non-fiction.marketing", "business"],
      series: null,
      publisher: "Verlag XYZ",
      created_at: "2023-02-10T09:15:00Z",
      updated_at: "2023-07-05T11:20:00Z",
      user_id: "user-1",
      target_audience: "Autoren mit fertigem Manuskript",
      target_audience_groups: ["Erwachsene", "Fachpublikum"],
      slogan: "Vom Manuskript zum Bestseller",
      selling_points: "Marketingstrategien, Verlagskontakte, Selbstvermarktung",
      keywords: "Buchmarketing, Verlag, Selfpublishing",
    },
    {
      id: "3",
      title: "Digitales Publizieren Meistern",
      subtitle: "Der komplette Leitfaden für Self-Publisher",
      description:
        "Ein vollständiger Leitfaden für Autoren, die ihre Bücher digital und im Print-on-Demand veröffentlichen möchten. Von der Manuskripterstellung bis zur erfolgreichen Vermarktung.",
      cover_image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      languages: ["Deutsch"],
      genres: ["non-fiction.publishing", "business", "education"],
      series: "series-1",
      publisher: "Eigenverlag Premium",
      created_at: "2023-08-01T10:00:00Z",
      updated_at: "2023-12-15T16:30:00Z",
      user_id: "user-1",
      target_audience: "Angehende Self-Publisher und erfahrene Autoren",
      target_audience_groups: ["Erwachsene", "Fachpublikum", "Unternehmer"],
      slogan: "Vom Manuskript zum Marktführer",
      selling_points:
        "Schritt-für-Schritt Anleitung, Praxiserprobte Strategien, Insider-Tipps, Rechtliche Hinweise, Marketingvorlagen",
      keywords:
        "Self-Publishing, Digitales Publizieren, Buchvermarktung, Print-on-Demand, E-Book, Autorenleitfaden",
    },
  ],
  editions: [
    {
      id: "1",
      project_id: "1",
      title: "Standardausgabe",
      produktform: "Softcover",
      ausgabenart: null,
      price: 24.99,
      pages: 320,
      status: "Ready",
      isbn: "978-3-123456-78-9",
      is_complete: true,
      format_complete: true,
      content_complete: true,
      cover_complete: true,
      pricing_complete: true,
      authors_complete: true,
      content_file: "content.pdf",
      content_upload_date: "2023-05-10T08:30:00Z",
      cover_file: "cover.jpg",
      cover_upload_date: "2023-05-12T14:20:00Z",
      paper_type: "textdruck-weiss",
      cover_finish: "matt",
      spine_type: "gerade",
      enable_sample_reading: true,
    },
    {
      id: "2",
      project_id: "1",
      title: "Premium Edition",
      produktform: "Hardcover",
      ausgabenart: "Special Edition",
      price: 39.99,
      pages: 320,
      status: "Ready",
      isbn: "978-3-123456-79-6",
      is_complete: true,
      format_complete: true,
      content_complete: true,
      cover_complete: true,
      pricing_complete: true,
      authors_complete: true,
      content_file: "content.pdf",
      content_upload_date: "2023-05-10T08:30:00Z",
      cover_file: "cover-premium.jpg",
      cover_upload_date: "2023-05-15T10:45:00Z",
      paper_type: "premium-weiss",
      cover_finish: "glanz",
      spine_type: "rund",
      enable_sample_reading: true,
    },
    {
      id: "3",
      project_id: "1",
      title: "Digitale Ausgabe",
      produktform: "E-Book",
      price: 14.99,
      pages: 320,
      status: "Draft",
      isbn: null,
      is_complete: false,
      format_complete: true,
      content_complete: true,
      cover_complete: false,
      pricing_complete: true,
      authors_complete: true,
      content_file: "content.epub",
      content_upload_date: "2023-05-20T09:15:00Z",
      cover_file: null,
      cover_upload_date: null,
      enable_sample_reading: true,
    },
    {
      id: "4",
      project_id: "2",
      title: "Standardausgabe",
      produktform: "Softcover",
      ausgabenart: null,
      price: 19.99,
      pages: 240,
      status: "Draft",
      isbn: null,
      is_complete: false,
      format_complete: true,
      content_complete: false,
      cover_complete: false,
      pricing_complete: true,
      authors_complete: true,
    },
    {
      id: "5",
      project_id: "3",
      title: "Vollständige Ausgabe",
      produktform: "Softcover",
      ausgabenart: "Standardausgabe",
      price: 29.99,
      pages: 450,
      status: "Veröffentlicht",
      isbn: "978-3-987654-32-1",
      is_complete: true,
      format_complete: true,
      content_complete: true,
      cover_complete: true,
      pricing_complete: true,
      authors_complete: true,
      content_file: "digitales-publizieren-vollstaendig.pdf",
      content_upload_date: "2023-11-20T14:30:00Z",
      cover_file: "digitales-publizieren-cover.jpg",
      cover_upload_date: "2023-11-22T09:15:00Z",
      paper_type: "premium-weiss",
      cover_finish: "matt",
      spine_type: "gerade",
      enable_sample_reading: true,
      publication_date: "2023-12-01T00:00:00Z",
      sales_start_date: "2023-12-01T00:00:00Z",
      distribution_channels: [
        "Amazon",
        "Thalia",
        "Hugendubel",
        "Eigenvertrieb",
      ],
      marketing_budget: 2500.0,
      expected_sales: 1000,
      author_royalty_rate: 0.15,
    },
    {
      id: "6",
      project_id: "3",
      title: "Premium Hardcover Edition",
      produktform: "Hardcover",
      ausgabenart: "Sonderedition",
      price: 49.99,
      pages: 450,
      status: "Im Verkauf",
      isbn: "978-3-987654-33-8",
      is_complete: true,
      format_complete: true,
      content_complete: true,
      cover_complete: true,
      pricing_complete: true,
      authors_complete: true,
      content_file: "digitales-publizieren-premium.pdf",
      content_upload_date: "2023-11-20T14:30:00Z",
      cover_file: "digitales-publizieren-premium-cover.jpg",
      cover_upload_date: "2023-11-25T11:45:00Z",
      paper_type: "premium-weiss",
      cover_finish: "glanz",
      spine_type: "rund",
      enable_sample_reading: true,
      publication_date: "2023-12-15T00:00:00Z",
      sales_start_date: "2023-12-15T00:00:00Z",
      distribution_channels: ["Amazon", "Buchhandel", "Eigenvertrieb"],
      marketing_budget: 1500.0,
      expected_sales: 300,
      author_royalty_rate: 0.2,
      special_features: "Goldprägung, Lesebändchen, Schutzumschlag",
    },
  ],
  authors: [
    {
      id: "1",
      first_name: "Maria",
      last_name: "Schmidt",
      author_type: "person",
      is_pseudonym: false,
      birth_date: "1975-03-15",
      death_date: null,
      profession: "Autorin und Schreibcoach",
      website: "www.mariaschreibt.de",
    },
    {
      id: "2",
      first_name: "Thomas",
      last_name: "Weber",
      author_type: "person",
      is_pseudonym: false,
      birth_date: "1982-07-22",
      death_date: null,
      profession: "Lektor und Autor",
      website: "www.thomasweber-autor.de",
    },
    {
      id: "3",
      company_name: "Literaturverlag GmbH",
      author_type: "organization",
      is_pseudonym: false,
    },
    {
      id: "4",
      first_name: "Julia",
      last_name: "Müller",
      author_type: "person",
      is_pseudonym: false,
      birth_date: "1988-11-05",
      death_date: null,
      profession: "Marketingexpertin und Buchautorin",
      website: "www.juliamueller-marketing.de",
    },
    {
      id: "5",
      first_name: "Michael",
      last_name: "Becker",
      author_type: "person",
      is_pseudonym: true,
      birth_date: "1970-09-18",
      death_date: null,
      profession: "Verleger und Autor",
      website: "www.michaelbecker-verlag.de",
    },
    {
      id: "6",
      company_name: "Buchmarketing Institut",
      author_type: "organization",
      is_pseudonym: false,
    },
    {
      id: "7",
      first_name: "Dr. Sarah",
      last_name: "Hoffmann",
      author_type: "person",
      is_pseudonym: false,
      birth_date: "1985-04-12",
      death_date: null,
      profession: "Verlagsexpertin und Digitalisierungsberaterin",
      website: "www.sarah-hoffmann-publishing.de",
      bio: "Dr. Sarah Hoffmann ist promovierte Medienwissenschaftlerin und hat über 10 Jahre Erfahrung in der Verlagsbranche. Sie berät Autoren und Verlage bei der digitalen Transformation.",
      awards:
        "Deutscher Verlagspreis 2022, Innovationspreis Digitales Publizieren 2023",
    },
  ],
  project_authors: [
    {
      id: "1",
      project_id: "1",
      author_id: "1",
      author_role: "Autor",
      display_order: 0,
      authors: {
        id: "1",
        first_name: "Maria",
        last_name: "Schmidt",
        author_type: "person",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Maria Schmidt ist eine erfahrene Autorin und Schreibcoach mit über 15 Jahren Erfahrung in der Verlagsbranche.",
        language: "de",
      },
    },
    {
      id: "2",
      project_id: "1",
      author_id: "2",
      author_role: "Co-Autor",
      display_order: 1,
      authors: {
        id: "2",
        first_name: "Thomas",
        last_name: "Weber",
        author_type: "person",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Thomas Weber hat als Lektor bei mehreren großen Verlagen gearbeitet und teilt sein Wissen über den Publikationsprozess.",
        language: "de",
      },
    },
    {
      id: "3",
      project_id: "1",
      author_id: "3",
      author_role: "Herausgeber",
      display_order: 2,
      authors: {
        id: "3",
        company_name: "Literaturverlag GmbH",
        author_type: "organization",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Die Literaturverlag GmbH ist ein renommierter Verlag für Fachliteratur im Bereich Schreiben und Publizieren.",
        language: "de",
      },
    },
    {
      id: "4",
      project_id: "2",
      author_id: "4",
      author_role: "Autor",
      display_order: 0,
      authors: {
        id: "4",
        first_name: "Julia",
        last_name: "Müller",
        author_type: "person",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Julia Müller ist eine Expertin für Buchmarketing mit langjähriger Erfahrung in der Verlagsbranche und hat bereits mehrere Bestseller erfolgreich vermarktet.",
        language: "de",
      },
    },
    {
      id: "5",
      project_id: "2",
      author_id: "5",
      author_role: "Co-Autor",
      display_order: 1,
      authors: {
        id: "5",
        first_name: "Michael",
        last_name: "Becker",
        author_type: "person",
        is_pseudonym: true,
      },
      author_biographies: {
        biography_text:
          "Michael Becker (Pseudonym) ist ein erfahrener Verleger, der sein Insiderwissen über die Verlagsbranche teilt.",
        language: "de",
      },
    },
    {
      id: "6",
      project_id: "2",
      author_id: "6",
      author_role: "Fachliche Beratung",
      display_order: 2,
      authors: {
        id: "6",
        company_name: "Buchmarketing Institut",
        author_type: "organization",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Das Buchmarketing Institut ist eine führende Einrichtung für die Ausbildung und Beratung im Bereich Buchvermarktung.",
        language: "de",
      },
    },
    {
      id: "7",
      project_id: "3",
      author_id: "7",
      author_role: "Hauptautor",
      display_order: 0,
      authors: {
        id: "7",
        first_name: "Dr. Sarah",
        last_name: "Hoffmann",
        author_type: "person",
        is_pseudonym: false,
      },
      author_biographies: {
        biography_text:
          "Dr. Sarah Hoffmann ist eine renommierte Verlagsexpertin und Digitalisierungsberaterin mit über 10 Jahren Erfahrung in der Branche. Sie hat bereits mehrere Bestseller im Bereich Self-Publishing veröffentlicht und berät sowohl Einzelautoren als auch große Verlage bei der digitalen Transformation. Ihre Expertise umfasst alle Aspekte des modernen Publizierens, von der Manuskripterstellung bis zur erfolgreichen Vermarktung.",
        language: "de",
      },
    },
  ],
  series: [
    {
      id: "series-1",
      name: "Schreiben & Publizieren",
      description: "Eine Buchreihe für angehende Autoren",
      project_count: 3,
    },
    {
      id: "series-2",
      name: "Marketing für Autoren",
      description: "Alles über die Vermarktung von Büchern",
      project_count: 1,
    },
  ],
};

// Mock Supabase client with similar API but using mock data
export const supabase = {
  from: (table) => {
    return {
      select: (columns) => {
        console.log(`Mock Supabase: select ${columns || "*"} from ${table}`);
        return {
          eq: (column, value) => {
            console.log(`Mock Supabase: where ${column} = ${value}`);
            return {
              single: () => {
                const result = mockDataStore[table]?.find(
                  (item) => item[column] === value,
                );
                console.log(`Mock Supabase: single result:`, result);
                return {
                  data: result || null,
                  error: result
                    ? null
                    : {
                        message: `Item not found in ${table} with ${column}=${value}`,
                      },
                };
              },
              order: () => {
                const results =
                  mockDataStore[table]?.filter(
                    (item) => item[column] === value,
                  ) || [];
                console.log(
                  `Mock Supabase: filtered results for ${table} where ${column}=${value}:`,
                  results,
                );
                return {
                  data: results,
                  error: null,
                };
              },
              in: () => ({
                data: mockDataStore[table] || [],
                error: null,
              }),
              select: (nestedSelect) => {
                // This is for nested selects like .select(`*, authors(*)`)
                console.log(
                  `Mock Supabase: nested select called with:`,
                  nestedSelect,
                );
                const results =
                  mockDataStore[table]?.filter(
                    (item) => item[column] === value,
                  ) || [];

                // For project_authors table, ensure we're returning the full nested data
                if (table === "project_authors") {
                  console.log(
                    `Mock Supabase: enhancing project_authors with nested data`,
                  );
                  // Make sure we're returning the full author data
                  const enhancedResults = results.map((item) => {
                    // Clone to avoid modifying the original data
                    const enhancedItem = { ...item };

                    // If authors data is referenced but not fully included, add it
                    if (item.author_id && !item.authors) {
                      const authorData = mockDataStore.authors?.find(
                        (a) => a.id === item.author_id,
                      );
                      if (authorData) {
                        enhancedItem.authors = authorData;
                      }
                    }

                    // If biography data is referenced but not fully included
                    if (item.biography_id && !item.author_biographies) {
                      // Create a mock biography if none exists
                      enhancedItem.author_biographies = {
                        id: item.biography_id || `bio-${item.id}`,
                        biography_text:
                          "Sample biography text for this author.",
                        language: "de",
                      };
                    }

                    return enhancedItem;
                  });

                  console.log(
                    `Mock Supabase: enhanced project_authors results:`,
                    enhancedResults,
                  );
                  return {
                    data: enhancedResults,
                    error: null,
                  };
                }

                console.log(`Mock Supabase: nested select results:`, results);
                return {
                  data: results,
                  error: null,
                };
              },
            };
          },
          order: () => {
            console.log(
              `Mock Supabase: returning all ${table}:`,
              mockDataStore[table],
            );
            return {
              data: mockDataStore[table] || [],
              error: null,
            };
          },
          in: () => ({
            data: mockDataStore[table] || [],
            error: null,
          }),
        };
      },
      insert: (items) => {
        return {
          select: () => {
            const newItems = items.map((item) => ({
              ...item,
              id: `new-${Math.random().toString(36).substr(2, 9)}`,
            }));

            if (!mockDataStore[table]) {
              mockDataStore[table] = [];
            }

            mockDataStore[table].push(...newItems);

            return {
              data: newItems,
              error: null,
            };
          },
        };
      },
      update: (item) => {
        return {
          eq: (column, value) => {
            return {
              select: () => {
                const index = mockDataStore[table]?.findIndex(
                  (record) => record[column] === value,
                );

                if (index !== -1 && index !== undefined) {
                  mockDataStore[table][index] = {
                    ...mockDataStore[table][index],
                    ...item,
                    updated_at: new Date().toISOString(),
                  };

                  return {
                    data: [mockDataStore[table][index]],
                    error: null,
                  };
                }

                return {
                  data: null,
                  error: {
                    message: `Item not found in ${table} with ${column}=${value}`,
                  },
                };
              },
            };
          },
        };
      },
      delete: () => {
        return {
          eq: (column, value) => {
            const index = mockDataStore[table]?.findIndex(
              (item) => item[column] === value,
            );

            if (index !== -1 && index !== undefined) {
              mockDataStore[table].splice(index, 1);
              return { error: null };
            }

            return { error: null }; // Silently succeed even if not found
          },
          in: (column, values) => {
            if (mockDataStore[table]) {
              mockDataStore[table] = mockDataStore[table].filter(
                (item) => !values.includes(item[column]),
              );
            }
            return { error: null };
          },
        };
      },
    };
  },
  auth: {
    getSession: () =>
      Promise.resolve({
        data: {
          session: { user: { id: "user-1", email: "test@example.com" } },
        },
      }),
    onAuthStateChange: (callback) => {
      // Mock auth state change
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: ({ email, password }) => {
      return Promise.resolve({
        data: { session: { user: { id: "user-1", email } } },
        error: null,
      });
    },
    signUp: ({ email, password, options }) => {
      return Promise.resolve({
        data: {
          user: { id: "new-user", email },
          session: { user: { id: "new-user", email } },
        },
        error: null,
      });
    },
    resetPasswordForEmail: (email) => {
      return Promise.resolve({ data: {}, error: null });
    },
    signInWithOAuth: ({ provider }) => {
      return Promise.resolve({
        data: {
          user: { id: `${provider}-user`, provider },
          session: { user: { id: `${provider}-user`, provider } },
        },
        error: null,
      });
    },
    signOut: () => Promise.resolve({ error: null }),
  },
  functions: {
    invoke: (name, { body }) => {
      console.log(`Mock function invocation: ${name}`, body);
      return Promise.resolve({ data: { success: true }, error: null });
    },
  },
};

console.log("Mock data system initialized instead of Supabase");
