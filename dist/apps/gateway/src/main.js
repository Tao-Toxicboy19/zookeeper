/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/gateway/src/app.module.ts":
/*!****************************************!*\
  !*** ./apps/gateway/src/app.module.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/gateway/src/auth/auth.module.ts");
const orders_module_1 = __webpack_require__(/*! ./orders/orders.module */ "./apps/gateway/src/orders/orders.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const position_module_1 = __webpack_require__(/*! ./position/position.module */ "./apps/gateway/src/position/position.module.ts");
const key_module_1 = __webpack_require__(/*! ./key/key.module */ "./apps/gateway/src/key/key.module.ts");
const predict_module_1 = __webpack_require__(/*! ./predict/predict.module */ "./apps/gateway/src/predict/predict.module.ts");
const notification_module_1 = __webpack_require__(/*! ./notification/notification.module */ "./apps/gateway/src/notification/notification.module.ts");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const elasticsearch_1 = __webpack_require__(/*! @nestjs/elasticsearch */ "@nestjs/elasticsearch");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: './apps/gateway/.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1000,
                    limit: 20,
                },
            ]),
            elasticsearch_1.ElasticsearchModule.registerAsync({
                useFactory: async (configService) => ({
                    node: configService.get('ELASTICSEARCH_NODE'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            orders_module_1.OrdersModule,
            key_module_1.KeyModule,
            position_module_1.PositionModule,
            predict_module_1.PredictModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);


/***/ }),

/***/ "./apps/gateway/src/auth/auth.controller.ts":
/*!**************************************************!*\
  !*** ./apps/gateway/src/auth/auth.controller.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const dto_1 = __webpack_require__(/*! ./dto */ "./apps/gateway/src/auth/dto/index.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/gateway/src/auth/auth.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, configService, logger) {
        this.authService = authService;
        this.configService = configService;
        this.logger = logger;
    }
    handleSuccess(message, req, userId) {
        this.logger.log(message, AuthController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            user_id: userId,
        });
    }
    handleError(message, error, req, userId) {
        this.logger.error(message, error.stack, AuthController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            statusCode: 500,
            user_id: userId,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        });
    }
    async signupLocal(dto, res, req) {
        try {
            const { email, userId } = await this.authService.signup(dto);
            res.cookie('user_id', userId, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            this.handleSuccess('Sign up successful', req, userId);
            return {
                email,
            };
        }
        catch (error) {
            this.handleError('Failed to create user', error, req);
            throw error;
        }
    }
    async signinLocal(req, res, request) {
        try {
            res.cookie('user_id', req.user.sub, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            this.handleSuccess('Sign in successful', request, req.user.sub);
            return this.authService.signin({
                username: req.user.username,
                userId: req.user.sub,
            });
        }
        catch (error) {
            this.handleError('Failed to sign in', error, request, req.user.sub);
            throw error;
        }
    }
    async refreshToken(req, res, request) {
        try {
            const { accessToken, refreshToken } = await this.authService.refreshToken({
                userId: req.user.sub,
                username: req.user.username,
            });
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            this.handleSuccess('Token refreshed', request, req.user.sub);
            return {
                message: 'OK',
                statusCode: 200,
            };
        }
        catch (error) {
            this.handleError('Failed to refresh token', error, request, req.user.sub);
            throw error;
        }
    }
    async handleOtp(dto, request, res) {
        try {
            const { accessToken, refreshToken } = await this.authService.confirmOtp({
                otp: dto.otp,
                userId: request.cookies.user_id,
            });
            res.clearCookie('user_id', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            this.handleSuccess('OTP confirmed', request, request.cookies.user_id);
            return {
                message: 'OK',
                statusCode: 200,
            };
        }
        catch (error) {
            this.handleError('Failed to confirm OTP', error, request, request.cookies.user_id);
            throw error;
        }
    }
    async logout(request, res) {
        try {
            if (request.cookies.access_token || request.cookies.user_id) {
                res.clearCookie('access_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                res.clearCookie('refresh_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
            }
            this.handleSuccess('Logged out', request, request.cookies.user_id);
            return {
                message: 'OK',
                statusCode: 200,
            };
        }
        catch (error) {
            this.handleError('Failed to logout', error, request, request.cookies.user_id);
            throw error;
        }
    }
    profile(req, request) {
        try {
            this.handleSuccess('Profile retrieved', request, request.cookies.user_id);
            return this.authService.profile({ username: req.user.username });
        }
        catch (error) {
            this.handleError('Failed to retrieve profile', error, request, request.cookies.user_id);
            throw error;
        }
    }
    async googleAuth(req) {
    }
    async googleAuthRedirect(req, res, request) {
        try {
            const { accessToken, refreshToken } = await this.authService.googleLogin(req);
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            this.handleSuccess('Google login successful', request, request.cookies.user_id);
            res.redirect(this.configService.get('SOCIAL_REDIRECT'));
        }
        catch (error) {
            this.handleError('Failed Google login', error, request, request.cookies.user_id);
            throw error;
        }
    }
    async forgotPassword(dto, request) {
        try {
            this.handleSuccess('Forgot password request processed', request);
            return this.authService.forgotPassword(dto.email);
        }
        catch (error) {
            this.handleError('Failed to process forgot password', error, request);
            throw error;
        }
    }
    async resetPassword(token, dto, request) {
        try {
            this.handleSuccess('Password reset successful', request);
            return this.authService.resetPassword(dto.password, token);
        }
        catch (error) {
            this.handleError('Failed to reset password', error, request);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup/local'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof dto_1.SignupDto !== "undefined" && dto_1.SignupDto) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object, typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], AuthController.prototype, "signupLocal", null);
__decorate([
    (0, common_1.UseGuards)(common_2.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('signin/local'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object, typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], AuthController.prototype, "signinLocal", null);
__decorate([
    (0, common_1.UseGuards)(common_2.RefreshJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('refresh/local'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object, typeof (_m = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _m : Object]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('confirm/otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof dto_1.OtpDto !== "undefined" && dto_1.OtpDto) === "function" ? _p : Object, typeof (_q = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _q : Object, typeof (_r = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], AuthController.prototype, "handleOtp", null);
__decorate([
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _t : Object, typeof (_u = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_w = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], AuthController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(common_2.GoogleAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _y : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.UseGuards)(common_2.GoogleAuthGuard),
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_z = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _z : Object, typeof (_0 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _0 : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_1 = typeof dto_1.ForgotPasswordDto !== "undefined" && dto_1.ForgotPasswordDto) === "function" ? _1 : Object, typeof (_2 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _2 : Object]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_4 = typeof dto_1.ResetPasswordDto !== "undefined" && dto_1.ResetPasswordDto) === "function" ? _4 : Object, typeof (_5 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _5 : Object]),
    __metadata("design:returntype", typeof (_6 = typeof Promise !== "undefined" && Promise) === "function" ? _6 : Object)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 1000 } }),
    (0, common_1.UseInterceptors)(nestjs_grpc_exceptions_1.GrpcToHttpInterceptor),
    __param(2, (0, common_1.Inject)(common_1.Logger)),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof common_1.LoggerService !== "undefined" && common_1.LoggerService) === "function" ? _c : Object])
], AuthController);


/***/ }),

/***/ "./apps/gateway/src/auth/auth.module.ts":
/*!**********************************************!*\
  !*** ./apps/gateway/src/auth/auth.module.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/gateway/src/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/gateway/src/auth/auth.controller.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const path_1 = __webpack_require__(/*! path */ "path");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const strategies_1 = __webpack_require__(/*! ./strategies */ "./apps/gateway/src/auth/strategies/index.ts");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
const custom_logger_service_1 = __webpack_require__(/*! ../utils/custom-logger.service */ "./apps/gateway/src/utils/custom-logger.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: common_2.AUTH_PACKAGE_NAME,
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: common_2.AUTH_PACKAGE_NAME,
                            protoPath: (0, path_1.join)(__dirname, '../auth.proto'),
                            url: configService.get('AUTH_SERVICE_URL'),
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
            passport_1.PassportModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            strategies_1.LocalStrategy,
            common_2.JwtStrategy,
            common_2.RefreshJwtStrategy,
            common_2.GoogleStrategy,
            {
                provide: core_1.APP_FILTER,
                useClass: nestjs_grpc_exceptions_1.GrpcServerExceptionFilter,
            },
            {
                provide: common_1.Logger,
                useClass: custom_logger_service_1.CustomLoggerService,
            },
        ],
    })
], AuthModule);


/***/ }),

