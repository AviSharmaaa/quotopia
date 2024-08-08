import axios, { AxiosError, AxiosInstance } from 'axios';
import dataStore from './data_store';

class Auth {
    authClient: AxiosInstance;

    constructor() {
        this.authClient = axios.create({
            baseURL: 'https://assignment.stage.crafto.app',
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    async login(data: LogInSchema): Promise<any> {
        try {
            let payload = {
                'username': data.username,
                'otp': data.otp,
            }
            let response = await this.authClient.post('/login', payload);

            const { token } = response.data;
            return token;
        } catch (e) {
            return e;
        }
    }

    logout() {
        dataStore.clear();
    }

}

export default new Auth();