import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { PrismaService } from './prisma/prisma.service';
import { WorkflowExecutionService } from './workflow-execution.service';
import { WorkflowTemplateService } from './workflow-template.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    WorkflowExecutionService,
    WorkflowTemplateService,
    PrismaService,
  ],
  exports: [WorkflowService, WorkflowExecutionService],
})
export class AppModule {} 