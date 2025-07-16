import { useState, useEffect } from "react";
import { ref, push, set, remove, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Upload, Save, X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Starters",
    "Mains",
    "Biryani",
    "Breads",
    "Desserts",
    "Beverages"
  ];

  useEffect(() => {
    const menuRef = ref(database, "menu");
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items: MenuItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMenuItems(items);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    const imageRef = storageRef(storage, `menu/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = editingItem?.image || "";
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const menuData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
      };

      if (editingItem) {
        await set(ref(database, `menu/${editingItem.id}`), menuData);
        toast({
          title: "Menu item updated!",
          description: "The menu item has been successfully updated.",
        });
      } else {
        await push(ref(database, "menu"), menuData);
        toast({
          title: "Menu item added!",
          description: "New menu item has been successfully added.",
        });
      }

      resetForm();
      setIsAddDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await remove(ref(database, `menu/${id}`));
        toast({
          title: "Menu item deleted!",
          description: "The menu item has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete menu item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: true,
      isAvailable: true,
    });
    setImageFile(null);
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Menu Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter dish name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter dish description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVeg: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Available</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="shadow-soft hover:shadow-golden transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">₹{item.price}</span>
                <div className="flex space-x-2">
                  <Badge variant={item.isVeg ? "default" : "secondary"}>
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </Badge>
                  <Badge variant={item.isAvailable ? "default" : "destructive"}>
                    {item.isAvailable ? "Available" : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;