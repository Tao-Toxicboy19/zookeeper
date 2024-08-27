/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/exchange/src/exchange.controller.ts":
/*!**************************************************!*\
  !*** ./apps/exchange/src/exchange.controller.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExchangeController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const exchange_service_1 = __webpack_require__(/*! ./exchange.service */ "./apps/exchange/src/exchange.service.ts");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
let ExchangeController = class ExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    validateKey(request) {
        return this.exchangeService.validateKey(request);
    }
    balance(request) {
        return this.exchangeService.balance(request);
    }
    createLimitBuy(request) {
        return this.exchangeService.createLimitBuyOrder({
            symbol: request.symbol,
            leverage: request.leverage,
            quantity: request.quantity,
            userId: request.userId,
            position: request.position,
        });
    }
    createLimitSell(request) {
        return this.exchangeService.createLimitSellOrder({
            symbol: request.symbol,
            leverage: request.leverage,
            quantity: request.quantity,
            userId: request.userId,
            position: request.position,
        });
    }
    closePosition(request) {
        return this.exchangeService.closePosition({
            symbol: request.symbol,
            leverage: request.leverage,
            quantity: request.quantity,
            userId: request.userId,
            position: request.position,
        });
    }
};
exports.ExchangeController = ExchangeController;
exports.ExchangeController = ExchangeController = __decorate([
    (0, common_1.Controller)(),
    (0, common_2.ExchangeServiceControllerMethods)(),
    __metadata("design:paramtypes", [typeof (_a = typeof exchange_service_1.ExchangeService !== "undefined" && exchange_service_1.ExchangeService) === "function" ? _a : Object])
], ExchangeController);


/***/ }),

/***/ "./apps/exchange/src/exchange.module.ts":
/*!**********************************************!*\
  !*** ./apps/exchange/src/exchange.module.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExchangeModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const exchange_controller_1 = __webpack_require__(/*! ./exchange.controller */ "./apps/exchange/src/exchange.controller.ts");
const exchange_service_1 = __webpack_require__(/*! ./exchange.service */ "./apps/exchange/src/exchange.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const common_2 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const path_1 = __webpack_require__(/*! path */ "path");
const rabbitmq_consumer_service_1 = __webpack_require__(/*! ./rabbitmq/rabbitmq-consumer.service */ "./apps/exchange/src/rabbitmq/rabbitmq-consumer.service.ts");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
let ExchangeModule = class ExchangeModule {
};
exports.ExchangeModule = ExchangeModule;
exports.ExchangeModule = ExchangeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: './apps/exchange/.env',
            }),
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
        controllers: [exchange_controller_1.ExchangeController],
        providers: [
            exchange_service_1.ExchangeService,
            rabbitmq_consumer_service_1.RabbitmqConsumerService,
            {
                provide: core_1.APP_FILTER,
                useClass: nestjs_grpc_exceptions_1.GrpcServerExceptionFilter,
            },
        ],
    })
], ExchangeModule);


/***/ }),

