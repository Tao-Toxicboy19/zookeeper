/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/auth/src/auth.controller.ts":
/*!******************************************!*\
  !*** ./apps/auth/src/auth.controller.ts ***!
  \******************************************/
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
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/auth/src/auth.service.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const users_service_1 = __webpack_require__(/*! ./users/users.service */ "./apps/auth/src/users/users.service.ts");
const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    signup(request) {
        return this.authService.signup(request);
    }
    signin(request) {
        return this.authService.signin(request);
    }
    validate(request) {
        return this.authService.validateUser(request);
    }
    refreshToken(request) {
        return this.authService.refreshToken({
            username: request.username,
            sub: request.userId,
        });
    }
    confirmOtp(request) {
        return this.authService.confirmOTP(request);
    }
    async profile(request) {
        const user = await this.userService.findOneByUsername(request.username);
        return {
            userId: new mongodb_1.ObjectId(user._id).toHexString(),
            username: user.username,
            email: user.email,
            picture: user.picture,
            name: user.name,
        };
    }
    async getEmail(request) {
        return this.userService.getEmail(request.userId);
    }
    googleLogin(request) {
        return this.authService.googleLogin(request);
    }
    forgotPassword(request) {
        return this.authService.forgotPassword(request.email);
    }
    resetPassword(request) {
        return this.authService.resetPassword(request.token, request.password);
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    (0, common_2.AuthServiceControllerMethods)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], AuthController);


/***/ }),

/***/ "./apps/auth/src/auth.module.ts":
/*!**************************************!*\
  !*** ./apps/auth/src/auth.module.ts ***!
  \**************************************/
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
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/auth/src/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/auth/src/auth.service.ts");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const producer_module_1 = __webpack_require__(/*! ./producer/producer.module */ "./apps/auth/src/producer/producer.module.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./apps/auth/src/users/users.module.ts");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: './apps/auth/.env',
            }),
            producer_module_1.ProducerModule,
            common_2.RedisModule,
            users_module_1.UsersModule,
            common_2.DatabaseModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: core_1.APP_FILTER,
                useClass: nestjs_grpc_exceptions_1.GrpcServerExceptionFilter,
            },
        ],
    })
], AuthModule);


/***/ }),

/***/ "./apps/auth/src/auth.service.ts":
/*!***************************************!*\
  !*** ./apps/auth/src/auth.service.ts ***!
  \***************************************/
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
var AuthService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const producer_service_1 = __webpack_require__(/*! ./producer/producer.service */ "./apps/auth/src/producer/producer.service.ts");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const users_service_1 = __webpack_require__(/*! ./users/users.service */ "./apps/auth/src/users/users.service.ts");
const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, configService, producerService, redisService, userService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.producerService = producerService;
        this.redisService = redisService;
        this.userService = userService;
        this.logger = new common_2.Logger(AuthService_1.name);
        this.otpMailQueue = 'otp_mail_queue';
        this.resetPasswordQueue = 'reset_password_queue';
    }
    onModuleInit() {
    }
    async validateUser(dto) {
        const user = await this.userService.findOneByUsername(dto.username);
        if (user && (await bcrypt.compare(dto.password, user.password))) {
            return {
                username: user.username,
                sub: new mongodb_1.ObjectId(user._id).toHexString(),
            };
        }
        throw new nestjs_grpc_exceptions_1.GrpcNotFoundException('Invalid username or password');
    }
    async signin(dto) {
        const user = await this.userService.findOneByUsername(dto.username);
        if (!user) {
            throw new nestjs_grpc_exceptions_1.GrpcNotFoundException('User not found');
        }
        await this.producerService.handleSendTask(this.otpMailQueue, JSON.stringify(user));
        return {
            email: user.email,
        };
    }
    async signup(dto) {
        const existUser = await this.userService.findOneByUsername(dto.username);
        const existEmail = await this.userService.findOneByEmail(dto.email);
        if (existEmail) {
            throw new nestjs_grpc_exceptions_1.GrpcAlreadyExistsException('Email already exists.');
        }
        if (existUser) {
            throw new nestjs_grpc_exceptions_1.GrpcAlreadyExistsException('User already exists.');
        }
        const userInRedis = await this.redisService.getValue(dto.username);
        if (userInRedis) {
            throw new nestjs_grpc_exceptions_1.GrpcAlreadyExistsException('Username already exists in cache.');
        }
        const _id = new mongoose_1.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const userCache = JSON.stringify({ ...dto, _id, password: hashedPassword });
        await this.producerService.handleSendTask(this.otpMailQueue, userCache);
        await this.redisService.setKey(dto.username, 600, userCache);
        return {
            email: dto.email,
            userId: new mongodb_1.ObjectId(_id).toHexString(),
        };
    }
    async confirmOTP(dto) {
        const userCache = await this.redisService.getValue(dto.userId);
        if (!userCache) {
            throw new nestjs_grpc_exceptions_1.GrpcNotFoundException('User not found.');
        }
        const user = JSON.parse(userCache);
        if (dto.otp !== user.otp) {
            throw new nestjs_grpc_exceptions_1.GrpcInvalidArgumentException('OTP invalid.');
        }
        const { accessToken, refreshToken } = await this.getTokens(dto.userId, user.username);
        await Promise.all([
            this.redisService.deleteKey(dto.userId),
            this.redisService.deleteKey(user.username),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async googleLogin(dto) {
        let user = await this.userService.findOneByEmail(dto.email);
        if (!user) {
            const _id = new mongoose_1.Types.ObjectId();
            user = await this.userService.createUser({
                _id,
                email: dto.email,
                name: dto.name,
                picture: dto.picture,
                username: dto.email,
                googleId: dto.googleId,
            });
        }
        const { accessToken, refreshToken } = await this.getTokens(new mongodb_1.ObjectId(user._id).toHexString(), user.email);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(user) {
        const tokens = await this.getTokens(user.sub, user.username);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async getTokens(userId, username) {
        const jwtPayload = {
            sub: userId,
            username: username,
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get('AT_SECRET'),
                expiresIn: '1d',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get('RT_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
    }
    async forgotPassword(email) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new nestjs_grpc_exceptions_1.GrpcNotFoundException('User not found');
        }
        const token = (0, crypto_1.randomUUID)();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.userService.update(user);
        const payload = {
            token,
            email: user.email,
        };
        await this.producerService.handleSendTask(this.resetPasswordQueue, JSON.stringify(payload));
    }
    async resetPassword(token, newPassword) {
        const user = await this.userService.findOneByResetPasswordToken(token);
        if (!user || user.resetPasswordExpires < new Date()) {
            throw new nestjs_grpc_exceptions_1.GrpcInvalidArgumentException('Password reset token is invalid or has expired');
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userService.update(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof producer_service_1.ProducerService !== "undefined" && producer_service_1.ProducerService) === "function" ? _c : Object, typeof (_d = typeof common_1.RedisService !== "undefined" && common_1.RedisService) === "function" ? _d : Object, typeof (_e = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _e : Object])
], AuthService);


/***/ }),

/***/ "./apps/auth/src/producer/producer.module.ts":
/*!***************************************************!*\
  !*** ./apps/auth/src/producer/producer.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const producer_service_1 = __webpack_require__(/*! ./producer.service */ "./apps/auth/src/producer/producer.service.ts");
let ProducerModule = class ProducerModule {
};
exports.ProducerModule = ProducerModule;
exports.ProducerModule = ProducerModule = __decorate([
    (0, common_1.Module)({
        providers: [producer_service_1.ProducerService],
        exports: [producer_service_1.ProducerService],
    })
], ProducerModule);


/***/ }),

