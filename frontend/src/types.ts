export interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  userType: 'Client' | 'Freelancer';
  onboardingComplete: boolean;
  artipoints: number;
  phone?: string;
  dob?: string;
  location?: string;
  clientType?: 'digital' | 'artisan';
  freelancerType?: 'digital' | 'artisan';
}

export interface Service {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  createdAt: string;
}

export interface Application {
    id: string;
    userId: string;
    projectId: string;
    proposal: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}
