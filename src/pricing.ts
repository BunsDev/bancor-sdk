import { SDKModule } from './sdk_module';
import { Token } from './types';

/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export class Pricing extends SDKModule {
    /**
    * returns the cheapest rate between any two tokens in the bancor network
    * getting the rate between tokens of different blockchains is not supported
    * 
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount in decimal string
    * 
    * @returns  rate between the source token and the target token in decimal string
    */
    async getRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<string> {
        const paths = await this.core.getPaths(sourceToken, targetToken);
        const rates = await this.core.getRates(paths, amount);

        let index = 0;
        for (let i = 1; i < rates.length; i++) {
            if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
                index = i;
        }
        return rates[index];
    }

    /**
    * returns the rate between any two tokens in the bancor network for a given conversion path
    * 
    * @param path    conversion path
    * @param amount  input amount in decimal string
    * 
    * @returns  rate between the first token in the path and the last token in the path in decimal string
    */
    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        let bgn = 0;
        while (bgn < path.length) {
            const end = path.slice(bgn).findIndex(token => token.blockchainType != path[bgn].blockchainType) >>> 0;
            amount = await this.core.blockchains[path[bgn].blockchainType].getRateByPath(path.slice(bgn, end), amount);
            bgn = end;
        }
        return amount;
    }
}

function betterRate(rates: string[], index1: number, index2: number): boolean {
    // return Number(rates[index1]) < Number(rates[index2]);
    const rate1 = rates[index1].split('.').concat('');
    const rate2 = rates[index2].split('.').concat('');
    rate1[0] = rate1[0].padStart(rate2[0].length, '0');
    rate2[0] = rate2[0].padStart(rate1[0].length, '0');
    rate1[1] = rate1[1].padEnd(rate2[1].length, '0');
    rate2[1] = rate2[1].padEnd(rate1[1].length, '0');
    return rate1.join('') < rate2.join('');
}

function equalRate(rates: string[], index1: number, index2: number): boolean {
    return rates[index1] == rates[index2];
}

function betterPath(paths: string[][], index1: number, index2: number): boolean {
    return paths[index1].length > paths[index2].length;
}
