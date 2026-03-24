import { AdminUser, GuestUser } from '../entities/user.js';
export class UserFactory {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async getInstance(currentUser) {
        console.log(currentUser);
        switch (currentUser.role) {
            case 'admin':
                return new AdminUser({currentUser, userRepository: this.userRepository});
            case 'guest':
                return new GuestUser({currentUser, userRepository: this.userRepository});
            default:
                throw new Error('Invalid user role');
        }
    }
}