/***/ "./apps/auth/src/producer/producer.service.ts":
/*!****************************************************!*\
  !*** ./apps/auth/src/producer/producer.service.ts ***!
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
var ProducerService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProducerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const amqp_connection_manager_1 = __webpack_require__(/*! amqp-connection-manager */ "amqp-connection-manager");
let ProducerService = ProducerService_1 = class ProducerService {
    constructor(configService) {
        this.configService = configService;
        this.otpMailQueue = 'otp_mail_queue';
        this.logger = new common_1.Logger(ProducerService_1.name);
        const connection = amqp_connection_manager_1.default.connect([
            this.configService.get('RABBITMQ_URL'),
        ]);
        this.channelWrapper = connection.createChannel({
            setup: async (channel) => {
                Promise.all([
                    channel.assertQueue(this.otpMailQueue, { durable: true }),
                ]);
            },
        });
        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ');
        });
        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err);
        });
    }
    async handleSendTask(queue, msg) {
        await this.channelWrapper.addSetup(async (channel) => {
            return channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true,
            });
        });
    }
};
exports.ProducerService = ProducerService;
exports.ProducerService = ProducerService = ProducerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], ProducerService);


/***/ }),

/***/ "./apps/auth/src/users/schemas/user.schemas.ts":
/*!*****************************************************!*\
  !*** ./apps/auth/src/users/schemas/user.schemas.ts ***!
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let User = class User extends common_1.AbstractDocument {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], User.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "picture", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now, required: false }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], User.prototype, "daletedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),

/***/ "./apps/auth/src/users/user.repository.ts":
/*!************************************************!*\
  !*** ./apps/auth/src/users/user.repository.ts ***!
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
var UsersRepository_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const user_schemas_1 = __webpack_require__(/*! ./schemas/user.schemas */ "./apps/auth/src/users/schemas/user.schemas.ts");
let UsersRepository = UsersRepository_1 = class UsersRepository extends common_2.AbstractRepository {
    constructor(userModel, connection) {
        super(userModel, connection);
        this.logger = new common_1.Logger(UsersRepository_1.name);
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = UsersRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schemas_1.User.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Connection !== "undefined" && mongoose_2.Connection) === "function" ? _b : Object])
], UsersRepository);


/***/ }),

