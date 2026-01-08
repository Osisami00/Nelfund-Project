import { v4 as uuidv4 } from 'uuid';

// Country codes for phone validation
export const COUNTRY_CODES = [
  { code: '234', name: 'Nigeria (+234)', flag: '🇳🇬' },
  { code: '233', name: 'Ghana (+233)', flag: '🇬🇭' },
  { code: '254', name: 'Kenya (+254)', flag: '🇰🇪' },
  { code: '255', name: 'Tanzania (+255)', flag: '🇹🇿' },
  { code: '256', name: 'Uganda (+256)', flag: '🇺🇬' },
  { code: '27', name: 'South Africa (+27)', flag: '🇿🇦' },
  { code: '1', name: 'USA/Canada (+1)', flag: '🇺🇸' },
  { code: '44', name: 'UK (+44)', flag: '🇬🇧' },
  { code: '91', name: 'India (+91)', flag: '🇮🇳' },
  { code: '86', name: 'China (+86)', flag: '🇨🇳' },
  { code: '33', name: 'France (+33)', flag: '🇫🇷' },
  { code: '49', name: 'Germany (+49)', flag: '🇩🇪' },
  { code: '234', name: 'Nigeria (+234)', flag: '🇳🇬' }, // Default first
];

// Validate phone number based on country code
export const validatePhoneNumber = (phone, countryCode) => {
  if (!phone || !countryCode) return false;
  
  const phoneStr = phone.toString().replace(/\D/g, '');
  
  // Remove country code from validation if it's included
  let phoneWithoutCode = phoneStr;
  if (phoneStr.startsWith(countryCode)) {
    phoneWithoutCode = phoneStr.substring(countryCode.length);
  }
  
  // Minimum length validation (without country code)
  if (phoneWithoutCode.length < 7) return false;
  
  // Maximum length validation
  if (phoneWithoutCode.length > 15) return false;
  
  // Check if it contains only digits
  return /^\d+$/.test(phoneWithoutCode);
};

// Format phone number for display
export const formatPhoneNumber = (phone, countryCode) => {
  if (!phone || !countryCode) return '';
  
  const phoneStr = phone.toString().replace(/\D/g, '');
  let formatted = phoneStr;
  
  // Remove leading zeros
  if (formatted.startsWith('0')) {
    formatted = formatted.substring(1);
  }
  
  // Ensure country code is included
  if (!formatted.startsWith(countryCode)) {
    formatted = countryCode + formatted;
  }
  
  return formatted;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('nelfi_user');
  return user !== null;
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('nelfi_user');
  return user ? JSON.parse(user) : null;
};

// Register new user with phone number
export const registerUser = (phone, countryCode, fullName) => {
  const users = JSON.parse(localStorage.getItem('nelfi_users') || '[]');
  
  const formattedPhone = formatPhoneNumber(phone, countryCode);
  
  // Check if user already exists
  const existingUser = users.find(user => user.phone === formattedPhone);
  
  if (existingUser) {
    return { success: false, message: 'Phone number already registered. Please login instead.' };
  }
  
  const newUser = {
    id: uuidv4(),
    phone: formattedPhone,
    countryCode,
    fullName,
    createdAt: new Date().toISOString(),
    sessionId: uuidv4(),
    isGuest: false
  };
  
  users.push(newUser);
  localStorage.setItem('nelfi_users', JSON.stringify(users));
  localStorage.setItem('nelfi_user', JSON.stringify(newUser));
  
  return { success: true, user: newUser };
};

// Login user with phone number
export const loginUser = (phone, countryCode) => {
  const users = JSON.parse(localStorage.getItem('nelfi_users') || '[]');
  
  const formattedPhone = formatPhoneNumber(phone, countryCode);
  
  const user = users.find(user => user.phone === formattedPhone);
  
  if (!user) {
    return { success: false, message: 'Phone number not found. Please register first.' };
  }
  
  // Update session
  user.sessionId = uuidv4();
  localStorage.setItem('nelfi_user', JSON.stringify(user));
  
  return { success: true, user };
};

// Guest login (no registration required)
export const guestLogin = () => {
  const guestUser = {
    id: uuidv4(),
    phone: null,
    countryCode: null,
    fullName: 'Guest',
    createdAt: new Date().toISOString(),
    sessionId: uuidv4(),
    isGuest: true
  };
  
  localStorage.setItem('nelfi_user', JSON.stringify(guestUser));
  
  return { success: true, user: guestUser };
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('nelfi_user');
};

// Save chat message
export const saveChatMessage = (message, sender, citations = []) => {
  const user = getCurrentUser();
  if (!user) return null;
  
  const chats = JSON.parse(localStorage.getItem('nelfi_chats') || '{}');
  const userChats = chats[user.id] || [];
  
  const newMessage = {
    id: uuidv4(),
    text: message,
    sender,
    citations,
    timestamp: new Date().toISOString()
  };
  
  userChats.push(newMessage);
  chats[user.id] = userChats;
  localStorage.setItem('nelfi_chats', JSON.stringify(chats));
  
  return newMessage;
};

// Get user chat history
export const getUserChatHistory = () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const chats = JSON.parse(localStorage.getItem('nelfi_chats') || '{}');
  return chats[user.id] || [];
};

// Clear user chat history
export const clearUserChatHistory = () => {
  const user = getCurrentUser();
  if (!user) return;
  
  const chats = JSON.parse(localStorage.getItem('nelfi_chats') || '{}');
  delete chats[user.id];
  localStorage.setItem('nelfi_chats', JSON.stringify(chats));
};