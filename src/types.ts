export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  status: "new" | "contacted" | "in-progress" | "closed";
  timestamp: any;
}

export interface ChatInteraction {
  id?: string;
  question: string;
  answer: string;
  rating: "like" | "dislike" | "none";
  language: "en" | "ar";
  timestamp: any;
  userEmail?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: any;
}
