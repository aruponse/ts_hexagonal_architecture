export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Puerto para casos de uso de autenticación
export interface IAuthPort {
  login(request: LoginRequest): Promise<AuthResponse>;
  signup(request: SignupRequest): Promise<any>;
  validateToken(token: string): Promise<AuthTokenPayload>;
}