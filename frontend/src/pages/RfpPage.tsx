import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { RFP } from "@/types/types";


export default function RfpPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRfps = async () => {
      try {
        const response = await api.get("/rfps");
        console.log(response.data.rfps);
        setRfps(response.data.rfps);
      } catch (error) {
        console.error("Failed to fetch RFPs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRfps();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Requests for Proposal</h1>
          <p className="text-muted-foreground">
            Manage and track all your procurement requests
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : rfps.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No RFPs found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created any requests for proposal yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rfps.map((rfp) => (
            <Link key={rfp._id} to={`/rfps/${rfp._id}`}>
              <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="capitalize">
                      {rfp.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(rfp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                    {rfp.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {rfp.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm font-medium text-primary mt-4 group-hover:gap-1 transition-all">
                    View Details <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
