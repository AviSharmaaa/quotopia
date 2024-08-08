import axios, { AxiosError, AxiosInstance } from 'axios';
import dataStore from './data_store';
import { capitalizeFirstLetter, formatISODateToCustomFormat } from '../lib/utils';

class QuotesService {
    private client: AxiosInstance;
    private offset: number;
    private limit: number;
    private endReached: boolean;
    private uploadClient: AxiosInstance;

    constructor() {
        this.offset = 0;
        this.limit = 10;
        this.endReached = false;
        this.client = axios.create({
            baseURL: 'https://assignment.stage.crafto.app',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        this.uploadClient = axios.create({
            baseURL: 'https://crafto.app',
            timeout: 10000,
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        });
    }

    async getQuotes(): Promise<Quote[]> {
        try {
            if (this.endReached) return [];

            this.client.defaults.headers.common.Authorization = dataStore.getItem('user:token')
            const response = await this.client.get(`/getQuotes?limit=${this.limit}&offset=${this.offset}`)
            this.offset = this.offset + this.limit;

            if (response.data.data.length == 0) {
                this.endReached = true;
                return [];
            }

            const quotes = response.data.data.map((item: any): Quote => ({
                createdAt: formatISODateToCustomFormat(item.createdAt),
                id: item.id,
                mediaUrl: item.mediaUrl ?? '/placeholder.jpg',
                text: item.text,
                updatedAt: formatISODateToCustomFormat(item.updatedAt),
                username: capitalizeFirstLetter(item.username),
            }));

            return quotes;
        } catch (e) {
            console.log(e);
        }
        return []
    }

    async uploadImage(file: File): Promise<any> {
        try {
            this.uploadClient.defaults.headers.common.Authorization = dataStore.getItem('user:token')
            const formData = new FormData();
            formData.append("file", file);

            const response = await this.uploadClient.post('/crafto/v1.0/media/assignment/upload', formData)
            if (response.data.length === 0) {

                return new Error('Some Error Occurred while uploading, Please try again!')
            }

            const { url } = response.data[0];
            return url;
        } catch (e) {
            return e;
        }
    }

    async shareQuote(quote: string, mediaUrl: string): Promise<any> {
        try {
            this.client.defaults.headers.common.Authorization = dataStore.getItem('user:token')
            const payload = {
                'text': quote,
                'mediaUrl': mediaUrl,
            }

            const response = await this.client.post('/postQuote', payload)
            if (response.status !== 200) {
                return new Error();
            }
            return 'success';
        } catch (e) {
            return e;
        }
    }
}

const quoteService = new QuotesService()

export default quoteService;