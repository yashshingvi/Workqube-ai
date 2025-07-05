import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowTemplateService {
  async getTemplates() {
    // TODO: Implement template fetching
    return [
      {
        id: 'template_1',
        name: 'Email Notification Workflow',
        description: 'Send email notifications based on triggers',
        category: 'notifications',
        definition: {
          nodes: [],
          edges: [],
        },
      },
      {
        id: 'template_2',
        name: 'Data Processing Workflow',
        description: 'Process and transform data',
        category: 'data',
        definition: {
          nodes: [],
          edges: [],
        },
      },
    ];
  }

  async getTemplateById(templateId: string) {
    // TODO: Implement template fetching by ID
    return {
      id: templateId,
      name: 'Sample Template',
      description: 'A sample workflow template',
      category: 'general',
      definition: {
        nodes: [],
        edges: [],
      },
    };
  }
} 