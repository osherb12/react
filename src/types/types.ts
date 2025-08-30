import { Timestamp } from "firebase/firestore";

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  buildingNumber?: string;
}

export interface Contact {
  phone: string;
  email: string;
  website: string;
}

export interface Business {
  id?: string; // ID is optional for creation
  name: string;
  description: string;
  mainCategoryId: string;
  subCategoryId?: string;
  mainCategoryName?: string; // For display purposes
  subCategoryName?: string; // For display purposes
  address: Address;
  contact: Contact;
  ownerId: string;
  ownerName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: string;
  images: string[];
  hoursOfOperation: { [key: string]: string }; // e.g., { "monday": "9am-5pm" }
  yearsOfExperience: string;
  profileImageUrl?: string; // New field for the main profile image
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  disabled: boolean;
  metadata?: {
    creationTime: string;
    lastSignInTime: string;
  };
  providerData?: { providerId: string; uid: string; displayName: string | null; email: string | null; phoneNumber: string | null; photoURL: string | null; }[];
  role?: 'user' | 'business_owner' | 'admin'; // Updated roles
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Category {
  id: string;
  name: string;
}

export interface Review {
  id?: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface IsraelCity {
  שם_ישוב: string; // City name in Hebrew
  סמל_ישוב: string; // City code
}

export interface IsraelStreet {
  שם_רחוב: string; // Street name in Hebrew
  סמל_רחוב: string; // Street code
}

export interface Category {
  id: string;
  name: string;
  subcategories?: SubCategory[];
}