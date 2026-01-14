export interface Vendor {
    name: string;
    email: string;
    phone: string;
    status: "not_contacted" | "contacted" | "responded" | "rejected";
    response?: string;
    score?: number;
}

export interface RFP {
  _id: string;
  title: string;
  description: string;
  body: string;
  vendors: Vendor[];
  createdAt: string;
  status: string;
}