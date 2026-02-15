export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  detailedDescription: string;
  image?: string;
  tags: string[];
  year: string;
  client: string;
  timeline: string;
  challenges: string;
  solutions: string;
}