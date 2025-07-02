import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Receipt, Download } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on ID
  const mockOrders = [
    {
      id: "ORD-001",
      date: "15.10.2023",
      status: "Delivered",
      total: "129,99 €",
      billingAddress: {
        name: "John Doe",
        street: "Musterstraße 123",
        city: "Berlin",
        zip: "10115",
        country: "Deutschland",
      },
      shippingAddress: {
        name: "John Doe",
        street: "Beispielweg 456",
        city: "Hamburg",
        zip: "20095",
        country: "Deutschland",
      },
      items: [
        {
          title: "Die Kunst des Schreibens",
          author: "Max Mustermann",
          quantity: 1,
          price: "24,99 €",
          trackingNumber: "DHL123456789",
          carrier: "DHL",
          trackingUrl:
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?lang=de&idc=123456789",
        },
        {
          title: "Moderne Literatur",
          author: "Anna Schmidt",
          quantity: 2,
          price: "52,50 €",
          trackingNumber: "DPD987654321",
          carrier: "DPD",
          trackingUrl: "https://tracking.dpd.de/status/de_DE/parcel/987654321",
        },
      ],
      itemCount: 3,
    },
    {
      id: "ORD-002",
      date: "02.11.2023",
      status: "Processing",
      total: "79,50 €",
      billingAddress: {
        name: "John Doe",
        street: "Musterstraße 123",
        city: "Berlin",
        zip: "10115",
        country: "Deutschland",
      },
      shippingAddress: {
        name: "John Doe",
        street: "Musterstraße 123",
        city: "Berlin",
        zip: "10115",
        country: "Deutschland",
      },
      items: [
        {
          title: "Digitale Transformation",
          author: "Peter Weber",
          quantity: 1,
          price: "39,99 €",
          trackingNumber: null,
          carrier: null,
          trackingUrl: null,
        },
        {
          title: "Zukunft der Arbeit",
          author: "Lisa Müller",
          quantity: 1,
          price: "39,51 €",
          trackingNumber: null,
          carrier: null,
          trackingUrl: null,
        },
      ],
      itemCount: 2,
    },
    {
      id: "ORD-003",
      date: "10.11.2023",
      status: "Shipped",
      total: "199,99 €",
      billingAddress: {
        name: "John Doe",
        street: "Musterstraße 123",
        city: "Berlin",
        zip: "10115",
        country: "Deutschland",
      },
      shippingAddress: {
        name: "Jane Doe",
        street: "Geschenkstraße 789",
        city: "München",
        zip: "80331",
        country: "Deutschland",
      },
      items: [
        {
          title: "Philosophie des 21. Jahrhunderts",
          author: "Dr. Thomas Klein",
          quantity: 1,
          price: "199,99 €",
          trackingNumber: "UPS456789123",
          carrier: "UPS",
          trackingUrl: "https://www.ups.com/track?loc=de_DE&tracknum=456789123",
        },
      ],
      itemCount: 1,
    },
  ];

  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <Layout
        title="Bestellung nicht gefunden"
        breadcrumbs={
          <>
            <button
              onClick={() => navigate("/account")}
              className="text-blue-600 hover:text-blue-800"
            >
              Kontoeinstellungen
            </button>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-600">Bestellung nicht gefunden</span>
          </>
        }
      >
        <div className="max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                Bestellung nicht gefunden
              </h2>
              <p className="text-gray-600 mb-6">
                Die angeforderte Bestellung konnte nicht gefunden werden.
              </p>
              <Button onClick={() => navigate("/account")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zu den Kontoeinstellungen
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Delivered":
        return "Zugestellt";
      case "Shipped":
        return "Versandt";
      case "Processing":
        return "In Bearbeitung";
      case "Cancelled":
        return "Storniert";
      default:
        return status;
    }
  };

  return (
    <Layout
      title={`Bestellung ${order.id}`}
      breadcrumbs={
        <>
          <button
            onClick={() => navigate("/account")}
            className="text-blue-600 hover:text-blue-800"
          >
            Kontoeinstellungen
          </button>
          <span className="text-gray-400 mx-2">/</span>
          <button
            onClick={() => navigate("/account?tab=orders")}
            className="text-blue-600 hover:text-blue-800"
          >
            Bestellungen
          </button>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">{order.id}</span>
        </>
      }
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/account?tab=orders")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zu den Bestellungen
        </Button>

        {/* Tracking Summary - Prominently at the top */}
        {order.items.some((item: any) => item.trackingNumber) && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <MapPin size={20} className="text-green-600" />
                Sendungsverfolgung
              </CardTitle>
              <p className="text-green-700 text-sm">
                Hier findest du alle Tracking-Informationen für deine Bestellung
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items
                  .filter((item: any) => item.trackingNumber)
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200"
                    >
                      <div>
                        <p className="font-medium text-green-900">
                          {item.carrier}
                        </p>
                        <p className="text-green-700 text-sm">
                          Tracking-Nummer: {item.trackingNumber}
                        </p>
                      </div>
                      <Button
                        onClick={() => window.open(item.trackingUrl, "_blank")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Sendung verfolgen
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Bestellung {order.id}
                </CardTitle>
                <p className="text-gray-600 mt-1">Bestellt am {order.date}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(order.status)} mb-2`}
                >
                  {getStatusLabel(order.status)}
                </Badge>
                <p className="text-2xl font-bold">{order.total}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {order.itemCount}{" "}
                {order.itemCount === 1 ? "Artikel" : "Artikel"}
              </span>
              <span>•</span>
              <span>Gesamt: {order.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt size={20} className="text-blue-600" />
                Rechnungsadresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.billingAddress.name}</p>
                <p className="text-gray-600">{order.billingAddress.street}</p>
                <p className="text-gray-600">
                  {order.billingAddress.zip} {order.billingAddress.city}
                </p>
                <p className="text-gray-600">{order.billingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} className="text-green-600" />
                Lieferadresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress.street === order.billingAddress.street &&
              order.shippingAddress.city === order.billingAddress.city &&
              order.shippingAddress.zip === order.billingAddress.zip &&
              order.shippingAddress.name === order.billingAddress.name ? (
                <p className="text-gray-600">Identisch mit Rechnungsadresse</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.zip} {order.shippingAddress.city}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Bestellte Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{item.title}</h4>
                    <p className="text-gray-600">von {item.author}</p>
                    <p className="text-gray-600 mt-1">
                      Anzahl: {item.quantity} × {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button variant="outline">
                <Receipt size={16} className="mr-2" />
                Rechnung herunterladen
              </Button>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Bestellbestätigung
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderDetail;