/***/ "./apps/gateway/src/auth/auth.service.ts":
/*!***********************************************!*\
  !*** ./apps/gateway/src/auth/auth.service.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let AuthService = class AuthService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.authServiceClient =
            this.client.getService(common_2.AUTH_SERVICE_NAME);
    }
    async signup(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.signup(request).subscribe({
                next: (response) => {
                    const emailResponse = {
                        email: response.email,
                        statusCode: response.statusCode,
                        message: response.message,
                        userId: response.userId,
                    };
                    resolve(emailResponse);
                },
                error: (error) => reject(error),
            });
        });
    }
    async signin(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.signin(request).subscribe({
                next: (response) => {
                    const emailResponse = {
                        email: response.email,
                        statusCode: response.statusCode,
                        message: response.message,
                        userId: response.userId,
                    };
                    resolve(emailResponse);
                },
                error: (error) => reject(error),
            });
        });
    }
    async validate(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.validate(request).subscribe({
                next: (response) => {
                    const userResponse = {
                        statusCode: response.statusCode,
                        message: response.message,
                        username: response.username,
                        sub: response.sub,
                    };
                    resolve(userResponse);
                },
                error: (error) => reject(error),
            });
        });
    }
    async refreshToken(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.refreshToken(request).subscribe({
                next: (response) => {
                    resolve({
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                    });
                },
                error: (error) => reject(error),
            });
        });
    }
    async confirmOtp(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.confirmOtp(request).subscribe({
                next: (response) => {
                    resolve({
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                    });
                },
                error: (error) => reject(error),
            });
        });
    }
    async profile(request) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.profile(request).subscribe({
                next: (response) => {
                    resolve(response);
                },
                error: (error) => reject(error),
            });
        });
    }
    async googleLogin(req) {
        return new Promise((resolve, reject) => {
            this.authServiceClient
                .googleLogin({
                email: req.user.email,
                name: req.user.name,
                picture: req.user.picture,
                googleId: req.user.googleId,
            })
                .subscribe({
                next: (response) => {
                    resolve({
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                    });
                },
                error: (error) => reject(error),
            });
        });
    }
    async forgotPassword(email) {
        return new Promise((resolve, reject) => {
            this.authServiceClient.forgotPassword({ email }).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            });
        });
    }
    async resetPassword(newPassword, token) {
        return new Promise((resolve, reject) => {
            this.authServiceClient
                .resetPassword({ token, password: newPassword })
                .subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            });
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_2.AUTH_PACKAGE_NAME)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientGrpc !== "undefined" && microservices_1.ClientGrpc) === "function" ? _a : Object])
], AuthService);


/***/ }),

/***/ "./apps/gateway/src/auth/dto/forgot-password.dto.ts":
/*!**********************************************************!*\
  !*** ./apps/gateway/src/auth/dto/forgot-password.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),

/***/ "./apps/gateway/src/auth/dto/index.ts":
/*!********************************************!*\
  !*** ./apps/gateway/src/auth/dto/index.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./signup.dto */ "./apps/gateway/src/auth/dto/signup.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./otp.dto */ "./apps/gateway/src/auth/dto/otp.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./forgot-password.dto */ "./apps/gateway/src/auth/dto/forgot-password.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./reset-password.dto */ "./apps/gateway/src/auth/dto/reset-password.dto.ts"), exports);


/***/ }),

/***/ "./apps/gateway/src/auth/dto/otp.dto.ts":
/*!**********************************************!*\
  !*** ./apps/gateway/src/auth/dto/otp.dto.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OtpDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class OtpDto {
}
exports.OtpDto = OtpDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(3),
    __metadata("design:type", Number)
], OtpDto.prototype, "otp", void 0);


/***/ }),

/***/ "./apps/gateway/src/auth/dto/reset-password.dto.ts":
/*!*********************************************************!*\
  !*** ./apps/gateway/src/auth/dto/reset-password.dto.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);


/***/ }),

/***/ "./apps/gateway/src/auth/dto/signup.dto.ts":
/*!*************************************************!*\
  !*** ./apps/gateway/src/auth/dto/signup.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignupDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SignupDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);


/***/ }),

/***/ "./apps/gateway/src/auth/strategies/index.ts":
/*!***************************************************!*\
  !*** ./apps/gateway/src/auth/strategies/index.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./loca.strategy */ "./apps/gateway/src/auth/strategies/loca.strategy.ts"), exports);


/***/ }),

/***/ "./apps/gateway/src/auth/strategies/loca.strategy.ts":
/*!***********************************************************!*\
  !*** ./apps/gateway/src/auth/strategies/loca.strategy.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/gateway/src/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local') {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async validate(username, password) {
        try {
            const user = await this.authService.validate({ username, password });
            if (!user) {
                throw new common_1.BadRequestException();
            }
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException('not found username.');
        }
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),

/***/ "./apps/gateway/src/key/dto/index.ts":
/*!*******************************************!*\
  !*** ./apps/gateway/src/key/dto/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./key.dto */ "./apps/gateway/src/key/dto/key.dto.ts"), exports);


/***/ }),

/***/ "./apps/gateway/src/key/dto/key.dto.ts":
/*!*********************************************!*\
  !*** ./apps/gateway/src/key/dto/key.dto.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class KeyDto {
}
exports.KeyDto = KeyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyDto.prototype, "secretKey", void 0);


/***/ }),

/***/ "./apps/gateway/src/key/key.controller.ts":
/*!************************************************!*\
  !*** ./apps/gateway/src/key/key.controller.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const key_service_1 = __webpack_require__(/*! ./key.service */ "./apps/gateway/src/key/key.service.ts");
const dto_1 = __webpack_require__(/*! ./dto */ "./apps/gateway/src/key/dto/index.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
let KeyController = class KeyController {
    constructor(keyService) {
        this.keyService = keyService;
    }
    create(dto, req) {
        console.log('hello world');
        return this.keyService.create({
            ...dto,
            userId: req.user.sub,
        });
    }
    getKey(req) {
        return this.keyService.getKey({ userId: req.user.sub });
    }
};
exports.KeyController = KeyController;
__decorate([
    (0, common_1.UseInterceptors)(nestjs_grpc_exceptions_1.GrpcToHttpInterceptor),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.KeyDto !== "undefined" && dto_1.KeyDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], KeyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KeyController.prototype, "getKey", null);
exports.KeyController = KeyController = __decorate([
    (0, common_1.Controller)('key'),
    __metadata("design:paramtypes", [typeof (_a = typeof key_service_1.KeyService !== "undefined" && key_service_1.KeyService) === "function" ? _a : Object])
], KeyController);


/***/ }),

/***/ "./apps/gateway/src/key/key.module.ts":
/*!********************************************!*\
  !*** ./apps/gateway/src/key/key.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const path_1 = __webpack_require__(/*! path */ "path");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const key_controller_1 = __webpack_require__(/*! ./key.controller */ "./apps/gateway/src/key/key.controller.ts");
const key_service_1 = __webpack_require__(/*! ./key.service */ "./apps/gateway/src/key/key.service.ts");
const secret_guard_1 = __webpack_require__(/*! ./secret.guard */ "./apps/gateway/src/key/secret.guard.ts");
let KeyModule = class KeyModule {
};
exports.KeyModule = KeyModule;
exports.KeyModule = KeyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: common_2.KEY_PACKAGE_NAME,
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: common_2.KEY_PACKAGE_NAME,
                            protoPath: (0, path_1.join)(__dirname, '../key.proto'),
                            url: configService.get('KEY_SERVICE_URL'),
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [key_controller_1.KeyController],
        providers: [key_service_1.KeyService, secret_guard_1.SecretGuard],
        exports: [key_service_1.KeyService],
    })
], KeyModule);


/***/ }),

/***/ "./apps/gateway/src/key/key.service.ts":
/*!*********************************************!*\
  !*** ./apps/gateway/src/key/key.service.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyService = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let KeyService = class KeyService {
    constructor(keyClient) {
        this.keyClient = keyClient;
    }
    onModuleInit() {
        this.keyServiceClient =
            this.keyClient.getService(common_1.KEY_SERVICE_NAME);
    }
    async create(request) {
        return new Promise((resolve, reject) => {
            this.keyServiceClient.createKey(request).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            });
        });
    }
    async getKey(request) {
        return new Promise((resolve, reject) => {
            this.keyServiceClient.getKey(request).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            });
        });
    }
};
exports.KeyService = KeyService;
exports.KeyService = KeyService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, common_2.Inject)(common_1.KEY_PACKAGE_NAME)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientGrpc !== "undefined" && microservices_1.ClientGrpc) === "function" ? _a : Object])
], KeyService);


/***/ }),

/***/ "./apps/gateway/src/key/secret.guard.ts":
/*!**********************************************!*\
  !*** ./apps/gateway/src/key/secret.guard.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SecretGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecretGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const key_service_1 = __webpack_require__(/*! ./key.service */ "./apps/gateway/src/key/key.service.ts");
let SecretGuard = SecretGuard_1 = class SecretGuard {
    constructor(keyService) {
        this.keyService = keyService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const payload = SecretGuard_1.validateToken(client);
        if (payload.sub) {
            const { statusCode } = await this.keyService.getKey({
                userId: payload.sub,
            });
            if (statusCode) {
                return false;
            }
            return true;
        }
        return false;
    }
    static validateToken(client) {
        const { authorization } = client.handshake.headers;
        const token = authorization.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, 'VgmBOirkrV6x179MeyStIN8jr2xWQVWx' || 0);
        client['user'] = payload;
        return payload;
    }
};
exports.SecretGuard = SecretGuard;
exports.SecretGuard = SecretGuard = SecretGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof key_service_1.KeyService !== "undefined" && key_service_1.KeyService) === "function" ? _a : Object])
], SecretGuard);


