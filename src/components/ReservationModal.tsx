import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, Users, X } from "lucide-react";

interface ReservationModalProps {
  children: React.ReactNode;
}

const ReservationModal = ({ children }: ReservationModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to Firebase
    try {
      const { push, ref } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");
      
      const reservationData = {
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await push(ref(database, "reservations"), reservationData);

      toast({
        title: "Reservation Confirmed!",
        description: "Thank you for your reservation. We'll call you to confirm the details.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        specialRequests: ""
      });
      setIsSubmitting(false);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-center">
            Reserve Your Table
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Your Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                Preferred Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                Preferred Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleSelectChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-foreground mb-2">
              Number of Guests *
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleSelectChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
              required
            >
              <option value="">Select guests</option>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-foreground mb-2">
              Special Requests (Optional)
            </label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements or dietary restrictions..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Confirming..." : "Confirm Reservation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;