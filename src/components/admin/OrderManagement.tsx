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
  ShoppingCart, 
  Phone, 
  MapPin, 
  Calendar, 
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Package,
  Truck
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  orderType: "delivery" | "pickup";
  createdAt: string;
  deliveryTime?: string;
  specialInstructions?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const ordersRef = ref(database, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList: Order[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setOrders(ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await set(ref(database, `orders/${orderId}/status`), newStatus);
      toast({
        title: "Status updated!",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await remove(ref(database, `orders/${orderId}`));
        toast({
          title: "Order deleted!",
          description: "The order has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      preparing: { variant: "default", label: "Preparing" },
      ready: { variant: "default", label: "Ready" },
      delivered: { variant: "default", label: "Delivered" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getTodaysOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => order.createdAt.startsWith(today) && order.status !== "cancelled");
  };

  const getPendingOrders = () => {
    return orders.filter(order => order.status === "pending");
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === "delivered")
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Order Management</h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {getPendingOrders().length} Pending
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <p className="text-2xl font-bold text-foreground">{getTodaysOrders().length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-foreground">{getPendingOrders().length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{getTotalRevenue().toLocaleString()}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search by customer name, phone, or order ID..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{order.customerName}</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{order.customerPhone}</span>
                        </div>
                        {order.orderType === "delivery" && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{order.address}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Badge variant={order.orderType === "delivery" ? "default" : "secondary"}>
                        {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(order.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "confirmed")}
                            className="text-green-600 hover:text-green-700"
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "preparing")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Prepare
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "ready")}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "delivered")}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Delivered
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
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

export default OrderManagement;