/***/ }),

/***/ "./apps/gateway/src/notification/conusmer/consumer.service.ts":
/*!********************************************************************!*\
  !*** ./apps/gateway/src/notification/conusmer/consumer.service.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConsumerService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const amqp_connection_manager_1 = __webpack_require__(/*! amqp-connection-manager */ "amqp-connection-manager");
const notification_service_1 = __webpack_require__(/*! ../notification.service */ "./apps/gateway/src/notification/notification.service.ts");
const notification_gateway_1 = __webpack_require__(/*! ../notification.gateway */ "./apps/gateway/src/notification/notification.gateway.ts");
let ConsumerService = ConsumerService_1 = class ConsumerService {
    constructor(configService, notificationService, notificationGateway) {
        this.configService = configService;
        this.notificationService = notificationService;
        this.notificationGateway = notificationGateway;
        this.logger = new common_1.Logger(ConsumerService_1.name);
        this.notificationOrderQueue = 'notification_order_queue';
        const connection = amqp_connection_manager_1.default.connect([
            this.configService.get('RABBITMQ_URL'),
        ]);
        this.channelWrapper = connection.createChannel({
            setup: async (channel) => {
                await channel.assertQueue(this.notificationOrderQueue, {
                    durable: true,
                });
                this.logger.debug('Queues set up successfully');
            },
        });
        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ');
        });
        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err);
        });
    }
    async onModuleInit() {
        this.channelWrapper.addSetup((channel) => {
            channel.consume(this.notificationOrderQueue, async (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(message);
                    await Promise.all([
                        this.notificationGateway.sendNotification(message.msg, message.user_id),
                        this.notificationService.createMsg(message),
                    ]);
                    channel.ack(msg);
                }
            });
        });
    }
};
exports.ConsumerService = ConsumerService;
exports.ConsumerService = ConsumerService = ConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object, typeof (_c = typeof notification_gateway_1.NotificationGateway !== "undefined" && notification_gateway_1.NotificationGateway) === "function" ? _c : Object])
], ConsumerService);


/***/ }),

/***/ "./apps/gateway/src/notification/notification.controller.ts":
/*!******************************************************************!*\
  !*** ./apps/gateway/src/notification/notification.controller.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationController_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./apps/gateway/src/notification/notification.service.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const express_1 = __webpack_require__(/*! express */ "express");
let NotificationController = NotificationController_1 = class NotificationController {
    constructor(notificationService, logger) {
        this.notificationService = notificationService;
        this.logger = logger;
    }
    handleSuccess(message, req, userId) {
        this.logger.log(message, NotificationController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            user_id: userId,
        });
    }
    handleError(message, error, req, userId) {
        this.logger.error(message, error.stack, NotificationController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            statusCode: 500,
            user_id: userId,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        });
    }
    async notifications(req, request) {
        try {
            const response = await this.notificationService.notifications(req.user.sub);
            this.handleSuccess('query notification successful.', request, req.user.sub);
            return response;
        }
        catch (error) {
            this.handleError('Failed to query notification.', error, request, req.user.sub);
            throw error;
        }
    }
    async updateIsRead(req, request) {
        try {
            const response = await this.notificationService.updateIsRead(req.user.sub);
            if (response.statusCode !== 200) {
                this.handleError('Failed to update notification.', response.error, request, req.user.sub);
                throw new common_1.HttpException(response.message, response.statusCode);
            }
            this.handleSuccess('update notification successful.', request, req.user.sub);
            return response;
        }
        catch (error) {
            this.handleError('Failed to update notification.', error, request, req.user.sub);
            throw error;
        }
    }
    async deleteNotification(id, req, request) {
        try {
            const response = await this.notificationService.deleteNotification(id, req.user.sub);
            if (response.statusCode !== 200) {
                this.handleError('Failed to update notification.', response.error, request, req.user.sub);
                throw new common_1.HttpException(response.message, response.statusCode);
            }
            this.handleSuccess('update notification successful.', request, req.user.sub);
            return response;
        }
        catch (error) {
            this.handleError('Failed to update notification.', error, request, req.user.sub);
            throw error;
        }
    }
    async create(req, request) {
        try {
            const response = await this.notificationService.createMsg({
                user_id: req.user.sub,
                msg: 'hello world',
            });
            if (response.statusCode !== 200) {
                this.handleError('Failed to create notification.', response.error, request, req.user.sub);
                throw new common_1.HttpException(response.message, response.statusCode);
            }
            this.handleSuccess('update notification successful.', request, req.user.sub);
            return response;
        }
        catch (error) {
            this.handleError('Failed to update notification.', error, request, req.user.sub);
            throw error;
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "notifications", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateIsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
exports.NotificationController = NotificationController = NotificationController_1 = __decorate([
    (0, common_1.Controller)('notification'),
    __param(1, (0, common_1.Inject)(common_1.Logger)),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object, typeof (_b = typeof common_1.LoggerService !== "undefined" && common_1.LoggerService) === "function" ? _b : Object])
], NotificationController);


/***/ }),

/***/ "./apps/gateway/src/notification/notification.gateway.ts":
/*!***************************************************************!*\
  !*** ./apps/gateway/src/notification/notification.gateway.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationGateway = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
let NotificationGateway = class NotificationGateway {
    afterInit(clinet) {
        console.log('WebSocket server initialized');
        clinet.use((0, common_1.SocketAuthMiddleware)());
    }
    handleConnection(client) {
        console.log('Client connected:', client.id);
    }
    handleDisconnect(client) {
        console.log('Client disconnected:', client.id);
    }
    handleMessage(client, msg) {
        console.log('Received message:', msg);
        const payload = client['user'];
        console.log(payload);
        if (payload.sub) {
            console.log(`join: ${payload.sub}`);
            client.join(payload.sub);
        }
    }
    sendNotification(msg, userId) {
        this.server.to(userId).emit('notification', msg);
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, common_2.UseGuards)(common_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleMessage", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8001, {
        cors: {
            origin: '*',
        },
    })
], NotificationGateway);


/***/ }),

/***/ "./apps/gateway/src/notification/notification.module.ts":
/*!**************************************************************!*\
  !*** ./apps/gateway/src/notification/notification.module.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./apps/gateway/src/notification/notification.service.ts");
const notification_gateway_1 = __webpack_require__(/*! ./notification.gateway */ "./apps/gateway/src/notification/notification.gateway.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const notification_controller_1 = __webpack_require__(/*! ./notification.controller */ "./apps/gateway/src/notification/notification.controller.ts");
const consumer_service_1 = __webpack_require__(/*! ./conusmer/consumer.service */ "./apps/gateway/src/notification/conusmer/consumer.service.ts");
const custom_logger_service_1 = __webpack_require__(/*! ../utils/custom-logger.service */ "./apps/gateway/src/utils/custom-logger.service.ts");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'NOTIFICATION_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL')],
                            queue: configService.get('NOTIFY_QUEUE'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [
            notification_gateway_1.NotificationGateway,
            notification_service_1.NotificationService,
            consumer_service_1.ConsumerService,
            {
                provide: common_1.Logger,
                useClass: custom_logger_service_1.CustomLoggerService,
            },
        ],
    })
], NotificationModule);


/***/ }),

/***/ "./apps/gateway/src/notification/notification.service.ts":
/*!***************************************************************!*\
  !*** ./apps/gateway/src/notification/notification.service.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let NotificationService = class NotificationService {
    constructor(client) {
        this.client = client;
    }
    async notifications(userId) {
        return new Promise((resolve, reject) => {
            this.client
                .send('notifications', { user_id: userId })
                .subscribe({
                next: (response) => resolve(response),
                error: (err) => {
                    console.error('Error while fetching notifications:', err);
                    reject(new Error('Failed to fetch notifications'));
                },
                complete: () => console.log('Notifications query completed'),
            });
        });
    }
    async updateIsRead(userId) {
        return new Promise((resolve, reject) => {
            this.client
                .send('update_isRead', { user_id: userId })
                .subscribe({
                next: (response) => resolve(response),
                error: (err) => {
                    console.error('Error while updating notifications as read:', err);
                    reject(new Error('Failed to update notifications as read'));
                },
                complete: () => console.log('Update isRead query completed'),
            });
        });
    }
    async deleteNotification(id, userId) {
        return new Promise((resolve, reject) => {
            this.client
                .send('delete_notification', { id, user_id: userId })
                .subscribe({
                next: (response) => resolve(response),
                error: (err) => {
                    console.error('Error while deleting notification:', err);
                    reject(new Error('Failed to delete notification'));
                },
                complete: () => console.log('Delete notification query completed'),
            });
        });
    }
    async createMsg(dto) {
        return new Promise((resolve, reject) => {
            this.client.send('create_msg_notify', dto).subscribe({
                next: (response) => resolve(response),
                error: (err) => {
                    console.error('Error while creating notification message:', err);
                    reject(new Error('Failed to create notification message'));
                },
                complete: () => console.log('Create message notification query completed'),
            });
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('NOTIFICATION_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], NotificationService);


/***/ }),

