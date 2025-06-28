export interface LoadingState {
  isLoading: boolean;
  progress: number;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface NavigationState {
  isMenuOpen: boolean;
  scrollY: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  technologies: string[];
  gradient: string;
}