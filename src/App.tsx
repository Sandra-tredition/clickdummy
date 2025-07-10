import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./lib/supabase";

// Lazy load pages
const Account = lazy(() => import("./pages/account"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Buchmanagement = lazy(() => import("./pages/buchmanagement"));
const Authors = lazy(() => import("./pages/authors"));
const AuthorDetail = lazy(() => import("./pages/authors/[id]"));
const Reports = lazy(() => import("./pages/reports"));
const Series = lazy(() => import("./pages/series"));
const Verlagsmarken = lazy(() => import("./pages/verlagsmarken"));

const ProjectDetail = lazy(() => import("./pages/project/[id]"));
const EditionDetail = lazy(() => import("./pages/edition/EditionDetailPage"));
const OrderDetail = lazy(() => import("./pages/order/[id]"));
const TestDataManager = lazy(() => import("./pages/test-data-manager"));

function App() {
  useEffect(() => {
    const createDefaultAuthorAndProject = async () => {
      try {
        console.log("Starting to create default author and project...");

        // Check if default author exists
        const { data: existingAuthors, error: authorCheckError } =
          await supabase
            .from("authors")
            .select("id")
            .eq("last_name", "Mustermann")
            .eq("first_name", "Max");

        if (authorCheckError) {
          console.error(
            "Error checking for existing author:",
            authorCheckError,
          );
          throw authorCheckError;
        }

        console.log("Existing authors check result:", existingAuthors);
        let authorId;

        // Create default author if it doesn't exist
        if (!existingAuthors || existingAuthors.length === 0) {
          console.log("Creating default author...");
          // Create author
          const { data: authorData, error: authorError } = await supabase
            .from("authors")
            .insert([
              {
                author_type: "person",
                first_name: "Max",
                last_name: "Mustermann",
                is_pseudonym: false,
              },
            ])
            .select();

          if (authorError) {
            console.error("Error creating author:", authorError);
            throw authorError;
          }

          if (!authorData || authorData.length === 0) {
            console.error("No author data returned after insert");
            return;
          }

          authorId = authorData[0].id;
          console.log("Created author with ID:", authorId);

          // Create biography for the author
          console.log("Creating author biography...");
          const { data: bioData, error: bioError } = await supabase
            .from("author_biographies")
            .insert([
              {
                author_id: authorId,
                biography_text: "Max Mustermann ist ein deutscher Autor.",
                biography_label: "Standard",
              },
            ])
            .select();

          if (bioError) {
            console.error("Error creating biography:", bioError);
            throw bioError;
          }

          console.log("Created biography:", bioData);
        } else {
          authorId = existingAuthors[0].id;
          console.log("Using existing author with ID:", authorId);
        }

        // Check if default project exists
        console.log("Checking for existing project...");
        const { data: existingProjects, error: projectCheckError } =
          await supabase
            .from("projects")
            .select("id")
            .eq("title", "Beispielprojekt");

        if (projectCheckError) {
          console.error(
            "Error checking for existing project:",
            projectCheckError,
          );
          throw projectCheckError;
        }

        console.log("Existing projects check result:", existingProjects);
        let projectId;

        // Create default project if it doesn't exist
        if (!existingProjects || existingProjects.length === 0) {
          console.log("Creating default project...");
          const { data: projectData, error: projectError } = await supabase
            .from("projects")
            .insert([
              {
                title: "Beispielprojekt",
                description:
                  "Ein Beispielprojekt zur Demonstration der Plattform.",
                languages: ["Deutsch"],
                cover_image:
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
                genres: ["fiction.literary"],
                target_audience: "Allgemeines Publikum",
                target_audience_groups: ["Erwachsene"],
                slogan: "Ein Beispiel für die Plattform",
                selling_points:
                  "Einfach zu verstehen, Gut strukturiert, Hilfreich",
                keywords: "Beispiel, Demo, Test",
              },
            ])
            .select();

          if (projectError) {
            console.error("Error creating project:", projectError);
            throw projectError;
          }

          if (!projectData || projectData.length === 0) {
            console.error("No project data returned after insert");
            return;
          }

          projectId = projectData[0].id;
          console.log("Created project with ID:", projectId);
        } else {
          projectId = existingProjects[0].id;
          console.log("Using existing project with ID:", projectId);
        }

        // Check if author is already assigned to project
        console.log("Checking if author is assigned to project...");
        const { data: existingAssignments, error: assignmentCheckError } =
          await supabase
            .from("project_authors")
            .select("id")
            .eq("author_id", authorId)
            .eq("project_id", projectId);

        if (assignmentCheckError) {
          console.error(
            "Error checking author assignment:",
            assignmentCheckError,
          );
          throw assignmentCheckError;
        }

        console.log("Existing assignments check result:", existingAssignments);

        // Assign author to project if not already assigned
        if (!existingAssignments || existingAssignments.length === 0) {
          // Get author biography
          console.log("Getting author biographies...");
          const { data: biographies, error: bioFetchError } = await supabase
            .from("author_biographies")
            .select("id")
            .eq("author_id", authorId);

          if (bioFetchError) {
            console.error("Error fetching biographies:", bioFetchError);
            throw bioFetchError;
          }

          console.log("Found biographies:", biographies);

          if (biographies && biographies.length > 0) {
            console.log("Assigning author to project...");
            const { data: assignmentData, error: assignmentError } =
              await supabase
                .from("project_authors")
                .insert([
                  {
                    project_id: projectId,
                    author_id: authorId,
                    author_role: "Autor",
                    biography_id: biographies[0].id,
                  },
                ])
                .select();

            if (assignmentError) {
              console.error(
                "Error assigning author to project:",
                assignmentError,
              );
              throw assignmentError;
            }

            console.log("Author assigned to project:", assignmentData);
          } else {
            console.error("No biographies found for author ID:", authorId);
          }
        } else {
          console.log("Author already assigned to project");
        }

        // Create a default edition for the project if none exists
        console.log("Checking for existing editions...");
        const { data: existingEditions, error: editionCheckError } =
          await supabase
            .from("editions")
            .select("id")
            .eq("project_id", projectId);

        if (editionCheckError) {
          console.error(
            "Error checking for existing editions:",
            editionCheckError,
          );
          throw editionCheckError;
        }

        console.log("Existing editions check result:", existingEditions);

        if (!existingEditions || existingEditions.length === 0) {
          console.log("Creating default edition...");
          const { data: editionData, error: editionError } = await supabase
            .from("editions")
            .insert([
              {
                project_id: projectId,
                title: "Standardausgabe",
                produktform: "Softcover",
                ausgabenart: null,
                price: 14.99,
                pages: 200,
                status: "Draft",
                isbn: "",
                is_complete: false,
                format_complete: true,
                content_complete: false,
                cover_complete: false,
                pricing_complete: false,
                authors_complete: true,
              },
            ])
            .select();

          if (editionError) {
            console.error("Error creating edition:", editionError);
            throw editionError;
          }

          console.log("Created default edition:", editionData);
        } else {
          console.log("Using existing editions");
        }

        console.log("Default setup completed successfully");
      } catch (error) {
        console.error("Error creating default author and project:", error);
      }
    };

    createDefaultAuthorAndProject();
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          {import.meta.env.VITE_TEMPO && useRoutes(routes)}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/buchmanagement" element={<Buchmanagement />} />
              <Route path="/account" element={<Account />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/authors/:id" element={<AuthorDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/series" element={<Series />} />
              <Route path="/verlagsmarken" element={<Verlagsmarken />} />

              <Route
                path="/test-data-manager"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <TestDataManager />
                  </Suspense>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-screen">
                        <p>Projekt wird geladen...</p>
                      </div>
                    }
                  >
                    <ProjectDetail />
                  </Suspense>
                }
              />
              <Route path="/edition/:id" element={<EditionDetail />} />
              <Route path="/order/:id" element={<OrderDetail />} />
            </Route>
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
