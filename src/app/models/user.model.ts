export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  jmbg: string;
  role_id: number;
  profile_picture?: string | null;
  last_login?: string;  
  created_at?: string; 
   password?: string;
}
