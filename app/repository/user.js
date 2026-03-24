import HttpError from 'http-error';
export class UserRepository {
    constructor() {
        this.collection = [{ id: 1, name: 'John Doe', role: 'admin' }, { id: 2, name: 'Jane Doe', role: 'guest' }];
    }

    async throwIfUserNotFound(id) {
        const index = this.collection.findIndex(user => user.id === id);
        if (index === -1) {
            throw new HttpError.NotFound('User not found');
        }
        return index;
    }

    async getAllUsers() {
        return this.collection;
    }

    async getUserById(id) {
        return this.collection.find(user => user.id === id);
    }

    async createUser(user) {
        user.id = this.collection.length + 1;
        this.collection.push(user);
        return user;
    }

    async updateUser(id, user) {
        await this.throwIfUserNotFound(id);
        const index = this.collection.findIndex(user => user.id === id);
        this.collection[index] = {
            ...this.collection[index],
            ...user,
            id
        };
        return user;
    }

    async deleteUser(id) {
        await this.throwIfUserNotFound(id);
        this.collection = this.collection.filter(user => user.id !== id);
        return this.collection;
    }
}