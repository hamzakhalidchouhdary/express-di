class User {
    constructor({ currentUser, userRepository }) {
        this.currentUser = currentUser;
        this.userRepository = userRepository;
    }

    me() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    getUserById(id) {
        return this.userRepository.getUserById(id);
    }

    createUser(user) {
        throw new Error('Not implemented');
    }

    updateUser(id, user) {
        throw new Error('Not implemented');
    }

    deleteUser(id) {
        throw new Error('Not implemented');
    }
}

class AdminUser extends User {
    constructor({ currentUser, userRepository }) {
        super({currentUser, userRepository});
        if (currentUser.role !== 'admin') {
            throw new Error('Invalid user role');
        }
    }

    createUser(user) {
        return this.userRepository.createUser(user);
    }

    updateUser(id, user) {
        return this.userRepository.updateUser(id, user);
    }

    deleteUser(id) {
        return this.userRepository.deleteUser(id);
    }
}

class GuestUser extends User {
    constructor({ currentUser, userRepository }) {
        super({currentUser, userRepository});
        if (currentUser.role !== 'guest') {
            throw new Error('Invalid user role');
        }
    }
}

export { AdminUser, GuestUser };