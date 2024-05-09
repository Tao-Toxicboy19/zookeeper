// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.174.0
//   protoc               v5.26.1
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface TokenResponse {
  token?: Token | undefined;
  error?: ErrorMessage | undefined;
}

export interface UserResponse {
  user?: User | undefined;
  error?: ErrorMessage | undefined;
}

export interface Token {
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
}

export interface User {
  username?: string | undefined;
  userId?: string | undefined;
}

export interface SigninDto {
  username: string;
  userId: string;
}

export interface SignupDto {
  username: string;
  password: string;
  email: string;
}

export interface ValidateDto {
  username: string;
  password: string;
}

export interface ErrorMessage {
  message: string;
  error: string;
  statusCode: number;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  signin(request: SigninDto): Observable<TokenResponse>;

  signup(request: SignupDto): Observable<TokenResponse>;

  validate(request: ValidateDto): Observable<UserResponse>;
}

export interface AuthServiceController {
  signin(request: SigninDto): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

  signup(request: SignupDto): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

  validate(request: ValidateDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["signin", "signup", "validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";