/***/ "./apps/exchange/src/exchange.service.ts":
/*!***********************************************!*\
  !*** ./apps/exchange/src/exchange.service.ts ***!
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
var ExchangeService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExchangeService = void 0;
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const ccxt = __webpack_require__(/*! ccxt */ "ccxt");
const nestjs_grpc_exceptions_1 = __webpack_require__(/*! nestjs-grpc-exceptions */ "nestjs-grpc-exceptions");
let ExchangeService = ExchangeService_1 = class ExchangeService {
    constructor(keyClient, client) {
        this.keyClient = keyClient;
        this.client = client;
        this.long = 'LONG';
        this.short = 'SHORT';
        this.logger = new common_2.Logger(ExchangeService_1.name);
    }
    async onModuleInit() {
        this.keyServiceClient =
            this.keyClient.getService(common_1.KEY_SERVICE_NAME);
    }
    async query(userId) {
        return new Promise((resolve, reject) => {
            this.client
                .send('query_order', { user_id: userId })
                .subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            });
        });
    }
    async position({ userId }) {
        try {
            const orders = await this.query(userId);
            if (!orders || !orders.length) {
                return {
                    status: 'error',
                    message: 'Not found orders.',
                };
            }
            const { apiKey, secretKey } = await this.getApiKeys(userId);
            if (!apiKey || !secretKey) {
                return {
                    status: 'error',
                    message: 'Not fond API key or secret key.',
                };
            }
            await this.createExchange({
                apiKey,
                secretKey,
            });
            const position = await this.exchange.fetchPositions(orders.map((item) => item.symbol));
            return {
                status: 'success',
                message: position,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async createExchange(dto) {
        this.exchange = new ccxt.binance({
            apiKey: dto.apiKey,
            secret: dto.secretKey,
            enableRateLimit: true,
            options: {
                defaultType: 'future',
            },
        });
    }
    async getApiKeys(userId) {
        return new Promise((resolve, reject) => {
            this.keyServiceClient.getKey({ userId }).subscribe({
                next: (response) => resolve({
                    apiKey: response.apiKey,
                    secretKey: response.secretKey,
                }),
                error: (err) => reject(err),
            });
        });
    }
    async validateKey(dto) {
        try {
            await this.createExchange(dto);
            await this.exchange.fetchBalance({ type: 'future' });
            return {
                statusCode: common_2.HttpStatus.OK,
                message: 'OK',
            };
        }
        catch (error) {
            return {
                statusCode: common_2.HttpStatus.BAD_REQUEST,
                message: 'API key or Secret key invalid.',
            };
        }
    }
    async balance(dto) {
        try {
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId);
            if (!apiKey || !secretKey) {
                return {
                    statusCode: common_2.HttpStatus.BAD_REQUEST,
                    message: 'not found API Key or Secret Key',
                };
            }
            await this.createExchange({ apiKey, secretKey });
            const accountInfo = await this.exchange.fetchBalance({
                type: 'future',
            });
            const usdt = accountInfo.info['maxWithdrawAmount'];
            return {
                statusCode: common_2.HttpStatus.OK,
                message: 'OK',
                usdt,
            };
        }
        catch (error) {
            return {
                statusCode: common_2.HttpStatus.BAD_REQUEST,
                message: 'Invalid API Key or Secret Key',
            };
        }
    }
    async createLimitBuyOrder(dto) {
        try {
            this.logger.debug('start long Process open position');
            if (!dto.userId) {
                throw new nestjs_grpc_exceptions_1.GrpcUnavailableException('Not found user.');
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId);
            await this.createExchange({ apiKey, secretKey });
            await this.exchange.setLeverage(dto.leverage, dto.symbol);
            const price = await this.exchange.fetchTicker(dto.symbol);
            const quantity = (dto.quantity / price.last) * dto.leverage;
            await this.exchange.createLimitBuyOrder(dto.symbol, quantity, price.last, {
                positionSide: 'LONG',
            });
            this.logger.debug('OPEN long Position');
        }
        catch (error) {
            throw error;
        }
    }
    async createLimitSellOrder(dto) {
        try {
            this.logger.debug('start short Process open position');
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId);
            await this.createExchange({ apiKey, secretKey });
            await this.exchange.setLeverage(75, dto.symbol);
            const price = await this.exchange.fetchTicker(dto.symbol);
            const quantity = (dto.quantity / price.last) * dto.leverage;
            await this.exchange.createLimitSellOrder(dto.symbol, quantity, price.last, {
                positionSide: 'SHORT',
            });
            this.logger.debug('OPEN short Position');
        }
        catch (error) {
            throw error;
        }
    }
    async newClosePostion(dto) {
        try {
            this.logger.debug('start Process close position');
            if (!dto.userId) {
                return {
                    status: 'error',
                    message: 'Not found user.',
                };
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId);
            if (!apiKey || !secretKey) {
                return {
                    status: 'error',
                    message: 'Not found API key or secret key.',
                };
            }
            console.log(apiKey, secretKey);
            return {
                message: 'OK',
                status: 'success',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async closePosition(dto) {
        try {
            this.logger.debug('start Process close position');
            if (!dto.userId) {
                throw new nestjs_grpc_exceptions_1.GrpcUnavailableException('Not found user.');
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId);
            if (!apiKey || !secretKey) {
                throw new nestjs_grpc_exceptions_1.GrpcAlreadyExistsException('Not found API key or secret key.');
            }
            await this.createExchange({ apiKey, secretKey });
            const price = await this.exchange.fetchTicker(dto.symbol);
            const quantity = (dto.quantity / price.last) * dto.leverage;
            if (dto.position === 'Short') {
                await this.exchange.createMarketBuyOrder(dto.symbol, quantity, {
                    positionSide: 'SHORT',
                });
            }
            else if (dto.position === 'Long') {
                await this.exchange.createMarketSellOrder(dto.symbol, quantity, { positionSide: 'LONG' });
            }
            this.logger.debug('Close position OK');
        }
        catch (error) {
            throw error;
        }
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = ExchangeService_1 = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, common_2.Inject)(common_1.KEY_PACKAGE_NAME)),
    __param(1, (0, common_2.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientGrpc !== "undefined" && microservices_1.ClientGrpc) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _b : Object])
], ExchangeService);


/***/ }),

