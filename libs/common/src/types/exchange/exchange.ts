// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.174.0
//   protoc               v5.26.1
// source: proto/exchange.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Empty } from "google/protobuf/empty";
import { Observable } from "rxjs";

export const protobufPackage = "exchange";

export interface ValidateKeyDto {
  apiKey: string;
  secretKey: string;
}

export interface BalanceDto {
  userId: string;
  display?: boolean | undefined;
}

export interface ExchangeResponse {
  statusCode: number;
  message: string;
}

export interface CreateLimit {
  symbol: string;
  leverage: number;
  quantity: number;
  userId: string;
  position?: string | undefined;
}

export interface BalanceResponse {
  statusCode?: number | undefined;
  message?: string | undefined;
  usdt?: string | undefined;
}

export const EXCHANGE_PACKAGE_NAME = "exchange";

export interface ExchangeServiceClient {
  validateKey(request: ValidateKeyDto): Observable<ExchangeResponse>;

  balance(request: BalanceDto): Observable<BalanceResponse>;

  createLimitBuy(request: CreateLimit): Observable<Empty>;

  createLimitSell(request: CreateLimit): Observable<Empty>;

  closePosition(request: CreateLimit): Observable<Empty>;
}

export interface ExchangeServiceController {
  validateKey(request: ValidateKeyDto): Promise<ExchangeResponse> | Observable<ExchangeResponse> | ExchangeResponse;

  balance(request: BalanceDto): Promise<BalanceResponse> | Observable<BalanceResponse> | BalanceResponse;

  createLimitBuy(request: CreateLimit): void;

  createLimitSell(request: CreateLimit): void;

  closePosition(request: CreateLimit): void;
}

export function ExchangeServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validateKey", "balance", "createLimitBuy", "createLimitSell", "closePosition"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ExchangeService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ExchangeService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EXCHANGE_SERVICE_NAME = "ExchangeService";
