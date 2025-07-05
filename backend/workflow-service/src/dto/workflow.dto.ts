import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkflowDto {
  @ApiProperty({ description: 'Workflow name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Workflow description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Workflow definition' })
  @IsObject()
  definition: any;

  @ApiProperty({ description: 'Whether workflow is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateWorkflowDto {
  @ApiProperty({ description: 'Workflow name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Workflow description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Workflow definition', required: false })
  @IsOptional()
  @IsObject()
  definition?: any;

  @ApiProperty({ description: 'Whether workflow is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 