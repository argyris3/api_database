import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TableEditorService } from './table-editor.service';
import { TableEditorController } from './table-editor.controller';
import { OrgRoleGuard } from 'src/auth/guards/org-role.guards';

@Module({
  imports: [AuthModule],
  providers: [TableEditorService, OrgRoleGuard],
  controllers: [TableEditorController],
})
export class TableEditorModule {}
