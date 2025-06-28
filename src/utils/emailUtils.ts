// Utilidades para validación de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const extractEmailFromMessage = (message: string): string | null => {
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const match = message.match(emailRegex);
  return match ? match[0] : null;
};