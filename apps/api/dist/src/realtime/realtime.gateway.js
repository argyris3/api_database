"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const realtime_service_1 = require("./realtime.service");
const constants_1 = require("@apiDatabase/constants");
let RealtimeGateway = class RealtimeGateway {
    realtimeService;
    jwtService;
    configService;
    server;
    socketCallbacks = new Map();
    constructor(realtimeService, jwtService, configService) {
        this.realtimeService = realtimeService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleConnection(client) {
        const token = client.handshake.auth['token'];
        if (!token) {
            client.emit(constants_1.REALTIME_EVENTS.ERROR, 'Missing API key');
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('PROJECT_JWT_SECRET'),
            });
            if (payload.role !== constants_1.PROJECT_KEY_ROLES.ANON &&
                payload.role !== constants_1.PROJECT_KEY_ROLES.SERVICE_ROLE) {
                throw new Error('Invalid key role');
            }
            client.data.projectId = payload.projectId;
            client.data.role = payload.role;
            await client.join(`project:${payload.projectId}`);
        }
        catch {
            client.emit(constants_1.REALTIME_EVENTS.ERROR, 'Invalid API key');
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const callbacks = this.socketCallbacks.get(client.id) ?? [];
        for (const { projectId, tableName, callback } of callbacks) {
            this.realtimeService.unsubscribe(projectId, tableName, callback);
        }
        this.socketCallbacks.delete(client.id);
    }
    async handleSubscribe(client, tableName) {
        const projectId = client.data.projectId;
        if (!projectId || !tableName?.trim())
            return;
        const normalizedTable = tableName.trim();
        const room = `project:${projectId}:table:${normalizedTable}`;
        const existing = this.socketCallbacks.get(client.id) ?? [];
        if (existing.some((entry) => entry.projectId === projectId && entry.tableName === normalizedTable)) {
            return;
        }
        await client.join(room);
        const callback = (event) => {
            this.server.to(room).emit(constants_1.REALTIME_EVENTS.EVENT, event);
        };
        await this.realtimeService.subscribe(projectId, normalizedTable, callback);
        existing.push({
            projectId,
            tableName: normalizedTable,
            callback,
        });
        this.socketCallbacks.set(client.id, existing);
    }
    async handleUnsubscribe(client, tableName) {
        const projectId = client.data.projectId;
        if (!projectId || !tableName?.trim())
            return;
        const normalizedTable = tableName.trim();
        const room = `project:${projectId}:table:${normalizedTable}`;
        await client.leave(room);
        const callbacks = this.socketCallbacks.get(client.id) ?? [];
        const entry = callbacks.find((c) => c.projectId === projectId && c.tableName === normalizedTable);
        if (entry) {
            this.realtimeService.unsubscribe(projectId, normalizedTable, entry.callback);
            this.socketCallbacks.set(client.id, callbacks.filter((c) => c !== entry));
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.REALTIME_EVENTS.SUBSCRIBE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.REALTIME_EVENTS.UNSUBSCRIBE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleUnsubscribe", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/realtime',
        cors: {
            origin: process.env.WEB_URL ?? 'http://localhost:3001',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService,
        jwt_1.JwtService,
        config_1.ConfigService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map