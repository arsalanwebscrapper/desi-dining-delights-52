import { useState, useEffect } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle, 
  Mail, 
  Phone, 
  Calendar, 
  Search,
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const inquiriesRef = ref(database, "inquiries");
    const unsubscribe = onValue(inquiriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const inquiriesList: ContactInquiry[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setInquiries(inquiriesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(inquiry => 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  const handleStatusChange = async (inquiryId: string, newStatus: "read" | "replied") => {
    try {
      await set(ref(database, `inquiries/${inquiryId}/status`), newStatus);
      toast({
        title: "Status updated!",
        description: `Inquiry marked as ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inquiry status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await remove(ref(database, `inquiries/${inquiryId}`));
        toast({
          title: "Inquiry deleted!",
          description: "The inquiry has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete inquiry.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return <Badge className="bg-green-100 text-green-800">Replied</Badge>;
      case "read":
        return <Badge className="bg-blue-100 text-blue-800">Read</Badge>;
      default:
        return <Badge variant="secondary">Unread</Badge>;
    }
  };

  const getUnreadCount = () => {
    return inquiries.filter(inquiry => inquiry.status === "unread").length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Contact Inquiries</h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {getUnreadCount()} Unread
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-foreground">{getUnreadCount()}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">{inquiries.length}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Replied Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {inquiries.filter(i => i.status === "replied" && 
                    new Date(i.createdAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className={inquiry.status === "unread" ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-3">{inquiry.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {inquiry.status === "unread" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(inquiry.id, "read")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {inquiry.status !== "replied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(inquiry.id, "replied")}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(inquiry.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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

export default ContactInquiries;