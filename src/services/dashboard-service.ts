import giftSubscriptionService from "./gift-subscription-service";

class Counter {
    one: number = 0;
    two: number = 0;
    three: number = 0;
    four: number = 0;
    five: number = 0;
}

class BagCounter {
    fortnightly: Counter;
    monthly: Counter;
}

class Stats {
    subscriptionActiveCount: number = 0;
    subscriptionOnHoldCount: number = 0;
    subscriptionFortnightlyCount: number = 0;
    subscriptionMonthlyCount: number = 0;
    subsciptionsBagsPerMonthCount: number = 0;
    subsciptionsBagsPerFortnightlyCount: number = 0;
    subsciptionsBagsPerMonthlyCount: number = 0;

    orderProcessingCount: number = 0;
    orderPendingPaymentCount: number = 0;

    giftSubscriptionCount: number = 0;
    giftSubscriptionFortnightlyCount: number = 0;
    giftSubscriptionMonthlyCount: number = 0;

    bagCounter: BagCounter;
}

class DashboardService {
    private wooApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v2/';
    private wooSubscriptionApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v1/';

    private subscriptions: Array<any>;
    private stats: Stats;

    async getStats() {
        this.stats = new Stats();
        this.stats.bagCounter = new BagCounter();
        this.stats.bagCounter.fortnightly = new Counter();
        this.stats.bagCounter.monthly = new Counter();

        await this.getSubscriptionsFromWoo();
        await this.getOrdersInPendingPayment();
        await this.getOrdersInProcess();
        await this.getGiftSubscriptions();
        
        return this.stats;
    }

    private async getGiftSubscriptions() {
        let activeGiftSubscriptions = await giftSubscriptionService.getGiftSubscriptions();

        for (const sub of activeGiftSubscriptions) {
            const bags = sub.quantity;;
            const isFortnighlty = sub.type == 2;
            this.updateBagCounter(bags, isFortnighlty);
      
            if (isFortnighlty) {
              this.stats.subsciptionsBagsPerFortnightlyCount += bags;
              this.stats.subsciptionsBagsPerMonthCount += bags * 2;
              this.stats.giftSubscriptionFortnightlyCount++;
      
            } else {
              this.stats.subsciptionsBagsPerMonthlyCount += bags;
              this.stats.subsciptionsBagsPerMonthCount += bags;
              this.stats.giftSubscriptionMonthlyCount++;
            }
          }
      
          this.stats.giftSubscriptionCount = activeGiftSubscriptions.length;
    }

    private getSubscriptionsFromWoo() {
        const self = this;
        const url = this.wooSubscriptionApiBaseUrl + 'subscriptions?' + process.env.WOO_SECRET_PARAM;

        return new Promise<any>(function (resolve, reject) {

            const request = require('request');
            request(url, function (error: any, response: { body: any; }) {
                if (error) {
                    return reject(error);
                }

                self.subscriptions = JSON.parse(response.body);

                const activeSubscriptions = self.subscriptions.filter(s => s.status === 'active');

                self.stats.subscriptionActiveCount = activeSubscriptions.length;
                self.stats.subscriptionOnHoldCount = self.subscriptions.filter(s => s.status === 'on-hold').length;

                for (const sub of activeSubscriptions) {
                    if (!sub.line_items || sub.line_items.length === 0) {
                        continue;
                    }
                    const item = sub.line_items[0];

                    if (item.name.includes('Annenhver uke')) {
                        self.stats.subscriptionFortnightlyCount++;
                        const numberOfBags = self.resolveNumberOfBags(item.name, true);
                        self.stats.subsciptionsBagsPerFortnightlyCount += numberOfBags;
                        self.stats.subsciptionsBagsPerMonthCount += numberOfBags * 2;

                    } else {
                        self.stats.subscriptionMonthlyCount++;
                        const numberOfBags = self.resolveNumberOfBags(item.name, false);
                        self.stats.subsciptionsBagsPerMonthlyCount += numberOfBags;
                        self.stats.subsciptionsBagsPerMonthCount += numberOfBags;
                    }
                }

                resolve(true)
            });
        });
    }

    private getOrdersInProcess() {
        const self = this;
        const url = this.wooApiBaseUrl + 'orders?' + process.env.WOO_SECRET_PARAM + '&status=processing';

        return new Promise<any>(function (resolve, reject) {

            const request = require('request');
            request(url, function (error: any, response: { body: any; }) {
                if (error) {
                    return reject(error);
                }

                self.stats.orderProcessingCount = JSON.parse(response.body).length;

                resolve(true)
            });
        });
    }

    private getOrdersInPendingPayment() {
        const self = this;
        const url = this.wooApiBaseUrl + 'orders?' + process.env.WOO_SECRET_PARAM + '&status=pending';

        return new Promise<any>(function (resolve, reject) {

            const request = require('request');
            request(url, function (error: any, response: { body: any; }) {
                if (error) {
                    return reject(error);
                }

                self.stats.orderPendingPaymentCount = JSON.parse(response.body).length;

                resolve(true)
            });
        });
    }

    private resolveNumberOfBags(name, isFortnigthly) {

        if (name.includes('- 1')) {
            return this.updateBagCounter(1, isFortnigthly);
        }

        if (name.includes('- 2')) {
            return this.updateBagCounter(2, isFortnigthly);
        }

        if (name.includes('- 3')) {
            return this.updateBagCounter(3, isFortnigthly);
        }

        if (name.includes('- 4')) {
            return this.updateBagCounter(4, isFortnigthly);
        }

        if (name.includes('- 5')) {
            return this.updateBagCounter(5, isFortnigthly);
        }
    }

    private updateBagCounter(bagsToAdd: number, isFortnigthly: boolean) {
        if (bagsToAdd === 1) {
            if (isFortnigthly) {
                this.stats.bagCounter.fortnightly.one += 1;
            } else {
                this.stats.bagCounter.monthly.one += 1;
            }
            return 1;
        }

        if (bagsToAdd === 2) {
            if (isFortnigthly) {
                this.stats.bagCounter.fortnightly.two += 1;
            } else {
                this.stats.bagCounter.monthly.two += 1;
            }
            return 2;
        }

        if (bagsToAdd === 3) {
            if (isFortnigthly) {
                this.stats.bagCounter.fortnightly.three += 1;
            } else {
                this.stats.bagCounter.monthly.three += 1;
            }
            return 3;
        }

        if (bagsToAdd === 4) {
            if (isFortnigthly) {
                this.stats.bagCounter.fortnightly.four += 1;
            } else {
                this.stats.bagCounter.monthly.four += 1;
            }
            return 4;
        }

        if (bagsToAdd === 5) {
            if (isFortnigthly) {
                this.stats.bagCounter.fortnightly.five += 1;
            } else {
                this.stats.bagCounter.monthly.five += 1;
            }
            return 5;
        }

        throw new Error('Not supported bag count');

    }
}

export default new DashboardService();