/***/ "./apps/gateway/src/orders/dto/index.ts":
/*!**********************************************!*\
  !*** ./apps/gateway/src/orders/dto/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./order.dto */ "./apps/gateway/src/orders/dto/order.dto.ts"), exports);


/***/ }),

/***/ "./apps/gateway/src/orders/dto/order.dto.ts":
/*!**************************************************!*\
  !*** ./apps/gateway/src/orders/dto/order.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class OrderDto {
}
exports.OrderDto = OrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrderDto.prototype, "leverage", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrderDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDto.prototype, "timeframe", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrderDto.prototype, "ema", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDto.prototype, "userId", void 0);


/***/ }),

/***/ "./apps/gateway/src/orders/orders.controller.ts":
/*!******************************************************!*\
  !*** ./apps/gateway/src/orders/orders.controller.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrdersController_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dto_1 = __webpack_require__(/*! ./dto */ "./apps/gateway/src/orders/dto/index.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const orders_service_1 = __webpack_require__(/*! ./orders.service */ "./apps/gateway/src/orders/orders.service.ts");
const express_1 = __webpack_require__(/*! express */ "express");
let OrdersController = OrdersController_1 = class OrdersController {
    constructor(ordersService, logger) {
        this.ordersService = ordersService;
        this.logger = logger;
    }
    handleSuccess(message, req, userId) {
        this.logger.log(message, OrdersController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            user_id: userId,
        });
    }
    handleError(message, error, req, userId) {
        this.logger.error(message, error.stack, OrdersController_1.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            statusCode: 500,
            user_id: userId,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        });
    }
    async createOrder(dto, req, request) {
        try {
            const msg = await this.ordersService.createOrder({
                ...dto,
                userId: req.user.sub,
            });
            this.handleSuccess('create order successful', request, req.user.sub);
            return {
                message: msg,
                statusCode: 200,
            };
        }
        catch (error) {
            this.handleError('Failed to create order', error, request);
            throw error;
        }
    }
    async query(req, request) {
        try {
            this.handleSuccess('query order successful', request, req.user.sub);
            return await this.ordersService.query(req.user.sub);
        }
        catch (error) {
            this.handleError('Failed to query order', error, request);
            throw error;
        }
    }
    async balance() {
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof dto_1.OrderDto !== "undefined" && dto_1.OrderDto) === "function" ? _c : Object, Object, typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_1.Get)('query'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "query", null);
__decorate([
    (0, common_1.Get)('balance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "balance", null);
exports.OrdersController = OrdersController = OrdersController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    __param(1, (0, common_1.Inject)(common_1.Logger)),
    __metadata("design:paramtypes", [typeof (_a = typeof orders_service_1.OrdersService !== "undefined" && orders_service_1.OrdersService) === "function" ? _a : Object, typeof (_b = typeof common_1.LoggerService !== "undefined" && common_1.LoggerService) === "function" ? _b : Object])
], OrdersController);


/***/ }),

/***/ "./apps/gateway/src/orders/orders.module.ts":
/*!**************************************************!*\
  !*** ./apps/gateway/src/orders/orders.module.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
const orders_controller_1 = __webpack_require__(/*! ./orders.controller */ "./apps/gateway/src/orders/orders.controller.ts");
const orders_service_1 = __webpack_require__(/*! ./orders.service */ "./apps/gateway/src/orders/orders.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const custom_logger_service_1 = __webpack_require__(/*! ../utils/custom-logger.service */ "./apps/gateway/src/utils/custom-logger.service.ts");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'ORDERS_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL')],
                            queue: configService.get('RABBITMQ_QUEUE_TX'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [
            orders_service_1.OrdersService,
            nestjs_grpc_exceptions_1.GrpcToHttpInterceptor,
            {
                provide: common_1.Logger,
                useClass: custom_logger_service_1.CustomLoggerService,
            },
        ],
    })
], OrdersModule);


/***/ }),

/***/ "./apps/gateway/src/orders/orders.service.ts":
/*!***************************************************!*\
  !*** ./apps/gateway/src/orders/orders.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let OrdersService = class OrdersService {
    constructor(client) {
        this.client = client;
    }
    async createOrder(dto) {
        return new Promise((resolve, reject) => {
            this.client.send('create_order', dto).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            });
        });
    }
    async query(userId) {
        return new Promise((resolve, reject) => {
            this.client.send('query_order', userId).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            });
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], OrdersService);


/***/ }),

/***/ "./apps/gateway/src/position/position.consumer.ts":
/*!********************************************************!*\
  !*** ./apps/gateway/src/position/position.consumer.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PositionConsumer_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositionConsumer = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const kafkajs_1 = __webpack_require__(/*! kafkajs */ "kafkajs");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const position_gateway_1 = __webpack_require__(/*! ./position.gateway */ "./apps/gateway/src/position/position.gateway.ts");
let PositionConsumer = PositionConsumer_1 = class PositionConsumer {
    constructor(positionGateway, configService) {
        this.positionGateway = positionGateway;
        this.configService = configService;
        this.logger = new common_1.Logger(PositionConsumer_1.name);
        this.kafkaInstance = new kafkajs_1.Kafka({
            clientId: 'position-client',
            brokers: [configService.get('KAFKA_URL')],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        });
        this.consumer = this.kafkaInstance.consumer({
            groupId: 'position-group',
        });
        this.consumer.on('consumer.connect', () => {
            this.logger.debug('Connected to Kafka');
        });
        this.consumer.on('consumer.disconnect', (err) => {
            this.logger.debug('Disconnected from Kafka:', err);
        });
    }
    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topic: 'position-topic',
            fromBeginning: false,
        });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const msg = JSON.parse(message.value.toString());
                this.positionGateway.emitMessage(JSON.stringify(msg.position), msg.user_id);
            },
        });
    }
};
exports.PositionConsumer = PositionConsumer;
exports.PositionConsumer = PositionConsumer = PositionConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof position_gateway_1.PositionGateway !== "undefined" && position_gateway_1.PositionGateway) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], PositionConsumer);


/***/ }),

/***/ "./apps/gateway/src/position/position.gateway.ts":
/*!*******************************************************!*\
  !*** ./apps/gateway/src/position/position.gateway.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PositionGateway_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositionGateway = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const position_service_1 = __webpack_require__(/*! ./position.service */ "./apps/gateway/src/position/position.service.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let PositionGateway = PositionGateway_1 = class PositionGateway {
    constructor(positionService) {
        this.positionService = positionService;
        this.logger = new common_2.Logger(PositionGateway_1.name);
    }
    afterInit(clinet) {
        clinet.use((0, common_1.SocketAuthMiddleware)());
    }
    handleMessage(client) {
        const payload = client['user'];
        if (payload.sub) {
            client.join(payload.sub);
            setInterval(async () => {
                await this.positionService.sendUserId(payload.sub);
            }, 1000);
            this.server.to(payload.sub).emit('position');
        }
    }
    emitMessage(msg, userId) {
        console.log(msg);
        this.server.to(userId).emit('position', msg);
    }
    handleFindWallet(client, msg) {
        const payload = client['user'];
        if (payload.sub) {
            client.join(payload.sub);
            setInterval(async () => {
                const { usdt } = await this.positionService.handleWallet(payload.sub);
                this.server.to(payload.sub).emit('wallet', usdt);
            }, 1000);
        }
    }
};
exports.PositionGateway = PositionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], PositionGateway.prototype, "server", void 0);
__decorate([
    (0, common_2.UseGuards)(common_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('position'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PositionGateway.prototype, "handleMessage", null);
__decorate([
    (0, common_2.UseGuards)(common_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('wallet'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, String]),
    __metadata("design:returntype", void 0)
], PositionGateway.prototype, "handleFindWallet", null);
exports.PositionGateway = PositionGateway = PositionGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: '*',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof position_service_1.PositionService !== "undefined" && position_service_1.PositionService) === "function" ? _a : Object])
], PositionGateway);


/***/ }),

/***/ "./apps/gateway/src/position/position.module.ts":
/*!******************************************************!*\
  !*** ./apps/gateway/src/position/position.module.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositionModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const position_gateway_1 = __webpack_require__(/*! ./position.gateway */ "./apps/gateway/src/position/position.gateway.ts");
const position_consumer_1 = __webpack_require__(/*! ./position.consumer */ "./apps/gateway/src/position/position.consumer.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const path_1 = __webpack_require__(/*! path */ "path");
const position_service_1 = __webpack_require__(/*! ./position.service */ "./apps/gateway/src/position/position.service.ts");
const key_module_1 = __webpack_require__(/*! ../key/key.module */ "./apps/gateway/src/key/key.module.ts");
let PositionModule = class PositionModule {
};
exports.PositionModule = PositionModule;
exports.PositionModule = PositionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: common_2.EXCHANGE_PACKAGE_NAME,
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: common_2.EXCHANGE_PACKAGE_NAME,
                            protoPath: (0, path_1.join)(__dirname, '../exchange.proto'),
                            url: configService.get('EXCHANGE_SERVICE_URL'),
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
            key_module_1.KeyModule,
        ],
        providers: [position_gateway_1.PositionGateway, position_consumer_1.PositionConsumer, position_service_1.PositionService],
    })
], PositionModule);


