// Target Audience Classification Options for TreeSelect
export const targetAudienceOptions = [
  {
    value: "altersempfehlungen",
    label: "Altersempfehlungen",
    children: [
      {
        value: "kleinkinder",
        label: "Kleinkinder (0-3 Jahre)",
        children: [
          { value: "babys", label: "Babys (0-12 Monate)" },
          { value: "kleinkinder_1_3", label: "Kleinkinder (1-3 Jahre)" },
        ],
      },
      {
        value: "vorschulkinder",
        label: "Vorschulkinder (3-6 Jahre)",
        children: [
          { value: "kindergarten", label: "Kindergartenkinder (3-4 Jahre)" },
          { value: "vorschule", label: "Vorschulkinder (5-6 Jahre)" },
        ],
      },
      {
        value: "grundschulkinder",
        label: "Grundschulkinder (6-10 Jahre)",
        children: [
          { value: "erstleser", label: "Erstleser (6-8 Jahre)" },
          {
            value: "grundschule_fortgeschritten",
            label: "Fortgeschrittene Leser (8-10 Jahre)",
          },
        ],
      },
      {
        value: "kinder",
        label: "Kinder (10-12 Jahre)",
        children: [
          {
            value: "mittlere_kindheit",
            label: "Mittlere Kindheit (10-11 Jahre)",
          },
          { value: "spaete_kindheit", label: "Späte Kindheit (11-12 Jahre)" },
        ],
      },
      {
        value: "jugendliche",
        label: "Jugendliche (12-18 Jahre)",
        children: [
          { value: "fruehe_jugend", label: "Frühe Jugend (12-14 Jahre)" },
          { value: "mittlere_jugend", label: "Mittlere Jugend (14-16 Jahre)" },
          { value: "spaete_jugend", label: "Späte Jugend (16-18 Jahre)" },
        ],
      },
      {
        value: "junge_erwachsene",
        label: "Junge Erwachsene (18-30 Jahre)",
        children: [
          { value: "studenten", label: "Studenten (18-25 Jahre)" },
          {
            value: "berufseinsteiger",
            label: "Berufseinsteiger (22-30 Jahre)",
          },
        ],
      },
      {
        value: "erwachsene",
        label: "Erwachsene (30-65 Jahre)",
        children: [
          { value: "junge_familien", label: "Junge Familien (30-45 Jahre)" },
          { value: "mittleres_alter", label: "Mittleres Alter (45-65 Jahre)" },
        ],
      },
      {
        value: "senioren",
        label: "Senioren (65+ Jahre)",
        children: [
          { value: "aktive_senioren", label: "Aktive Senioren (65-80 Jahre)" },
          { value: "hochbetagte", label: "Hochbetagte (80+ Jahre)" },
        ],
      },
    ],
  },
  {
    value: "besondere_interessen",
    label: "Besondere Interessen",
    children: [
      {
        value: "hobbys_freizeit",
        label: "Hobbys & Freizeit",
        children: [
          {
            value: "sport_fitness",
            label: "Sport & Fitness",
            children: [
              { value: "laufen", label: "Laufen & Joggen" },
              { value: "kraftsport", label: "Kraftsport & Bodybuilding" },
              { value: "yoga_meditation", label: "Yoga & Meditation" },
              { value: "outdoor_aktivitaeten", label: "Outdoor-Aktivitäten" },
            ],
          },
          {
            value: "kreativitaet_kunst",
            label: "Kreativität & Kunst",
            children: [
              { value: "malen_zeichnen", label: "Malen & Zeichnen" },
              { value: "fotografie", label: "Fotografie" },
              { value: "handwerk_diy", label: "Handwerk & DIY" },
              { value: "musik", label: "Musik" },
            ],
          },
          {
            value: "sammeln_sammler",
            label: "Sammeln & Sammler",
            children: [
              { value: "antiquitaeten", label: "Antiquitäten" },
              { value: "muenzen_briefmarken", label: "Münzen & Briefmarken" },
              { value: "spielzeug", label: "Spielzeug & Modelle" },
            ],
          },
        ],
      },
      {
        value: "beruf_karriere",
        label: "Beruf & Karriere",
        children: [
          {
            value: "fuehrungskraefte",
            label: "Führungskräfte",
            children: [
              {
                value: "ceo_geschaeftsfuehrer",
                label: "CEO & Geschäftsführer",
              },
              { value: "teamleiter", label: "Teamleiter & Abteilungsleiter" },
              { value: "projektmanager", label: "Projektmanager" },
            ],
          },
          {
            value: "fachbereiche",
            label: "Fachbereiche",
            children: [
              { value: "it_technik", label: "IT & Technik" },
              { value: "marketing_vertrieb", label: "Marketing & Vertrieb" },
              {
                value: "finanzen_controlling",
                label: "Finanzen & Controlling",
              },
              { value: "personalwesen", label: "Personalwesen" },
            ],
          },
        ],
      },
      {
        value: "lifestyle_lebensart",
        label: "Lifestyle & Lebensart",
        children: [
          {
            value: "gesundheit_wellness",
            label: "Gesundheit & Wellness",
            children: [
              { value: "ernaehrung", label: "Ernährung & Diät" },
              { value: "alternative_medizin", label: "Alternative Medizin" },
              { value: "mental_health", label: "Mental Health" },
            ],
          },
          {
            value: "reisen_kultur",
            label: "Reisen & Kultur",
            children: [
              { value: "fernreisen", label: "Fernreisen" },
              { value: "staedtereisen", label: "Städtereisen" },
              { value: "kulturinteressierte", label: "Kulturinteressierte" },
            ],
          },
        ],
      },
    ],
  },
  {
    value: "lernen_bildung",
    label: "Lernen & Bildung",
    children: [
      {
        value: "schulbildung",
        label: "Schulbildung",
        children: [
          {
            value: "grundschule",
            label: "Grundschule",
            children: [
              { value: "klasse_1_2", label: "Klasse 1-2" },
              { value: "klasse_3_4", label: "Klasse 3-4" },
            ],
          },
          {
            value: "sekundarstufe_1",
            label: "Sekundarstufe I",
            children: [
              { value: "klasse_5_7", label: "Klasse 5-7" },
              { value: "klasse_8_10", label: "Klasse 8-10" },
            ],
          },
          {
            value: "sekundarstufe_2",
            label: "Sekundarstufe II",
            children: [
              { value: "oberstufe", label: "Oberstufe (11-13)" },
              { value: "abitur_vorbereitung", label: "Abitur-Vorbereitung" },
            ],
          },
        ],
      },
      {
        value: "hochschulbildung",
        label: "Hochschulbildung",
        children: [
          {
            value: "bachelor_studium",
            label: "Bachelor-Studium",
            children: [
              { value: "erstsemester", label: "Erstsemester" },
              {
                value: "fortgeschrittene_bachelor",
                label: "Fortgeschrittene Bachelor",
              },
            ],
          },
          {
            value: "master_studium",
            label: "Master-Studium",
            children: [
              { value: "master_studierende", label: "Master-Studierende" },
              { value: "masterarbeit", label: "Masterarbeit-Phase" },
            ],
          },
          {
            value: "promotion_forschung",
            label: "Promotion & Forschung",
            children: [
              { value: "doktoranden", label: "Doktoranden" },
              { value: "postdocs", label: "Postdocs" },
              { value: "wissenschaftler", label: "Wissenschaftler" },
            ],
          },
        ],
      },
      {
        value: "berufliche_weiterbildung",
        label: "Berufliche Weiterbildung",
        children: [
          {
            value: "zertifizierungen",
            label: "Zertifizierungen",
            children: [
              { value: "it_zertifikate", label: "IT-Zertifikate" },
              { value: "projektmanagement", label: "Projektmanagement" },
              { value: "sprachzertifikate", label: "Sprachzertifikate" },
            ],
          },
          {
            value: "umschulung",
            label: "Umschulung & Neuorientierung",
            children: [
              { value: "berufswechsler", label: "Berufswechsler" },
              { value: "wiedereinstieg", label: "Wiedereinstieg" },
            ],
          },
        ],
      },
      {
        value: "lebenslanges_lernen",
        label: "Lebenslanges Lernen",
        children: [
          {
            value: "senioren_bildung",
            label: "Senioren-Bildung",
            children: [
              {
                value: "universitaet_drittes_alter",
                label: "Universität des 3. Alters",
              },
              { value: "seniorenstudium", label: "Seniorenstudium" },
            ],
          },
          {
            value: "autodidakten",
            label: "Autodidakten",
            children: [
              { value: "selbstlerner", label: "Selbstlerner" },
              { value: "online_lerner", label: "Online-Lerner" },
            ],
          },
        ],
      },
    ],
  },
];

// Helper function to get label for a target audience value
export const getTargetAudienceLabel = (value: string): string => {
  const findLabel = (options: any[], searchValue: string): string | null => {
    for (const option of options) {
      if (option.value === searchValue) {
        return option.label;
      }
      if (option.children) {
        const childLabel = findLabel(option.children, searchValue);
        if (childLabel) return childLabel;
      }
    }
    return null;
  };

  return findLabel(targetAudienceOptions, value) || value;
};
