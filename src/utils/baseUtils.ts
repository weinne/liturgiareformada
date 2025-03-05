
// Generate a unique ID for liturgies
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date to a readable format
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Get a liturgy from localStorage by ID
export const getLiturgyById = (liturgyId: string) => {
  const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
  return savedLiturgies[liturgyId] || null;
};
