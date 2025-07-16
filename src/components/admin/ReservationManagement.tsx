import { useState, useEffect } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter
} from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const reservationsRef = ref(database, "reservations");
    const unsubscribe = onValue(reservationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reservationsList: Reservation[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setReservations(reservationsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation => 
        reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(reservation => reservation.date === dateFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  const handleStatusChange = async (reservationId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      await set(ref(database, `reservations/${reservationId}/status`), newStatus);
      toast({
        title: "Status updated!",
        description: `Reservation has been ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await remove(ref(database, `reservations/${reservationId}`));
        toast({
          title: "Reservation deleted!",
          description: "The reservation has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete reservation.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getTodaysReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations.filter(r => r.date === today && r.status !== "cancelled");
  };

  const getUpcomingReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations.filter(r => r.date > today && r.status !== "cancelled");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Reservation Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Reservations</p>
                <p className="text-2xl font-bold text-foreground">{getTodaysReservations().length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Reservations</p>
                <p className="text-2xl font-bold text-foreground">{getUpcomingReservations().length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reservations</p>
                <p className="text-2xl font-bold text-foreground">{reservations.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Special Request</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{reservation.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{reservation.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{reservation.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{reservation.time}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{reservation.guests}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{reservation.specialRequest || "None"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {reservation.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, "confirmed")}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, "cancelled")}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationManagement;