import { ServerRespond } from "./DataStreamer";

export interface Row {
  ratio: number;
  price_abc: number;
  price_def: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = serverResponds[0].top_ask.price;
    const priceDEF = serverResponds[1].top_ask.price;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.01;
    return {
      ratio: ratio,
      price_abc: priceABC,
      price_def: priceDEF,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      timestamp:
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}
