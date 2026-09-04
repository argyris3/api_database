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
var TriggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_service_1 = require("../db/drizzle.service");
let TriggerService = TriggerService_1 = class TriggerService {
    drizzle;
    constructor(drizzle) {
        this.drizzle = drizzle;
    }
    assertSafeIdentifier(name, label) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            throw new common_1.BadRequestException(`Invalid ${label}: ${name}`);
        }
    }
    static channelName(projectId, tableName) {
        return `project_${projectId.replace(/-/g, '_')}_${tableName}`;
    }
    async enableRealtime(dbSchema, projectId, tableName) {
        this.assertSafeIdentifier(dbSchema, 'schema name');
        this.assertSafeIdentifier(tableName, 'table name');
        const channel = TriggerService_1.channelName(projectId, tableName);
        const fnName = `${tableName}_notify`;
        await this.drizzle.db.execute(`
      CREATE OR REPLACE FUNCTION "${dbSchema}"."${fnName}"()
      RETURNS TRIGGER AS $$
      DECLARE
        payload JSON;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          payload = json_build_object(
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'record', row_to_json(OLD),
            'oldRecord', row_to_json(OLD),
            'projectId', '${projectId}',
            'timestamp', now()::text
          );
          PERFORM pg_notify('${channel}', payload::text);
          RETURN OLD;
        ELSIF TG_OP = 'UPDATE' THEN
          payload = json_build_object(
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'record', row_to_json(NEW),
            'oldRecord', row_to_json(OLD),
            'projectId', '${projectId}',
            'timestamp', now()::text
          );
          PERFORM pg_notify('${channel}', payload::text);
          RETURN NEW;
        ELSE
          payload = json_build_object(
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'record', row_to_json(NEW),
            'projectId', '${projectId}',
            'timestamp', now()::text
          );
          PERFORM pg_notify('${channel}', payload::text);
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);
        await this.drizzle.db.execute(`
      DROP TRIGGER IF EXISTS "${tableName}_realtime_trigger"
      ON "${dbSchema}"."${tableName}";
    `);
        await this.drizzle.db.execute(`
      CREATE TRIGGER "${tableName}_realtime_trigger"
      AFTER INSERT OR UPDATE OR DELETE
      ON "${dbSchema}"."${tableName}"
      FOR EACH ROW
      EXECUTE FUNCTION "${dbSchema}"."${fnName}"();
    `);
    }
    async disableRealtime(dbSchema, tableName) {
        this.assertSafeIdentifier(dbSchema, 'schema name');
        this.assertSafeIdentifier(tableName, 'table name');
        await this.drizzle.db.execute(`
      DROP TRIGGER IF EXISTS "${tableName}_realtime_trigger"
      ON "${dbSchema}"."${tableName}";
    `);
    }
};
exports.TriggerService = TriggerService;
exports.TriggerService = TriggerService = TriggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], TriggerService);
//# sourceMappingURL=trigger.service.js.map