import { useState, useEffect } from "react";
import { ref, push, remove, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { database, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Trash2, ImageIcon, Eye } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  category: string;
  uploadedAt: string;
}

const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState("food");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = [
    "food",
    "restaurant",
    "ambiance",
    "events",
    "staff",
    "other"
  ];

  useEffect(() => {
    const galleryRef = ref(database, "gallery");
    const unsubscribe = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const imagesList: GalleryImage[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setImages(imagesList.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      try {
        const imageRef = storageRef(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        
        const imageData = {
          url: downloadURL,
          name: file.name,
          category: uploadCategory,
          uploadedAt: new Date().toISOString(),
        };

        await push(ref(database, "gallery"), imageData);
        return true;
      } catch (error) {
        console.error("Error uploading file:", error);
        return false;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      toast({
        title: `${successCount} image(s) uploaded successfully!`,
        description: failCount > 0 ? `${failCount} image(s) failed to upload.` : "All images uploaded successfully.",
      });
    }

    if (failCount > 0) {
      toast({
        title: "Some uploads failed",
        description: `${failCount} image(s) failed to upload. Please try again.`,
        variant: "destructive",
      });
    }

    setSelectedFiles(null);
    setIsUploadDialogOpen(false);
    setIsUploading(false);
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        // Delete from storage
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
        
        // Delete from database
        await remove(ref(database, `gallery/${imageId}`));
        
        toast({
          title: "Image deleted!",
          description: "The image has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      food: "default",
      restaurant: "secondary",
      ambiance: "outline",
      events: "destructive",
      staff: "default",
      other: "secondary"
    };

    return <Badge variant={categoryColors[category as keyof typeof categoryColors] as any}>{category}</Badge>;
  };

  const getImagesByCategory = (category: string) => {
    return images.filter(image => image.category === category);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gallery Management</h2>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Images</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Images</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={uploadCategory} 
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFiles || isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold text-foreground">{images.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Food Images</p>
                <p className="text-2xl font-bold text-foreground">{getImagesByCategory("food").length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Restaurant Images</p>
                <p className="text-2xl font-bold text-foreground">{getImagesByCategory("restaurant").length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images Grid */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <Card className="overflow-hidden hover:shadow-golden transition-shadow duration-300">
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(image.url)}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id, image.url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">{image.name}</p>
                      {getCategoryBadge(image.category)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;