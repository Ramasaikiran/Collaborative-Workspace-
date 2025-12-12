import { BaseEntity } from './BaseEntity';

export class Task extends BaseEntity {
  static schema = {
    "name": "Task",
    "properties": {
      "title": { "type": "string" },
      "status": { "type": "string", "default": "todo" },
      "priority": { "type": "string", "default": "medium" },
      "project_id": { "type": "string" },
      "assigned_to": { "type": "string" },
      "description": { "type": "string" },
      "due_date": { "type": "string" }
    }
  };


}