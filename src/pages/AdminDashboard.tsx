import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, 
  Users, 
  MessageCircle, 
  ChefHat, 
  ShoppingCart,
  ImageIcon,
  BarChart3,
  Settings
} from "lucide-react";
import MenuManagement from "@/components/admin/MenuManagement";
import ReservationManagement from "@/components/admin/ReservationManagement";
import ContactInquiries from "@/components/admin/ContactInquiries";
import OrderManagement from "@/components/admin/OrderManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState([
    { label: "Total Reservations", value: "0", icon: Users, color: "text-blue-600" },
    { label: "Menu Items", value: "0", icon: ChefHat, color: "text-green-600" },
    { label: "New Messages", value: "0", icon: MessageCircle, color: "text-purple-600" },
    { label: "Orders Today", value: "0", icon: ShoppingCart, color: "text-orange-600" },
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch real data - simplified approach for now
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For now, show actual counts based on what exists
        // This can be expanded when Firestore collections are properly set up
        setStats([
          { label: "Total Reservations", value: "0", icon: Users, color: "text-blue-600" },
          { label: "Menu Items", value: "6", icon: ChefHat, color: "text-green-600" }, // Based on MenuPreview items
          { label: "New Messages", value: "0", icon: MessageCircle, color: "text-purple-600" },
          { label: "Orders Today", value: "0", icon: ShoppingCart, color: "text-orange-600" },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been signed out from the admin dashboard.",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-soft hover:shadow-golden transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("menu")}
                  >
                    <ChefHat className="w-6 h-6" />
                    <span>Manage Menu</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("reservations")}
                  >
                    <Users className="w-6 h-6" />
                    <span>View Reservations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>Check Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="messages">
            <ContactInquiries />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;