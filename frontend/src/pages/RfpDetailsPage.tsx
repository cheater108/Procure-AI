import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Plus, Mail, Phone, User, Loader2, Send } from "lucide-react";
import { ProcurementStepper } from "@/components/ProcurementStepper";
import type { RFP, Vendor} from "@/types/types";



export default function RfpDetailsPage() {
  const { id } = useParams();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", email: "", phone: "" });
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRfp = async () => {
      try {
        const response = await api.get("/rfps");
        console.log(response.data);
        const found = response.data.rfps.find((item: RFP) => item._id === id);
        if (found) {
          setRfp(found);
          setVendors(found.vendors);
        } 
      } catch (error) {
        console.error("Failed to fetch RFP details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRfp();
    setIsLoading(false);
  }, [id]);

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfp) return;

    try {
      const vendor: Vendor = {
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        status: "not_contacted",
      };

      const originalVendors = rfp.vendors || [];
      const updatedVendors = [...originalVendors, vendor];

      const response = await api.patch(`/rfps/${id}`, {
        vendors: updatedVendors
      });

      if (response.data) {
        setRfp(response.data);
        setVendors(response.data.vendors);
        setNewVendor({ name: "", email: "", phone: "" });
        setIsAddingVendor(false);
      }
    } catch (error) {
      console.error("Failed to add vendor:", error);
      alert("Failed to add vendor. Please try again.");
    }
  };

  const handleSendEmail = (vendorEmail: string) => {
    setSendingEmailId(vendorEmail);
    // Simulate email flow
    setTimeout(() => {
      setSendingEmailId(null);
      alert("Email sequence started for " + vendorEmail);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rfp) return <div className="p-8 text-center">RFP not found</div>;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-6">
        <Link to="/rfps" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to RFPs
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{rfp.title}</h1>
            <Badge className="capitalize">{rfp.status}</Badge>
          </div>
          <p className="text-muted-foreground">{rfp.description}</p>
        </div>
        
        <Dialog open={isAddingVendor} onOpenChange={setIsAddingVendor}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Enter the details of the vendor you want to include in this RFP.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVendor} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Vendor Name</Label>
                <Input 
                  id="name" 
                  placeholder="Acme Corp" 
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contact@example.com" 
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 234 567 890" 
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Vendor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ProcurementStepper currentStep={2} />

      <Card>
        <CardHeader>
          <CardTitle>Whitelisted Vendors</CardTitle>
          <CardDescription>
            Select vendors to initiate communication or evaluate proposals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.length > 0 ? vendors.map((vendor) => (
                <TableRow key={vendor.email}>
                  <TableCell className="font-medium align-middle">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {vendor.name}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {vendor.email}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {vendor.phone}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <Badge variant={
                      vendor.status === "responded" ? "default" : 
                      vendor.status === "contacted" ? "secondary" : 
                      "outline"
                    } className="capitalize">
                      {vendor.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendEmail(vendor.email)}
                      disabled={sendingEmailId === vendor.email}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {sendingEmailId === vendor.email ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No vendors added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
