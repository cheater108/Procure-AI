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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { RFP, Vendor} from "@/types/types";


export default function RfpDetailsPage() {
  const { id } = useParams();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", email: "", phone: "" });
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  useEffect(() => {
    const fetchRfp = async () => {
      try {
        const response = await api.get("/rfps");
        console.log(response.data);
        const found = response.data.rfps.find((item: RFP) => item._id === id);
        if (found) {
          setRfp(found);
          setVendors(found.vendors);
          setEmailBody(found.body || "");
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
      const response = await api.post(`/rfps/${id}/vendors`, {
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
      });

      if (response.data) {
        setVendors([...vendors, response.data]);
        setNewVendor({ name: "", email: "", phone: "" });
        setIsAddingVendor(false);
      }
    } catch (error) {
      console.error("Failed to add vendor:", error);
      alert("Failed to add vendor. Please try again.");
    }
  };

  const handleBulkSendEmails = async () => {
    if (selectedVendorIds.length === 0) return;
    setIsSendingBulk(true);
    try {
      await api.post(`/email/send/${id}`, {
        vendorIds: selectedVendorIds,
        body: emailBody,
        subject: rfp?.title
      });
      // Refresh vendors to see status change
      const response = await api.get("/rfps");
      const found = response.data.rfps.find((item: RFP) => item._id === id);
      if (found) {
        setVendors(found.vendors);
      }
      setSelectedVendorIds([]);
      setIsEmailDialogOpen(false);
      alert("Emails sent successfully to selected vendors!");
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      alert("Failed to send emails. Please try again.");
    } finally {
      setIsSendingBulk(false);
    }
  };

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendorIds(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedVendorIds.length === vendors.length) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(vendors.map(v => v._id));
    }
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
        
        <div className="flex gap-2">
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="shrink-0" 
                disabled={selectedVendorIds.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email ({selectedVendorIds.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Preview & Edit Email</DialogTitle>
                <DialogDescription>
                  This email will be sent to {selectedVendorIds.length} selected vendors.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="emailSubject">Generated Content</Label>
                  <Textarea 
                    id="emailBody" 
                    className="max-h-[300px]" 
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleBulkSendEmails} disabled={isSendingBulk}>
                  {isSendingBulk ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={vendors.length > 0 && selectedVendorIds.length === vendors.length}
                    onChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {vendors.length > 0 ? vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="align-middle">
                    <Checkbox 
                      checked={selectedVendorIds.includes(vendor._id)}
                      onChange={() => toggleVendorSelection(vendor._id)}
                      disabled={vendor.status === "contacted"}
                    />
                  </TableCell>
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
                    <Badge>
                      {vendor.status === 'responded' ? vendor.score : 'awaiting response'}
                    </Badge>
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