/***/ "./apps/exchange/src/rabbitmq/rabbitmq-consumer.service.ts":
/*!*****************************************************************!*\
  !*** ./apps/exchange/src/rabbitmq/rabbitmq-consumer.service.ts ***!
  \*****************************************************************/
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
var RabbitmqConsumerService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RabbitmqConsumerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const amqp_connection_manager_1 = __webpack_require__(/*! amqp-connection-manager */ "amqp-connection-manager");
const exchange_service_1 = __webpack_require__(/*! ../exchange.service */ "./apps/exchange/src/exchange.service.ts");
let RabbitmqConsumerService = RabbitmqConsumerService_1 = class RabbitmqConsumerService {
    constructor(configService, exchangeService) {
        this.configService = configService;
        this.exchangeService = exchangeService;
        this.logger = new common_1.Logger(RabbitmqConsumerService_1.name);
        const connection = amqp_connection_manager_1.default.connect([
            this.configService.get('RABBITMQ_URL'),
        ]);
        this.channelWrapper = connection.createChannel({
            setup: async (channel) => {
                await Promise.all([
                    channel.assertQueue('open-position-queue', {
                        durable: true,
                    }),
                    channel.assertQueue('close-position', {
                        durable: true,
                    }),
                    channel.assertExchange('usdt-exchange', 'direct'),
                    channel.assertQueue('usdt-queue'),
                    channel.bindQueue('usdt-queue', 'usdt-exchange', 'usdt-routing-key'),
                    channel.assertExchange('position-exchange', 'direct'),
                    channel.assertQueue('position-queue'),
                    channel.bindQueue('position-queue', 'position-exchange', 'position-routing-key'),
                ]);
                this.logger.debug('Exchange and Queue set up successfully');
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
            channel.consume('usdt-queue', async (msg) => {
                try {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        const wallet = await this.exchangeService.balance({
                            userId: content.userId,
                        });
                        channel.publish('usdt-exchange', 'usdt-routing-key', Buffer.from(JSON.stringify({
                            userId: content.userId,
                            ...wallet,
                        })));
                        channel.ack(msg);
                    }
                }
                catch (error) {
                    this.logger.error('Error consuming message from usdt-queue:', error);
                }
            });
            channel.consume('position-queue', async (msg) => {
                try {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        const position = await this.exchangeService.position({
                            userId: content.userId,
                        });
                        if (position.status === 'success') {
                            channel.publish('position-exchange', 'position-routing-key', Buffer.from(JSON.stringify({
                                userId: content.userId,
                                ...position,
                            })));
                        }
                        channel.ack(msg);
                    }
                }
                catch (error) {
                    this.logger.error('Error consuming message from position-queue:', error);
                }
            });
            channel.consume('open-position-queue', async (msg) => {
                try {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        if (content.status === 'Long') {
                            await this.exchangeService.createLimitBuyOrder({
                                userId: content.userId,
                                symbol: content.symbol,
                                quantity: content.quantity,
                                leverage: content.leverage,
                            });
                        }
                        else if (content.status === 'Short') {
                            await this.exchangeService.createLimitSellOrder({
                                userId: content.userId,
                                symbol: content.symbol,
                                quantity: content.quantity,
                                leverage: content.leverage,
                            });
                        }
                        channel.ack(msg);
                    }
                }
                catch (error) {
                    this.logger.error('Error consuming message from open-position-queue:', error);
                }
            });
            channel.consume('close-position', async (msg) => {
                try {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        await this.exchangeService.closePosition({
                            userId: content.userId,
                            leverage: content.leverage,
                            quantity: content.quantity,
                            symbol: content.symbol,
                            position: content.status,
                        });
                        channel.ack(msg);
                    }
                }
                catch (error) {
                    this.logger.error('Error consuming message from open-position-queue:', error);
                }
            });
        });
    }
};
exports.RabbitmqConsumerService = RabbitmqConsumerService;
exports.RabbitmqConsumerService = RabbitmqConsumerService = RabbitmqConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof exchange_service_1.ExchangeService !== "undefined" && exchange_service_1.ExchangeService) === "function" ? _b : Object])
], RabbitmqConsumerService);


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

/***/ "ccxt":
/*!***********************!*\
  !*** external "ccxt" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("ccxt");

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
/*!***********************************!*\
  !*** ./apps/exchange/src/main.ts ***!
  \***********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const exchange_module_1 = __webpack_require__(/*! ./exchange.module */ "./apps/exchange/src/exchange.module.ts");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const path_1 = __webpack_require__(/*! path */ "path");
const common_1 = __webpack_require__(/*! @app/common */ "./libs/common/src/index.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
async function bootstrap() {
    const configApp = await core_1.NestFactory.create(exchange_module_1.ExchangeModule);
    let configService = configApp.get(config_1.ConfigService);
    const app = await core_1.NestFactory.createMicroservice(exchange_module_1.ExchangeModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            protoPath: (0, path_1.join)(__dirname, '../exchange.proto'),
            package: common_1.EXCHANGE_PACKAGE_NAME,
            url: configService.get('GRPC_URL'),
        },
    });
    await app.listen();
}
bootstrap();

})();

/******/ })()
;