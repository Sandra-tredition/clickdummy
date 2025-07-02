import React from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Check if this is a clean user (new user with minimal data)
  const isCleanUser = user?.email === "clean@example.com";

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section - Different for Clean Users */}
        {isCleanUser ? (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-blue-900">
                  Herzlich willkommen bei deiner Self-Publishing App!
                </h2>
                <p className="text-blue-600 mb-4">
                  Schön, dass du da bist! Wir helfen dir dabei, deine Bücher
                  erfolgreich zu veröffentlichen. Hier sind die ersten Schritte,
                  um zu beginnen:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Buchprojekt anlegen
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Erstelle dein erstes Buchprojekt mit allen wichtigen
                      Details.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Autoren verwalten
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Füge Autoren und weitere Urheber hinzu und verwalte deren
                      Informationen.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Ausgaben erstellen
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Erstelle verschiedene Ausgaben deines Buches (Softcover,
                      Hardcover, E-Book, etc.).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Willkommen zurück!</h2>
            <p className="text-muted-foreground">
              Hier ist eine Übersicht über deine Publishing-Aktivitäten.
            </p>
          </div>
        )}

        {/* Stats Cards - Show different content for clean users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktive Projekte
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isCleanUser ? "0" : "12"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isCleanUser
                  ? "Bereit für dein erstes Projekt"
                  : "+2 seit letztem Monat"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Veröffentlichte Bücher
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isCleanUser ? "0" : "8"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isCleanUser
                  ? "Dein erstes Buch wartet auf dich"
                  : "+1 seit letztem Monat"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Registrierte Autoren
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isCleanUser ? "0" : "24"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isCleanUser
                  ? "Füge deinen ersten Autor hinzu"
                  : "+3 seit letztem Monat"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monatsumsatz
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isCleanUser ? "€0" : "€2,847"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isCleanUser
                  ? "Dein Erfolg beginnt hier"
                  : "+12% seit letztem Monat"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isCleanUser ? "Erste Schritte" : "Letzte Aktivitäten"}
              </CardTitle>
              <CardDescription>
                {isCleanUser
                  ? "So startest du mit deinem ersten Buchprojekt"
                  : "Deine neuesten Projektaktivitäten"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCleanUser ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        Registrierung abgeschlossen ✓
                      </p>
                      <p className="text-xs text-blue-600">
                        Herzlichen Glückwunsch! Du bist bereit zu starten.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Erstes Buchprojekt anlegen
                      </p>
                      <p className="text-xs text-gray-600">
                        Klicke auf &quot;Neues Buchprojekt&quot; um zu beginnen.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Autoren und Inhalte hinzufügen
                      </p>
                      <p className="text-xs text-gray-600">
                        Vervollständige dein Buchprojekt mit allen Details.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Neues Projekt erstellt
                      </p>
                      <p className="text-xs text-muted-foreground">
                        vor 2 Stunden
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Buch veröffentlicht</p>
                      <p className="text-xs text-muted-foreground">vor 1 Tag</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Urheber hinzugefügt</p>
                      <p className="text-xs text-muted-foreground">
                        vor 3 Tagen
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isCleanUser ? "Jetzt starten" : "Schnellzugriff"}
              </CardTitle>
              <CardDescription>
                {isCleanUser
                  ? "Beginne mit deinem ersten Buchprojekt"
                  : "Häufig verwendete Funktionen"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {isCleanUser
                          ? "🚀 Erstes Buchprojekt erstellen"
                          : "Neues Buchprojekt"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isCleanUser
                          ? "Der perfekte Start in deine Publishing-Reise"
                          : "Starte ein neues Projekt"}
                      </div>
                    </div>
                    {isCleanUser && (
                      <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="font-medium">
                    {isCleanUser
                      ? "👤 Ersten Autor hinzufügen"
                      : "Autor hinzufügen"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isCleanUser
                      ? "Füge dich selbst oder andere Urheber hinzu"
                      : "Neuen Urherber registrieren"}
                  </div>
                </button>
                {!isCleanUser && (
                  <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="font-medium">Verkaufsberichte</div>
                    <div className="text-sm text-muted-foreground">
                      Aktuelle Verkaufszahlen einsehen
                    </div>
                  </button>
                )}
                {isCleanUser && (
                  <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="font-medium">📚 Hilfe & Tutorials</div>
                    <div className="text-sm text-muted-foreground">
                      Lernen Sie, wie Sie erfolgreich publizieren
                    </div>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
