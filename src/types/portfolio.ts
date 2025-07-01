export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
  github?: string;
  images?: string[];
  fullDescription?: string;
  status: {
    type: 'completed' | 'progress';
    value?: number;
  };
}

export interface PortfolioProps {
  isDarkMode: boolean;
  onContactClick: () => void;
  onProjectClick: (project: ProjectItem) => void;
}