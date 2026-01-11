// Base Entity Class with mock implementation
export class BaseEntity {
    constructor(data) {
        Object.assign(this, data);
    }

    static getStorageKey() {
        // Get current user to determine Team Scope
        const userJson = localStorage.getItem('user');
        const teamId = userJson ? JSON.parse(userJson).team_id : 'default';
        return `app_data_${teamId}_${this.name.toLowerCase()}`;
    }

    static async getDelay() {
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    static async list(sort, limit) {
        await this.getDelay();
        const data = localStorage.getItem(this.getStorageKey());
        return data ? JSON.parse(data) : [];
    }

    static async filter(query, sort, limit) {
        const all = await this.list();
        // Simple filtering (exact match for now)
        return all.filter(item => {
            return Object.keys(query).every(key => item[key] == query[key]);
        });
    }

    static async get(id) {
        const all = await this.list();
        return all.find(item => item.id === id) || null;
    }

    static async create(data) {
        await this.getDelay();
        const all = await this.list();
        const newItem = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            ...data
        };
        all.push(newItem);
        localStorage.setItem(this.getStorageKey(), JSON.stringify(all));
        return newItem;
    }

    static async update(id, data) {
        await this.getDelay();
        const all = await this.list();
        const index = all.findIndex(item => item.id === id);
        if (index === -1) throw new Error("Item not found");

        const updatedItem = { ...all[index], ...data, updated_at: new Date().toISOString() };
        all[index] = updatedItem;
        localStorage.setItem(this.getStorageKey(), JSON.stringify(all));
        return updatedItem;
    }

    static async delete(id) {
        await this.getDelay();
        let all = await this.list();
        all = all.filter(item => item.id !== id);
        localStorage.setItem(this.getStorageKey(), JSON.stringify(all));
        return true;
    }
}
