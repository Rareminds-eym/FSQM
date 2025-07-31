export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface FormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  phone: string;
  teamName: string;
  collegeCode: string;
  isTeamLeader: null | boolean;
  joinCode: string;
}