/***/ }),

/***/ "./apps/gateway/src/position/position.service.ts":
/*!*******************************************************!*\
  !*** ./apps/gateway/src/position/position.service.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositionService = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let PositionService = class PositionService {
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        this.exchangeServiceClient =
            this.client.getService(common_1.EXCHANGE_SERVICE_NAME);
    }
    async sendUserId(userId) {
        new Promise((resolve, reject) => {
            this.exchangeServiceClient.sendUserId({ userId }).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            });
        });
    }
    async handleWallet(userId) {
        try {
            return new Promise((resolve, reject) => {
                this.exchangeServiceClient.balance({ userId }).subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                });
            });
        }
        catch (error) {
            throw error;
        }
    }
};
exports.PositionService = PositionService;
exports.PositionService = PositionService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, common_2.Inject)(common_1.EXCHANGE_PACKAGE_NAME)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientGrpc !== "undefined" && microservices_1.ClientGrpc) === "function" ? _a : Object])
], PositionService);


/***/ }),

/***/ "./apps/gateway/src/predict/predict.controller.ts":
/*!********************************************************!*\
  !*** ./apps/gateway/src/predict/predict.controller.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PredictController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const predict_service_1 = __webpack_require__(/*! ./predict.service */ "./apps/gateway/src/predict/predict.service.ts");
let PredictController = class PredictController {
    constructor(predictService) {
        this.predictService = predictService;
    }
    async predict() {
        return this.predictService.createPrddict();
    }
    async delete() {
        return this.predictService.deleteData();
    }
};
exports.PredictController = PredictController;
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictController.prototype, "predict", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictController.prototype, "delete", null);
exports.PredictController = PredictController = __decorate([
    (0, common_1.Controller)('predict'),
    __metadata("design:paramtypes", [typeof (_a = typeof predict_service_1.PredictService !== "undefined" && predict_service_1.PredictService) === "function" ? _a : Object])
], PredictController);


/***/ }),

/***/ "./apps/gateway/src/predict/predict.module.ts":
/*!****************************************************!*\
  !*** ./apps/gateway/src/predict/predict.module.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PredictModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const predict_service_1 = __webpack_require__(/*! ./predict.service */ "./apps/gateway/src/predict/predict.service.ts");
const predict_controller_1 = __webpack_require__(/*! ./predict.controller */ "./apps/gateway/src/predict/predict.controller.ts");
const predict_1 = __webpack_require__(/*! @app/common/types/predict/predict */ "./libs/common/src/types/predict/predict.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const path_1 = __webpack_require__(/*! path */ "path");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
let PredictModule = class PredictModule {
};
exports.PredictModule = PredictModule;
exports.PredictModule = PredictModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: predict_1.PREDICT_PACKAGE_NAME,
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: predict_1.PREDICT_PACKAGE_NAME,
                            protoPath: (0, path_1.join)(__dirname, '../predict.proto'),
                            url: configService.get('PREDICT_SERVICE_URL'),
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [predict_controller_1.PredictController],
        providers: [predict_service_1.PredictService],
    })
], PredictModule);


/***/ }),

/***/ "./apps/gateway/src/predict/predict.service.ts":
/*!*****************************************************!*\
  !*** ./apps/gateway/src/predict/predict.service.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PredictService = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let PredictService = class PredictService {
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        this.predictServiceClient =
            this.client.getService(common_1.PREDICT_SERVICE_NAME);
    }
    async debug() {
        this.predictServiceClient.predict({});
    }
    async createPrddict() {
        return new Promise((resolve, reject) => {
            this.predictServiceClient.predict({}).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            });
        });
    }
    async deleteData() {
        const today = new Date();
        const timestamp = Math.floor(today.getTime() / 1000);
        return new Promise((resolve, reject) => {
            this.predictServiceClient
                .deleteall({ timeStamp: timestamp })
                .subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            });
        });
    }
};
exports.PredictService = PredictService;
exports.PredictService = PredictService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, common_2.Inject)(common_1.PREDICT_PACKAGE_NAME)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientGrpc !== "undefined" && microservices_1.ClientGrpc) === "function" ? _a : Object])
], PredictService);


/***/ }),

/***/ "./apps/gateway/src/utils/custom-logger.service.ts":
/*!*********************************************************!*\
  !*** ./apps/gateway/src/utils/custom-logger.service.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomLoggerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const elasticsearch_1 = __webpack_require__(/*! @elastic/elasticsearch */ "@elastic/elasticsearch");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let CustomLoggerService = class CustomLoggerService {
    constructor(configService) {
        this.configService = configService;
        this.client = new elasticsearch_1.Client({
            node: configService.get('ELASTICSEARCH_NODE'),
        });
    }
    log(message, context, extra) {
        this.sendToElasticsearch('log', message, context, undefined, extra);
    }
    error(message, trace, context, extra) {
        this.sendToElasticsearch('error', message, context, trace, extra);
    }
    warn(message, context) {
        this.sendToElasticsearch('warn', message, context);
    }
    debug(message, context) {
        this.sendToElasticsearch('debug', message, context);
    }
    verbose(message, context) {
        this.sendToElasticsearch('verbose', message, context);
    }
    async sendToElasticsearch(level, message, context, trace, extra) {
        try {
            await this.client.index({
                index: 'zookeeper-logs',
                document: {
                    timestamp: new Date().toISOString(),
                    level,
                    service: context || 'unknown-service',
                    message,
                    ...extra,
                    error: {
                        name: extra?.error?.name || 'UnknownError',
                        message: extra?.error?.message || 'No error message',
                        stack: extra?.error?.stack || 'No stack trace',
                    },
                },
            });
        }
        catch (error) {
            console.error('Error sending log to Elasticsearch', error);
        }
    }
};
exports.CustomLoggerService = CustomLoggerService;
exports.CustomLoggerService = CustomLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], CustomLoggerService);


/***/ }),

/***/ "./apps/gateway/src/utils/throttler-exception.filter.ts":
/*!**************************************************************!*\
  !*** ./apps/gateway/src/utils/throttler-exception.filter.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThrottlerExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ThrottlerExceptionFilter = class ThrottlerExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception.getStatus() === 429) {
            response.status(429).json({
                statusCode: 429,
                message: 'Too Many Requests - Custom Message',
            });
        }
        else {
            response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.message,
            });
        }
    }
};
exports.ThrottlerExceptionFilter = ThrottlerExceptionFilter;
exports.ThrottlerExceptionFilter = ThrottlerExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], ThrottlerExceptionFilter);


/***/ }),

/***/ "./libs/common/src/database/abstract.repository.ts":
/*!*********************************************************!*\
  !*** ./libs/common/src/database/abstract.repository.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
class AbstractRepository {
    constructor(model, connection) {
        this.model = model;
        this.connection = connection;
    }
    async create(document, options) {
        const createdDocument = new this.model(document);
        return (await createdDocument.save(options)).toJSON();
    }
    async findOne(filterQuery) {
        const document = (await this.model.findOne(filterQuery, {}, { lean: true }));
        if (!document) {
            return undefined;
        }
        return document;
    }
    async findOneAndUpdate(filterQuery, update) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });
        if (!document) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new common_1.NotFoundException('Document not found.');
        }
        return document;
    }
    async upsert(filterQuery, updateQuery) {
        return this.model.findOneAndUpdate(filterQuery, updateQuery, {
            lean: true,
            upsert: true,
            new: true,
        });
    }
    async find(filterQuery) {
        return this.model.find(filterQuery, {}, { lean: true });
    }
    async startTransaction() {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }
    async updateMany(filterQuery, update, options) {
        const result = await this.model.updateMany(filterQuery, update, {
            lean: true,
            ...options,
        });
        if (result.modifiedCount === 0) {
            this.logger.warn(`No documents were updated with filterQuery:`, filterQuery);
            return [];
        }
        return this.model.find(filterQuery, {}, { lean: true });
    }
    async deleteOne(filterQuery) {
        const result = await this.model.deleteOne(filterQuery).exec();
        if (result.deletedCount === 0) {
            this.logger.warn(`No documents found to delete with filterQuery:`, filterQuery);
            throw new common_1.NotFoundException('Document not found to delete.');
        }
    }
    async deleteMany(filterQuery) {
        const result = await this.model.deleteMany(filterQuery).exec();
        if (result.deletedCount === 0) {
            this.logger.warn(`No documents found to delete with filterQuery:`, filterQuery);
            throw new common_1.NotFoundException('Documents not found to delete.');
        }
    }
}
exports.AbstractRepository = AbstractRepository;


/***/ }),

/***/ "./libs/common/src/database/abstract.schema.ts":
/*!*****************************************************!*\
  !*** ./libs/common/src/database/abstract.schema.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractDocument = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let AbstractDocument = class AbstractDocument {
};
exports.AbstractDocument = AbstractDocument;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], AbstractDocument.prototype, "_id", void 0);
exports.AbstractDocument = AbstractDocument = __decorate([
    (0, mongoose_1.Schema)()
], AbstractDocument);


/***/ }),

