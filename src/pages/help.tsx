import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import Layout from "@/components/Layout";

const Help = () => {
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("normal");

  // Mock existing tickets
  const mockTickets = [
    {
      id: "TICK-001",
      subject: "Problem beim Upload der PDF-Datei",
      category: "Technische Probleme",
      status: "In Bearbeitung",
      priority: "Hoch",
      created: "2023-11-15",
      lastUpdate: "2023-11-16",
    },
    {
      id: "TICK-002",
      subject: "Frage zur Provisionsabrechnung",
      category: "Abrechnung",
      status: "Geschlossen",
      priority: "Normal",
      created: "2023-11-10",
      lastUpdate: "2023-11-12",
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the ticket to your backend
    console.log("Creating ticket:", {
      subject: ticketSubject,
      category: ticketCategory,
      description: ticketDescription,
      priority: ticketPriority,
    });

    // Reset form
    setTicketSubject("");
    setTicketCategory("");
    setTicketDescription("");
    setTicketPriority("normal");
    setIsCreatingTicket(false);

    // Show success message (in a real app, you'd use a toast)
    alert("Support-Ticket wurde erfolgreich erstellt!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Bearbeitung":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            {status}
          </Badge>
        );
      case "Geschlossen":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            {status}
          </Badge>
        );
      case "Offen":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Hoch":
        return (
          <Badge variant="destructive" className="text-xs">
            {priority}
          </Badge>
        );
      case "Normal":
        return (
          <Badge variant="secondary" className="text-xs">
            {priority}
          </Badge>
        );
      case "Niedrig":
        return (
          <Badge variant="outline" className="text-xs">
            {priority}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <Layout title="Hilfe & Support">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Neues Ticket erstellen</h3>
              <p className="text-sm text-muted-foreground">
                Erstellen Sie ein Support-Ticket für Ihr Anliegen
              </p>
              <Button
                className="mt-3 w-full"
                onClick={() => setIsCreatingTicket(true)}
              >
                Ticket erstellen
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Dokumentation</h3>
              <p className="text-sm text-muted-foreground">
                Durchsuchen Sie unsere Hilfe-Artikel
              </p>
              <Button variant="outline" className="mt-3 w-full">
                Zur Dokumentation
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Live-Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chatten Sie direkt mit unserem Support-Team
              </p>
              <Button variant="outline" className="mt-3 w-full">
                Chat starten
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Create Ticket Form */}
        {isCreatingTicket && (
          <Card>
            <CardHeader>
              <CardTitle>Neues Support-Ticket erstellen</CardTitle>
              <CardDescription>
                Beschreiben Sie Ihr Anliegen so detailliert wie möglich
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Betreff *</Label>
                    <Input
                      id="subject"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Kurze Beschreibung Ihres Problems"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie *</Label>
                    <Select
                      value={ticketCategory}
                      onValueChange={setTicketCategory}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">
                          Technische Probleme
                        </SelectItem>
                        <SelectItem value="billing">Abrechnung</SelectItem>
                        <SelectItem value="publishing">
                          Veröffentlichung
                        </SelectItem>
                        <SelectItem value="account">
                          Konto & Einstellungen
                        </SelectItem>
                        <SelectItem value="general">
                          Allgemeine Fragen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorität</Label>
                  <Select
                    value={ticketPriority}
                    onValueChange={setTicketPriority}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                      <SelectItem value="urgent">Dringend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung *</Label>
                  <Textarea
                    id="description"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage ausführlich..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Ticket erstellen</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingTicket(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Ihre Support-Tickets</CardTitle>
            <CardDescription>
              Übersicht über Ihre aktuellen und vergangenen Support-Anfragen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockTickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Sie haben noch keine Support-Tickets erstellt
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{ticket.subject}</h3>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.category} • Ticket #{ticket.id}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Erstellt: {ticket.created}</span>
                          <span>
                            Letzte Aktualisierung: {ticket.lastUpdate}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Details ansehen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Weitere Kontaktmöglichkeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">E-Mail Support</p>
                  <p className="text-sm text-muted-foreground">
                    support@bookpublish.de
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telefon Support</p>
                  <p className="text-sm text-muted-foreground">
                    +49 (0) 123 456 789
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mo-Fr 9:00-17:00 Uhr
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;
