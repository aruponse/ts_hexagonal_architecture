export interface ITokenService {
  generate(payload: any): string;
  verify(token: string): any;
  decode(token: string): any;
}