/***/ "./libs/common/src/database/database.module.ts":
/*!*****************************************************!*\
  !*** ./libs/common/src/database/database.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
    })
], DatabaseModule);


/***/ }),

/***/ "./libs/common/src/database/index.ts":
/*!*******************************************!*\
  !*** ./libs/common/src/database/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./abstract.repository */ "./libs/common/src/database/abstract.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./abstract.schema */ "./libs/common/src/database/abstract.schema.ts"), exports);
__exportStar(__webpack_require__(/*! ./database.module */ "./libs/common/src/database/database.module.ts"), exports);


/***/ }),

/***/ "./libs/common/src/guards/cookies-auth.guard.ts":
/*!******************************************************!*\
  !*** ./libs/common/src/guards/cookies-auth.guard.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CookieAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CookieAuthGuard = class CookieAuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.cookies?.seed_phrase) {
            request['seed_phrase'] = request.cookies?.seed_phrase;
            return true;
        }
        else {
            return false;
        }
    }
};
exports.CookieAuthGuard = CookieAuthGuard;
exports.CookieAuthGuard = CookieAuthGuard = __decorate([
    (0, common_1.Injectable)()
], CookieAuthGuard);


/***/ }),

/***/ "./libs/common/src/guards/google-auth.guard.ts":
/*!*****************************************************!*\
  !*** ./libs/common/src/guards/google-auth.guard.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let GoogleAuthGuard = class GoogleAuthGuard extends (0, passport_1.AuthGuard)('google') {
};
exports.GoogleAuthGuard = GoogleAuthGuard;
exports.GoogleAuthGuard = GoogleAuthGuard = __decorate([
    (0, common_1.Injectable)()
], GoogleAuthGuard);


/***/ }),

/***/ "./libs/common/src/guards/index.ts":
/*!*****************************************!*\
  !*** ./libs/common/src/guards/index.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./jwt-auth.guard */ "./libs/common/src/guards/jwt-auth.guard.ts"), exports);
__exportStar(__webpack_require__(/*! ./local-auto.guard */ "./libs/common/src/guards/local-auto.guard.ts"), exports);
__exportStar(__webpack_require__(/*! ./refresh-jwt.guard */ "./libs/common/src/guards/refresh-jwt.guard.ts"), exports);
__exportStar(__webpack_require__(/*! ./ws-jwt.guard */ "./libs/common/src/guards/ws-jwt.guard.ts"), exports);
__exportStar(__webpack_require__(/*! ./google-auth.guard */ "./libs/common/src/guards/google-auth.guard.ts"), exports);
__exportStar(__webpack_require__(/*! ./cookies-auth.guard */ "./libs/common/src/guards/cookies-auth.guard.ts"), exports);


/***/ }),

/***/ "./libs/common/src/guards/jwt-auth.guard.ts":
/*!**************************************************!*\
  !*** ./libs/common/src/guards/jwt-auth.guard.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./libs/common/src/guards/local-auto.guard.ts":
/*!****************************************************!*\
  !*** ./libs/common/src/guards/local-auto.guard.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


/***/ }),

/***/ "./libs/common/src/guards/refresh-jwt.guard.ts":
/*!*****************************************************!*\
  !*** ./libs/common/src/guards/refresh-jwt.guard.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshJwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let RefreshJwtAuthGuard = class RefreshJwtAuthGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
};
exports.RefreshJwtAuthGuard = RefreshJwtAuthGuard;
exports.RefreshJwtAuthGuard = RefreshJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], RefreshJwtAuthGuard);


/***/ }),

/***/ "./libs/common/src/guards/ws-jwt.guard.ts":
/*!************************************************!*\
  !*** ./libs/common/src/guards/ws-jwt.guard.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsJwtGuard = void 0;
const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
class WsJwtGuard {
    canActivate(context) {
        if (context.getType() != 'ws') {
            return true;
        }
        const client = context.switchToWs().getClient();
        WsJwtGuard.validateToken(client);
        return true;
    }
    static validateToken(client) {
        const { authorization } = client.handshake.headers;
        const token = authorization.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, 'VgmBOirkrV6x179MeyStIN8jr2xWQVWx');
        client['user'] = payload;
        return payload;
    }
}
exports.WsJwtGuard = WsJwtGuard;


/***/ }),

/***/ "./libs/common/src/index.ts":
/*!**********************************!*\
  !*** ./libs/common/src/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./types */ "./libs/common/src/types/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./redis */ "./libs/common/src/redis/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./guards */ "./libs/common/src/guards/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./strategies */ "./libs/common/src/strategies/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./database */ "./libs/common/src/database/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./middleware */ "./libs/common/src/middleware/index.ts"), exports);


/***/ }),

/***/ "./libs/common/src/middleware/index.ts":
/*!*********************************************!*\
  !*** ./libs/common/src/middleware/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./socket-io.middleware */ "./libs/common/src/middleware/socket-io.middleware.ts"), exports);


/***/ }),

/***/ "./libs/common/src/middleware/socket-io.middleware.ts":
/*!************************************************************!*\
  !*** ./libs/common/src/middleware/socket-io.middleware.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketAuthMiddleware = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
function SocketAuthMiddleware() {
    return (client, next) => {
        try {
            common_1.WsJwtGuard.validateToken(client);
            next();
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    };
}
exports.SocketAuthMiddleware = SocketAuthMiddleware;


/***/ }),

/***/ "./libs/common/src/redis/index.ts":
/*!****************************************!*\
  !*** ./libs/common/src/redis/index.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./redis.module */ "./libs/common/src/redis/redis.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./redis.service */ "./libs/common/src/redis/redis.service.ts"), exports);


/***/ }),

/***/ "./libs/common/src/redis/redis.module.ts":
/*!***********************************************!*\
  !*** ./libs/common/src/redis/redis.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const redis_service_1 = __webpack_require__(/*! ./redis.service */ "./libs/common/src/redis/redis.service.ts");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService],
    })
], RedisModule);


/***/ }),

/***/ "./libs/common/src/redis/redis.service.ts":
/*!************************************************!*\
  !*** ./libs/common/src/redis/redis.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const ioredis_1 = __webpack_require__(/*! ioredis */ "ioredis");
let RedisService = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.client = new ioredis_1.default({
            host: this.configService.get('REDIS_URL'),
            port: Number(this.configService.get('REDIS_PORT')),
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });
    }
    async setKey(key, expire, value) {
        await this.client.setex(key, expire, value);
    }
    async getValue(key) {
        return await this.client.get(key);
    }
    async deleteKey(key) {
        return await this.client.del(key);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RedisService);


/***/ }),

/***/ "./libs/common/src/strategies/google.strategy.ts":
/*!*******************************************************!*\
  !*** ./libs/common/src/strategies/google.strategy.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleStrategy = void 0;
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_google_oauth20_1 = __webpack_require__(/*! passport-google-oauth20 */ "passport-google-oauth20");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, emails, photos } = profile;
        const { givenName, familyName } = profile.name || {};
        const payload = {
            googleId: id,
            email: emails[0].value,
            name: `${givenName} ${familyName}`,
            picture: photos[0].value,
            accessToken,
        };
        done(null, payload);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], GoogleStrategy);


/***/ }),

/***/ "./libs/common/src/strategies/index.ts":
/*!*********************************************!*\
  !*** ./libs/common/src/strategies/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./jwt.strategy */ "./libs/common/src/strategies/jwt.strategy.ts"), exports);
__exportStar(__webpack_require__(/*! ./refreshToken-strategy */ "./libs/common/src/strategies/refreshToken-strategy.ts"), exports);
__exportStar(__webpack_require__(/*! ./google.strategy */ "./libs/common/src/strategies/google.strategy.ts"), exports);


/***/ }),

/***/ "./libs/common/src/strategies/jwt.strategy.ts":
/*!****************************************************!*\
  !*** ./libs/common/src/strategies/jwt.strategy.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    return request.cookies?.access_token;
                },
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: configService.get('AT_SECRET'),
            ignoreExpiration: false,
        });
    }
    async validate(payload) {
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./libs/common/src/strategies/refreshToken-strategy.ts":
/*!*************************************************************!*\
  !*** ./libs/common/src/strategies/refreshToken-strategy.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshJwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
let RefreshJwtStrategy = class RefreshJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.refresh_token;
                },
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.RT_SECRET,
            ignoreExpiration: false,
        });
    }
    async validate(payload) {
        return payload;
    }
};
exports.RefreshJwtStrategy = RefreshJwtStrategy;
exports.RefreshJwtStrategy = RefreshJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RefreshJwtStrategy);


/***/ }),

/***/ "./libs/common/src/types/auth/auth.ts":
/*!********************************************!*\
  !*** ./libs/common/src/types/auth/auth.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AUTH_SERVICE_NAME = exports.AuthServiceControllerMethods = exports.AUTH_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "auth";
exports.AUTH_PACKAGE_NAME = "auth";
function AuthServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = [
            "signin",
            "signup",
            "validate",
            "confirmOtp",
            "refreshToken",
            "profile",
            "getEmail",
            "googleLogin",
            "forgotPassword",
            "resetPassword",
        ];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("AuthService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("AuthService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.AuthServiceControllerMethods = AuthServiceControllerMethods;
exports.AUTH_SERVICE_NAME = "AuthService";


/***/ }),

