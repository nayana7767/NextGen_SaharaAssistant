import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const categories = [
  { value: "family-law", label: "Family Law" },
  { value: "criminal-law", label: "Criminal Law" },
  { value: "civil-law", label: "Civil Law" },
  { value: "labor-law", label: "Labor Law" },
  { value: "property-law", label: "Property Law" },
  { value: "women-rights", label: "Women's Rights" },
  { value: "consumer-law", label: "Consumer Law" },
];

export default function LawyerSelection() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);

  const { data: allLawyers = [] } = trpc.lawyers.getAll.useQuery();
  const { data: categoryLawyers = [] } = trpc.lawyers.getByCategory.useQuery(
    { category: selectedCategory || "" },
    { enabled: !!selectedCategory }
  );

  if (authLoading) {
    return <div className="container max-w-4xl py-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Select a Lawyer</h1>
        <p className="text-muted-foreground mb-6">Please log in to select a lawyer</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  const displayedLawyers = selectedCategory ? categoryLawyers : allLawyers;

  return (
    <div className="container max-w-4xl py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-primary mb-2">Select a Lawyer</h1>
      <p className="text-muted-foreground mb-6">Browse and select a legal professional to assist you</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-20">
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="w-full justify-start"
              >
                All Lawyers
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="w-full justify-start"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Lawyers List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {displayedLawyers.map((lawyer: any) => (
              <Card
                key={lawyer.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedLawyer?.id === lawyer.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedLawyer(lawyer)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{lawyer.name}</h3>
                  <Badge variant="secondary">{lawyer.specialization}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lawyer.bio}</p>
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (lawyer.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({lawyer.rating || 0}/5)</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {lawyer.experience || 0} years experience
                </p>
              </Card>
            ))}
          </div>

          {/* Selected Lawyer Details */}
          {selectedLawyer && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedLawyer.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Specialization</p>
                  <p className="font-medium">{selectedLawyer.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{selectedLawyer.category?.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{selectedLawyer.experience || 0} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (selectedLawyer.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">({selectedLawyer.rating || 0}/5)</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{selectedLawyer.bio}</p>

              <div className="space-y-3 mb-6">
                {selectedLawyer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${selectedLawyer.email}`} className="text-primary hover:underline">
                      {selectedLawyer.email}
                    </a>
                  </div>
                )}
                {selectedLawyer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${selectedLawyer.phone}`} className="text-primary hover:underline">
                      {selectedLawyer.phone}
                    </a>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => setLocation("/complaint")}
              >
                Use This Lawyer for Complaint
              </Button>
            </Card>
          )}

          {displayedLawyers.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No lawyers found in this category</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