/***/ "./apps/auth/src/users/users.module.ts":
/*!*********************************************!*\
  !*** ./apps/auth/src/users/users.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/auth/src/users/users.service.ts");
const user_schemas_1 = __webpack_require__(/*! ./schemas/user.schemas */ "./apps/auth/src/users/schemas/user.schemas.ts");
const user_repository_1 = __webpack_require__(/*! ./user.repository */ "./apps/auth/src/users/user.repository.ts");
const producer_module_1 = __webpack_require__(/*! ../producer/producer.module */ "./apps/auth/src/producer/producer.module.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schemas_1.User.name, schema: user_schemas_1.UserSchema }]),
            producer_module_1.ProducerModule,
        ],
        providers: [users_service_1.UsersService, user_repository_1.UsersRepository],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./apps/auth/src/users/users.service.ts":
/*!**********************************************!*\
  !*** ./apps/auth/src/users/users.service.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_repository_1 = __webpack_require__(/*! ./user.repository */ "./apps/auth/src/users/user.repository.ts");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(dto) {
        try {
            return await this.usersRepository.create({
                _id: dto._id,
                email: dto.email,
                createdAt: new Date(),
                googleId: dto.googleId,
                name: dto.name,
                picture: dto.picture,
                username: dto.username || undefined,
                password: dto.password || undefined
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getEmail(userId) {
        try {
            const { email } = await this.usersRepository.findOne({
                _id: userId,
            });
            return { email };
        }
        catch (error) {
            throw error;
        }
    }
    async findOneByEmail(email) {
        return await this.usersRepository.findOne({ email });
    }
    async findOneByUsername(username) {
        return await this.usersRepository.findOne({ username });
    }
    async update({ _id, resetPasswordToken, resetPasswordExpires, password, }) {
        await this.usersRepository.upsert({ _id }, {
            resetPasswordToken,
            resetPasswordExpires,
            password,
        });
    }
    findOneByResetPasswordToken(token) {
        return this.usersRepository.findOne({ resetPasswordToken: token });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UsersRepository !== "undefined" && user_repository_1.UsersRepository) === "function" ? _a : Object])
], UsersService);


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
        const grpcMethods = ["validateKey", "balance", "createLimitBuy", "createLimitSell", "closePosition"];
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
exports.KEY_PACKAGE_NAME = exports.KeyUserId = exports.KeyResponse = exports.CreateKeyDto = exports.PREDICT_PACKAGE_NAME = exports.PREDICT_SERVICE_NAME = exports.PredictServiceClient = exports.ExchangeServiceControllerMethods = exports.ExchangeServiceController = exports.ExchangeServiceClient = exports.EXCHANGE_SERVICE_NAME = exports.EXCHANGE_PACKAGE_NAME = exports.ExchangeResponse = exports.BalanceDto = exports.BalanceResponse = exports.ValidateKeyDto = exports.MAIL_PACKAGE_NAME = exports.MAIL_SERVICE_NAME = exports.MailServiceControllerMethods = exports.MailServiceController = exports.MailServiceClient = exports.SendMailDto = exports.MailResponse = exports.ForgotPasswordDto = exports.ResetPasswordDto = exports.GoogleLoginDto = exports.GetEmailDto = exports.ProfileResponse = exports.ProfileDto = exports.Tokens = exports.JwtPayload = exports.EmailResponse = exports.ConfirmOTPDto = exports.AUTH_PACKAGE_NAME = exports.AUTH_SERVICE_NAME = exports.AuthServiceControllerMethods = exports.AuthServiceController = exports.AuthServiceClient = exports.ValidateDto = exports.SignupDto = exports.SigninDto = exports.UserResponse = exports.TokenResponse = exports.ORDERS_SERVICE_NAME = exports.OrdersServiceControllerMethods = exports.OrdersServiceController = exports.OrdersServiceClient = exports.ORDERS_PACKAGE_NAME = exports.OrderResponse = exports.OrdersDto = void 0;
exports.KeyServiceControllerMethods = exports.KeyServiceController = exports.KeyServiceClient = exports.KEY_SERVICE_NAME = void 0;
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

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

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

/***/ "amqp-connection-manager":
/*!******************************************!*\
  !*** external "amqp-connection-manager" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("amqp-connection-manager");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

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

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

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
/*!*******************************!*\
  !*** ./apps/auth/src/main.ts ***!
  \*******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const auth_module_1 = __webpack_require__(/*! ./auth.module */ "./apps/auth/src/auth.module.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const path_1 = __webpack_require__(/*! path */ "path");
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
async function bootstrap() {
    const configApp = await core_1.NestFactory.create(auth_module_1.AuthModule);
    let configService = configApp.get(config_1.ConfigService);
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            protoPath: (0, path_1.join)(__dirname, '../auth.proto'),
            package: common_1.AUTH_PACKAGE_NAME,
            url: configService.get('GRPC_URL'),
        },
    });
    await app.listen();
    console.log("HELLO");
}
bootstrap();

})();

/******/ })()
;