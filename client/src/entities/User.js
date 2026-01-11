import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
    static async me() {
        return {
            email: 'user@example.com',
            full_name: 'John Doe',
            id: '123'
        };
    }


}
