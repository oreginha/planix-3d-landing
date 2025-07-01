// Tipos para el formulario de contacto
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
}

// Tipos para el chat
export interface ChatMessage {
  id: string;
  userName: string;
  userEmail?: string;
  message: string;
  timestamp: Date;
  isFirstMessage?: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos para configuración de email
export interface EmailConfig {
  to: string;
  from: {
    name: string;
    email: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  testMode: boolean;
  testEmail?: string;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
