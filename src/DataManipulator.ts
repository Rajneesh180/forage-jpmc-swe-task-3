import { ServerRespond } from './DataStreamer';

export interface Row {
    price_abc: number;
    price_def: number;
    ratio: number;
    timestamp: Date;
    upper_bound: number;
    lower_bound: number;
    trigger_alert: number | undefined;
}


export class DataManipulator {

    static generateRow(serverRespond: ServerRespond[]): Row {
        // Compute average prices for stock ABC and DEF
        const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
        const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

        // Calculate the ratio of the two stock prices
        const ratio = priceABC / priceDEF;

        // Historical average ratio (for demo purposes, use actual historical average)
        const historicalAverageRatio = 1.1; // Example historical average ratio
        const upperBound = historicalAverageRatio * 1.10; // +10% of historical average
        const lowerBound = historicalAverageRatio * 0.90; // -10% of historical average

        // Determine if the ratio triggers an alert
        const trigger_alert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

        return {
            price_abc: priceABC,
            price_def: priceDEF,
            ratio,
            timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
                serverRespond[0].timestamp : serverRespond[1].timestamp,
            upper_bound: upperBound,
            lower_bound: lowerBound,
            trigger_alert,
        };
    }
}