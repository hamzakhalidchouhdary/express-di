export class UserService {
    constructor({ currentUser }) {
        this.user = currentUser
    }

    async me() {
        return this.user.me();
    }

    async getUsers() {
        return this.user.getAllUsers();
    }

    async getUserById(id) {
        return this.user.getUserById(id);
    }

    async createUser(user) {
        return this.user.createUser(user);
    }

    async updateUser(id, user) {
        return this.user.updateUser(id, user);
    }

    async deleteUser(id) {
        return this.user.deleteUser(id);
    }
}