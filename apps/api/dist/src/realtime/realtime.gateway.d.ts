import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RealtimeService } from './realtime.service';
import type { RealtimeSocket } from './realtime-socket.type';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private realtimeService;
    private jwtService;
    private configService;
    server: Server;
    private socketCallbacks;
    constructor(realtimeService: RealtimeService, jwtService: JwtService, configService: ConfigService);
    handleConnection(client: RealtimeSocket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: RealtimeSocket, tableName: string): Promise<void>;
    handleUnsubscribe(client: RealtimeSocket, tableName: string): Promise<void>;
}
