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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serverless_1 = require("@neondatabase/serverless");
const trigger_service_1 = require("./trigger.service");
serverless_1.neonConfig.webSocketConstructor = WebSocket;
let RealtimeService = class RealtimeService {
    configService;
    listeners = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    getListenConnectionString() {
        const realtime = this.configService.get('REALTIME_DATABASE_URL');
        const database = this.configService.get('DATABASE_URL');
        const url = realtime ?? database;
        if (!url) {
            throw new Error('DATABASE_URL is not configured');
        }
        let clean = url.replace('-pooler', '').trim();
        clean = clean.replace(/([?&])(sslmode|channel_binding)=[^&]*/g, '$1');
        clean = clean.replace(/[?&]$/, '').replace(/\?&/, '?');
        return clean;
    }
    async subscribe(projectId, tableName, callback) {
        const channel = trigger_service_1.TriggerService.channelName(projectId, tableName);
        const existing = this.listeners.get(channel);
        if (existing) {
            existing.callbacks.add(callback);
            return;
        }
        const client = new serverless_1.Client({
            connectionString: this.getListenConnectionString(),
        });
        await client.connect();
        client.on('notification', (msg) => {
            if (!msg.payload)
                return;
            try {
                const event = JSON.parse(msg.payload);
                const entry = this.listeners.get(channel);
                entry?.callbacks.forEach((cb) => cb(event));
            }
            catch {
            }
        });
        await client.query(`LISTEN ${channel}`);
        this.listeners.set(channel, {
            client,
            callbacks: new Set([callback]),
        });
    }
    unsubscribe(projectId, tableName, callback) {
        const channel = trigger_service_1.TriggerService.channelName(projectId, tableName);
        const entry = this.listeners.get(channel);
        if (!entry)
            return;
        entry.callbacks.delete(callback);
        if (entry.callbacks.size === 0) {
            void entry.client.query(`UNLISTEN ${channel}`).finally(() => {
                void entry.client.end();
            });
            this.listeners.delete(channel);
        }
    }
    async onModuleDestroy() {
        await Promise.all([...this.listeners.values()].map(({ client }) => client.end()));
        this.listeners.clear();
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map