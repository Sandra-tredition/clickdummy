import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  itemCount: number;
}

interface OrdersManagementProps {
  orders?: Order[];
}

const OrdersManagement: React.FC<OrdersManagementProps> = ({ orders = [] }) => {
  const navigate = useNavigate();

  // Check if current user is the clean user (no mock data)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isCleanUser = currentUser?.email === "clean@example.com";

  const mockOrders: Order[] = isCleanUser
    ? []
    : [
        {
          id: "ORD-001",
          date: "15.10.2023",
          status: "Delivered",
          total: "129,99 €",
          itemCount: 3,
        },
        {
          id: "ORD-002",
          date: "02.11.2023",
          status: "Processing",
          total: "79,50 €",
          itemCount: 2,
        },
        {
          id: "ORD-003",
          date: "10.11.2023",
          status: "Shipped",
          total: "199,99 €",
          itemCount: 1,
        },
      ];

  const allOrders = isCleanUser ? [] : orders.length > 0 ? orders : mockOrders;

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
    <div className="bg-white">
      <Card>
        <CardHeader>
          <CardTitle>Bestellverlauf</CardTitle>
          <CardDescription>
            Hier findest du alle deine Bestellungen und kannst Details sowie
            Tracking-Informationen einsehen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Keine Bestellungen vorhanden</p>
              {isCleanUser && (
                <p className="text-sm mb-6">
                  Sobald du dein erstes Buch veröffentlichst und Verkäufe
                  erzielst, werden deine Bestellungen hier angezeigt.
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Bestellnummer</TableHead>
                  <TableHead className="w-1/6">Datum</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-1/6">Artikel</TableHead>
                  <TableHead className="w-1/6">Gesamt</TableHead>
                  <TableHead className="w-1/6">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(order.status)} rounded-full`}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "Artikel" : "Artikel"}
                    </TableCell>
                    <TableCell className="font-medium">{order.total}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/order/${order.id}`)}
                        >
                          <ShoppingBag size={16} className="mr-2" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Receipt size={16} className="mr-2" />
                          Rechnung
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;
