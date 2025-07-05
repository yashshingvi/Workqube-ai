import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';

@ApiTags('workflows')
@Controller('workflows')
@ApiBearerAuth()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  async createWorkflow(
    @Body() createWorkflowDto: CreateWorkflowDto,
    @Request() req,
  ) {
    return this.workflowService.create(createWorkflowDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows for the user' })
  async getWorkflows(@Request() req, @Query() query) {
    return this.workflowService.findAll(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific workflow' })
  async getWorkflow(@Param('id') id: string, @Request() req) {
    return this.workflowService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  async updateWorkflow(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
    @Request() req,
  ) {
    return this.workflowService.update(id, updateWorkflowDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  async deleteWorkflow(@Param('id') id: string, @Request() req) {
    return this.workflowService.remove(id, req.user.id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a workflow' })
  async executeWorkflow(@Param('id') id: string, @Request() req) {
    return this.workflowService.execute(id, req.user.id);
  }
} 