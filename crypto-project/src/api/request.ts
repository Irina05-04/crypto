import axios from "axios";
import {URL} from '../const/const';

export function getCountCoins () {
    return axios.get(`${URL}/assets`);   
}
export function getCoinsOnPage (indexOfFirstIndex: number, perPage: number) {
    return axios.get(`${URL}/assets?offset=${indexOfFirstIndex}&limit=${perPage}`);
}
export function getCoin(coinId: string){
    return axios.get(`${URL}/assets/${coinId}`);
}
export function getHistoryCoin(coinId: string, startDay: Date) {
    return axios.get(`${URL}/assets/${coinId}/history?interval=d1&start=${Number(startDay)}&end=${Date.now()}`);
}
export function getTopCoins(){
    return axios.get(`${URL}/assets?limit=3`);
}