/***/ "./libs/common/src/types/auth/google-payload.type.ts":
/*!***********************************************************!*\
  !*** ./libs/common/src/types/auth/google-payload.type.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/src/types/auth/index.ts":
/*!*********************************************!*\
  !*** ./libs/common/src/types/auth/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./jwt-payload.type */ "./libs/common/src/types/auth/jwt-payload.type.ts"), exports);
__exportStar(__webpack_require__(/*! ./token.type */ "./libs/common/src/types/auth/token.type.ts"), exports);
__exportStar(__webpack_require__(/*! ./auth */ "./libs/common/src/types/auth/auth.ts"), exports);
__exportStar(__webpack_require__(/*! ./google-payload.type */ "./libs/common/src/types/auth/google-payload.type.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/auth/jwt-payload.type.ts":
/*!********************************************************!*\
  !*** ./libs/common/src/types/auth/jwt-payload.type.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/src/types/auth/token.type.ts":
/*!**************************************************!*\
  !*** ./libs/common/src/types/auth/token.type.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/src/types/exchange/exchange.ts":
/*!****************************************************!*\
  !*** ./libs/common/src/types/exchange/exchange.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EXCHANGE_SERVICE_NAME = exports.ExchangeServiceControllerMethods = exports.EXCHANGE_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "exchange";
exports.EXCHANGE_PACKAGE_NAME = "exchange";
function ExchangeServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = [
            "validateKey",
            "balance",
            "createLimitBuy",
            "createLimitSell",
            "closePosition",
            "sendUserId",
        ];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("ExchangeService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("ExchangeService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.ExchangeServiceControllerMethods = ExchangeServiceControllerMethods;
exports.EXCHANGE_SERVICE_NAME = "ExchangeService";


/***/ }),

/***/ "./libs/common/src/types/exchange/index.ts":
/*!*************************************************!*\
  !*** ./libs/common/src/types/exchange/index.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./exchange */ "./libs/common/src/types/exchange/exchange.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/index.ts":
/*!****************************************!*\
  !*** ./libs/common/src/types/index.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyUserId = exports.KeyResponse = exports.CreateKeyDto = exports.PREDICT_PACKAGE_NAME = exports.PREDICT_SERVICE_NAME = exports.PredictServiceClient = exports.SendUserIdDto = exports.ExchangeServiceControllerMethods = exports.ExchangeServiceController = exports.ExchangeServiceClient = exports.EXCHANGE_SERVICE_NAME = exports.EXCHANGE_PACKAGE_NAME = exports.ExchangeResponse = exports.BalanceDto = exports.BalanceResponse = exports.ValidateKeyDto = exports.MAIL_PACKAGE_NAME = exports.MAIL_SERVICE_NAME = exports.MailServiceControllerMethods = exports.MailServiceController = exports.MailServiceClient = exports.SendMailDto = exports.MailResponse = exports.ForgotPasswordDto = exports.ResetPasswordDto = exports.GoogleLoginDto = exports.GetEmailDto = exports.ProfileResponse = exports.ProfileDto = exports.Tokens = exports.JwtPayload = exports.EmailResponse = exports.ConfirmOTPDto = exports.AUTH_PACKAGE_NAME = exports.AUTH_SERVICE_NAME = exports.AuthServiceControllerMethods = exports.AuthServiceController = exports.AuthServiceClient = exports.ValidateDto = exports.SignupDto = exports.SigninDto = exports.UserResponse = exports.TokenResponse = exports.ORDERS_SERVICE_NAME = exports.OrdersServiceControllerMethods = exports.OrdersServiceController = exports.OrdersServiceClient = exports.ORDERS_PACKAGE_NAME = exports.OrderResponse = exports.OrdersDto = void 0;
exports.KeyServiceControllerMethods = exports.KeyServiceController = exports.KeyServiceClient = exports.KEY_SERVICE_NAME = exports.KEY_PACKAGE_NAME = void 0;
__exportStar(__webpack_require__(/*! ./notifications */ "./libs/common/src/types/notifications/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./status */ "./libs/common/src/types/status/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./response.type */ "./libs/common/src/types/response.type.ts"), exports);
var orders_1 = __webpack_require__(/*! ./orders */ "./libs/common/src/types/orders/index.ts");
Object.defineProperty(exports, "OrdersDto", ({ enumerable: true, get: function () { return orders_1.OrdersDto; } }));
Object.defineProperty(exports, "OrderResponse", ({ enumerable: true, get: function () { return orders_1.OrderResponse; } }));
Object.defineProperty(exports, "ORDERS_PACKAGE_NAME", ({ enumerable: true, get: function () { return orders_1.ORDERS_PACKAGE_NAME; } }));
Object.defineProperty(exports, "OrdersServiceClient", ({ enumerable: true, get: function () { return orders_1.OrdersServiceClient; } }));
Object.defineProperty(exports, "OrdersServiceController", ({ enumerable: true, get: function () { return orders_1.OrdersServiceController; } }));
Object.defineProperty(exports, "OrdersServiceControllerMethods", ({ enumerable: true, get: function () { return orders_1.OrdersServiceControllerMethods; } }));
Object.defineProperty(exports, "ORDERS_SERVICE_NAME", ({ enumerable: true, get: function () { return orders_1.ORDERS_SERVICE_NAME; } }));
var auth_1 = __webpack_require__(/*! ./auth */ "./libs/common/src/types/auth/index.ts");
Object.defineProperty(exports, "TokenResponse", ({ enumerable: true, get: function () { return auth_1.TokenResponse; } }));
Object.defineProperty(exports, "UserResponse", ({ enumerable: true, get: function () { return auth_1.UserResponse; } }));
Object.defineProperty(exports, "SigninDto", ({ enumerable: true, get: function () { return auth_1.SigninDto; } }));
Object.defineProperty(exports, "SignupDto", ({ enumerable: true, get: function () { return auth_1.SignupDto; } }));
Object.defineProperty(exports, "ValidateDto", ({ enumerable: true, get: function () { return auth_1.ValidateDto; } }));
Object.defineProperty(exports, "AuthServiceClient", ({ enumerable: true, get: function () { return auth_1.AuthServiceClient; } }));
Object.defineProperty(exports, "AuthServiceController", ({ enumerable: true, get: function () { return auth_1.AuthServiceController; } }));
Object.defineProperty(exports, "AuthServiceControllerMethods", ({ enumerable: true, get: function () { return auth_1.AuthServiceControllerMethods; } }));
Object.defineProperty(exports, "AUTH_SERVICE_NAME", ({ enumerable: true, get: function () { return auth_1.AUTH_SERVICE_NAME; } }));
Object.defineProperty(exports, "AUTH_PACKAGE_NAME", ({ enumerable: true, get: function () { return auth_1.AUTH_PACKAGE_NAME; } }));
Object.defineProperty(exports, "ConfirmOTPDto", ({ enumerable: true, get: function () { return auth_1.ConfirmOTPDto; } }));
Object.defineProperty(exports, "EmailResponse", ({ enumerable: true, get: function () { return auth_1.EmailResponse; } }));
Object.defineProperty(exports, "JwtPayload", ({ enumerable: true, get: function () { return auth_1.JwtPayload; } }));
Object.defineProperty(exports, "Tokens", ({ enumerable: true, get: function () { return auth_1.Tokens; } }));
Object.defineProperty(exports, "ProfileDto", ({ enumerable: true, get: function () { return auth_1.ProfileDto; } }));
Object.defineProperty(exports, "ProfileResponse", ({ enumerable: true, get: function () { return auth_1.ProfileResponse; } }));
Object.defineProperty(exports, "GetEmailDto", ({ enumerable: true, get: function () { return auth_1.GetEmailDto; } }));
Object.defineProperty(exports, "GoogleLoginDto", ({ enumerable: true, get: function () { return auth_1.GoogleLoginDto; } }));
Object.defineProperty(exports, "ResetPasswordDto", ({ enumerable: true, get: function () { return auth_1.ResetPasswordDto; } }));
Object.defineProperty(exports, "ForgotPasswordDto", ({ enumerable: true, get: function () { return auth_1.ForgotPasswordDto; } }));
Object.defineProperty(exports, "MailResponse", ({ enumerable: true, get: function () { return auth_1.MailResponse; } }));
var mail_1 = __webpack_require__(/*! ./mail */ "./libs/common/src/types/mail/index.ts");
Object.defineProperty(exports, "SendMailDto", ({ enumerable: true, get: function () { return mail_1.SendMailDto; } }));
Object.defineProperty(exports, "MailServiceClient", ({ enumerable: true, get: function () { return mail_1.MailServiceClient; } }));
Object.defineProperty(exports, "MailServiceController", ({ enumerable: true, get: function () { return mail_1.MailServiceController; } }));
Object.defineProperty(exports, "MailServiceControllerMethods", ({ enumerable: true, get: function () { return mail_1.MailServiceControllerMethods; } }));
Object.defineProperty(exports, "MAIL_SERVICE_NAME", ({ enumerable: true, get: function () { return mail_1.MAIL_SERVICE_NAME; } }));
Object.defineProperty(exports, "MAIL_PACKAGE_NAME", ({ enumerable: true, get: function () { return mail_1.MAIL_PACKAGE_NAME; } }));
var exchange_1 = __webpack_require__(/*! ./exchange */ "./libs/common/src/types/exchange/index.ts");
Object.defineProperty(exports, "ValidateKeyDto", ({ enumerable: true, get: function () { return exchange_1.ValidateKeyDto; } }));
Object.defineProperty(exports, "BalanceResponse", ({ enumerable: true, get: function () { return exchange_1.BalanceResponse; } }));
Object.defineProperty(exports, "BalanceDto", ({ enumerable: true, get: function () { return exchange_1.BalanceDto; } }));
Object.defineProperty(exports, "ExchangeResponse", ({ enumerable: true, get: function () { return exchange_1.ExchangeResponse; } }));
Object.defineProperty(exports, "EXCHANGE_PACKAGE_NAME", ({ enumerable: true, get: function () { return exchange_1.EXCHANGE_PACKAGE_NAME; } }));
Object.defineProperty(exports, "EXCHANGE_SERVICE_NAME", ({ enumerable: true, get: function () { return exchange_1.EXCHANGE_SERVICE_NAME; } }));
Object.defineProperty(exports, "ExchangeServiceClient", ({ enumerable: true, get: function () { return exchange_1.ExchangeServiceClient; } }));
Object.defineProperty(exports, "ExchangeServiceController", ({ enumerable: true, get: function () { return exchange_1.ExchangeServiceController; } }));
Object.defineProperty(exports, "ExchangeServiceControllerMethods", ({ enumerable: true, get: function () { return exchange_1.ExchangeServiceControllerMethods; } }));
Object.defineProperty(exports, "SendUserIdDto", ({ enumerable: true, get: function () { return exchange_1.SendUserIdDto; } }));
var predict_1 = __webpack_require__(/*! ./predict */ "./libs/common/src/types/predict/index.ts");
Object.defineProperty(exports, "PredictServiceClient", ({ enumerable: true, get: function () { return predict_1.PredictServiceClient; } }));
Object.defineProperty(exports, "PREDICT_SERVICE_NAME", ({ enumerable: true, get: function () { return predict_1.PREDICT_SERVICE_NAME; } }));
Object.defineProperty(exports, "PREDICT_PACKAGE_NAME", ({ enumerable: true, get: function () { return predict_1.PREDICT_PACKAGE_NAME; } }));
var key_1 = __webpack_require__(/*! ./key */ "./libs/common/src/types/key/index.ts");
Object.defineProperty(exports, "CreateKeyDto", ({ enumerable: true, get: function () { return key_1.CreateKeyDto; } }));
Object.defineProperty(exports, "KeyResponse", ({ enumerable: true, get: function () { return key_1.KeyResponse; } }));
Object.defineProperty(exports, "KeyUserId", ({ enumerable: true, get: function () { return key_1.KeyUserId; } }));
Object.defineProperty(exports, "KEY_PACKAGE_NAME", ({ enumerable: true, get: function () { return key_1.KEY_PACKAGE_NAME; } }));
Object.defineProperty(exports, "KEY_SERVICE_NAME", ({ enumerable: true, get: function () { return key_1.KEY_SERVICE_NAME; } }));
Object.defineProperty(exports, "KeyServiceClient", ({ enumerable: true, get: function () { return key_1.KeyServiceClient; } }));
Object.defineProperty(exports, "KeyServiceController", ({ enumerable: true, get: function () { return key_1.KeyServiceController; } }));
Object.defineProperty(exports, "KeyServiceControllerMethods", ({ enumerable: true, get: function () { return key_1.KeyServiceControllerMethods; } }));


