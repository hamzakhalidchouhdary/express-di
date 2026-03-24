export default class UserController {
    constructor({ userService }) {
        this.userService = userService;
    }

    async me (_req, res, next) {
        try {
            const user = await this.userService.me();
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(_req, res, next) {
        try {
            const users = await this.userService.getUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            const user = await this.userService.createUser(req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}