"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { getPortfolioItemById } from "@/services/portfolioService";
import { PortfolioItem } from "@/types/portfolio";

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        setLoading(true);
        const portfolioId = parseInt(id as string);
        const item = await getPortfolioItemById(portfolioId);
        if (item) {
          setSelectedItem(item);
        } else {
          setSelectedItem(null);
        }
      } catch (err) {
        console.error("Error fetching portfolio item:", err);
        setError("Failed to load portfolio item");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-12 px-4 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we load the portfolio item.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-12 px-4 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
            <p className="text-muted-foreground">An error occurred while loading the portfolio item: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-12 px-4 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Portfolio Item Not Found</h1>
            <p className="text-muted-foreground">The requested portfolio item does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container py-12 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => router.push('/portfolio')} 
              className="mb-6"
            >
              ← Back to Portfolio
            </Button>
            
            <h1 className="text-4xl font-bold mb-4">{selectedItem.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span>{selectedItem.category}</span>
              <span>•</span>
              <span>{selectedItem.year}</span>
              <span>•</span>
              <span>{selectedItem.timeline}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedItem.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed w-full h-96" />
            </Card>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-6">{selectedItem.detailedDescription}</p>
                    <p className="mb-6"><strong>Client:</strong> {selectedItem.client}</p>
                    <p><strong>Timeline:</strong> {selectedItem.timeline}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Challenges</h4>
                        <p className="text-muted-foreground">{selectedItem.challenges}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Solutions</h4>
                        <p className="text-muted-foreground">{selectedItem.solutions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          
            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-base py-2 px-4">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}