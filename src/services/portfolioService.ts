import { PortfolioItem } from '@/types/portfolio';

// Моковые данные портфолио
const mockPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "E-commerce Website",
    category: "Web Development",
    description: "A fully responsive e-commerce website built with React and Node.js",
    detailedDescription: "This project involved creating a complete e-commerce solution with shopping cart functionality, payment processing, and inventory management. The site features a modern, clean design with fast loading times and seamless user experience.",
    image: "/placeholder-image.jpg",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    year: "2024",
    client: "TechCorp Inc.",
    timeline: "3 months",
    challenges: "Implementing secure payment processing and optimizing for mobile devices",
    solutions: "Used Stripe for payments and implemented responsive design principles with Tailwind CSS",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "Mobile Development",
    description: "Secure banking application with biometric authentication",
    detailedDescription: "A comprehensive mobile banking application that allows users to manage their accounts, transfer money, pay bills, and access financial services securely. Features include biometric authentication, real-time notifications, and advanced fraud protection.",
    image: "/placeholder-image.jpg",
    tags: ["React Native", "Firebase", "Biometrics"],
    year: "2024",
    client: "Global Bank Ltd.",
    timeline: "6 months",
    challenges: "Ensuring security compliance and implementing biometric authentication",
    solutions: "Integrated with banking security protocols and used device-native biometric APIs",
  },
  {
    id: 3,
    title: "Brand Identity Design",
    category: "Design",
    description: "Complete brand identity for a tech startup including logo and guidelines",
    detailedDescription: "Created a cohesive brand identity for a new tech startup, including logo design, color palette, typography selection, and comprehensive brand guidelines. The identity reflects the company's innovative approach and commitment to quality.",
    image: "/placeholder-image.jpg",
    tags: ["Branding", "Logo Design", "Illustration"],
    year: "2023",
    client: "InnovateTech",
    timeline: "1 month",
    challenges: "Creating a unique identity in a competitive market",
    solutions: "Conducted market research and developed a distinctive visual language",
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    category: "Web Development",
    description: "Analytics dashboard for managing multiple social media accounts",
    detailedDescription: "A comprehensive dashboard that aggregates analytics from multiple social media platforms into a unified interface. Allows marketers to track performance metrics, schedule posts, and manage multiple accounts from a single location.",
    image: "/placeholder-image.jpg",
    tags: ["Vue.js", "D3.js", "API Integration"],
    year: "2023",
    client: "SocialMediaPro",
    timeline: "4 months",
    challenges: "Integrating with multiple API systems and visualizing complex data",
    solutions: "Developed custom API connectors and used D3.js for data visualization",
  },
  {
    id: 5,
    title: "Health & Fitness App",
    category: "Mobile Development",
    description: "Comprehensive fitness tracking application with workout plans",
    detailedDescription: "A full-featured health and fitness application that tracks workouts, nutrition, and progress. Includes personalized workout plans, meal suggestions, and community features to keep users motivated and engaged.",
    image: "/placeholder-image.jpg",
    tags: ["Flutter", "HealthKit", "Workout Plans"],
    year: "2024",
    client: "FitLife Co.",
    timeline: "5 months",
    challenges: "Integrating with various health APIs and creating engaging UX",
    solutions: "Used Flutter for cross-platform compatibility and integrated HealthKit APIs",
  },
  {
    id: 6,
    title: "Corporate Website Redesign",
    category: "Web Development",
    description: "Modern redesign of corporate website with improved UX",
    detailedDescription: "Complete overhaul of an existing corporate website to improve user experience, accessibility, and conversion rates. The redesign focused on clearer navigation, faster load times, and responsive design for all devices.",
    image: "/placeholder-image.jpg",
    tags: ["Next.js", "Tailwind CSS", "Accessibility"],
    year: "2023",
    client: "Enterprise Solutions",
    timeline: "2 months",
    challenges: "Maintaining SEO rankings during redesign and improving accessibility",
    solutions: "Implemented gradual migration strategy and followed WCAG guidelines",
  },
];

/**
 * Получает все элементы портфолио
 */
export const getAllPortfolioItems = async (): Promise<PortfolioItem[]> => {
  // Имитация асинхронного вызова API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPortfolioItems);
    }, 300); // Имитация задержки сети
  });
};

/**
 * Получает элемент портфолио по ID
 */
export const getPortfolioItemById = async (id: number): Promise<PortfolioItem | undefined> => {
  // Имитация асинхронного вызова API
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = mockPortfolioItems.find(item => item.id === id);
      resolve(item);
    }, 300); // Имитация задержки сети
  });
};