/***/ }),

/***/ "./libs/common/src/types/key/index.ts":
/*!********************************************!*\
  !*** ./libs/common/src/types/key/index.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./key */ "./libs/common/src/types/key/key.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/key/key.ts":
/*!******************************************!*\
  !*** ./libs/common/src/types/key/key.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KEY_SERVICE_NAME = exports.KeyServiceControllerMethods = exports.KEY_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "key";
exports.KEY_PACKAGE_NAME = "key";
function KeyServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["createKey", "getKey"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("KeyService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("KeyService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.KeyServiceControllerMethods = KeyServiceControllerMethods;
exports.KEY_SERVICE_NAME = "KeyService";


/***/ }),

/***/ "./libs/common/src/types/mail/index.ts":
/*!*********************************************!*\
  !*** ./libs/common/src/types/mail/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./mail */ "./libs/common/src/types/mail/mail.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/mail/mail.ts":
/*!********************************************!*\
  !*** ./libs/common/src/types/mail/mail.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MAIL_SERVICE_NAME = exports.MailServiceControllerMethods = exports.MAIL_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "mail";
exports.MAIL_PACKAGE_NAME = "mail";
function MailServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["sendMail"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("MailService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("MailService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.MailServiceControllerMethods = MailServiceControllerMethods;
exports.MAIL_SERVICE_NAME = "MailService";


/***/ }),

/***/ "./libs/common/src/types/notifications/index.ts":
/*!******************************************************!*\
  !*** ./libs/common/src/types/notifications/index.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./notification */ "./libs/common/src/types/notifications/notification.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/notifications/notification.ts":
/*!*************************************************************!*\
  !*** ./libs/common/src/types/notifications/notification.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/src/types/orders/index.ts":
/*!***********************************************!*\
  !*** ./libs/common/src/types/orders/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./orders */ "./libs/common/src/types/orders/orders.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/orders/orders.ts":
/*!************************************************!*\
  !*** ./libs/common/src/types/orders/orders.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ORDERS_SERVICE_NAME = exports.OrdersServiceControllerMethods = exports.ORDERS_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "orders";
exports.ORDERS_PACKAGE_NAME = "orders";
function OrdersServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["createOrder"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("OrdersService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("OrdersService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.OrdersServiceControllerMethods = OrdersServiceControllerMethods;
exports.ORDERS_SERVICE_NAME = "OrdersService";


/***/ }),

/***/ "./libs/common/src/types/predict/index.ts":
/*!************************************************!*\
  !*** ./libs/common/src/types/predict/index.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./predict */ "./libs/common/src/types/predict/predict.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/predict/predict.ts":
/*!**************************************************!*\
  !*** ./libs/common/src/types/predict/predict.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PREDICT_SERVICE_NAME = exports.PredictServiceControllerMethods = exports.PREDICT_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
exports.protobufPackage = "predict";
exports.PREDICT_PACKAGE_NAME = "predict";
function PredictServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["predict", "deleteall", "update", "plot", "getData"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("PredictService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("PredictService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.PredictServiceControllerMethods = PredictServiceControllerMethods;
exports.PREDICT_SERVICE_NAME = "PredictService";


/***/ }),

/***/ "./libs/common/src/types/response.type.ts":
/*!************************************************!*\
  !*** ./libs/common/src/types/response.type.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/src/types/status/index.ts":
/*!***********************************************!*\
  !*** ./libs/common/src/types/status/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ok.type */ "./libs/common/src/types/status/ok.type.ts"), exports);


/***/ }),

/***/ "./libs/common/src/types/status/ok.type.ts":
/*!*************************************************!*\
  !*** ./libs/common/src/types/status/ok.type.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "@elastic/elasticsearch":
/*!*****************************************!*\
  !*** external "@elastic/elasticsearch" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@elastic/elasticsearch");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/elasticsearch":
/*!****************************************!*\
  !*** external "@nestjs/elasticsearch" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/elasticsearch");

/***/ }),

/***/ "@nestjs/microservices":
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "amqp-connection-manager":
/*!******************************************!*\
  !*** external "amqp-connection-manager" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("amqp-connection-manager");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "ioredis":
/*!**************************!*\
  !*** external "ioredis" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "kafkajs":
/*!**************************!*\
  !*** external "kafkajs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("kafkajs");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "nestjs-grpc-exceptions":
/*!*****************************************!*\
  !*** external "nestjs-grpc-exceptions" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("nestjs-grpc-exceptions");

/***/ }),

/***/ "passport-google-oauth20":
/*!******************************************!*\
  !*** external "passport-google-oauth20" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("passport-google-oauth20");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************************!*\
  !*** ./apps/gateway/src/main.ts ***!
  \**********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/gateway/src/app.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const throttler_exception_filter_1 = __webpack_require__(/*! ./utils/throttler-exception.filter */ "./apps/gateway/src/utils/throttler-exception.filter.ts");
const dotenv = __webpack_require__(/*! dotenv */ "dotenv");
const cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
dotenv.config();
async function bootstrap() {
    const configApp = await core_1.NestFactory.create(app_module_1.AppModule);
    let configService = configApp.get(config_1.ConfigService);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        allowedHeaders: ['Content-Type', '*'],
        origin: true,
        credentials: true,
    });
    app.useGlobalFilters(new throttler_exception_filter_1.ThrottlerExceptionFilter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    await app.listen(configService.get('PORT') || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

})();

/******/ })()
;