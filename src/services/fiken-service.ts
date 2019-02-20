import moment = require("moment");

class FikenService {

    request = require('request');
    fikenUri = `${process.env.FIKEN_BASE_URL}/companies/${process.env.FIKEN_COMPANY}`;

    private getHeaders() {
        return {
            "Authorization" : "Basic " + new Buffer(process.env.FIKEN_USER + ":" + process.env.FIKEN_PWD).toString("base64"),
            "Content-Type": "application/json"
        };
    }

    async getCustomers() {
        const self = this;
        
        const options = {
            url: `${self.fikenUri}/contacts`,
            method: 'GET',
            headers : this.getHeaders()
        }

        return new Promise<any>(function (resolve, reject) {
            self.request(options, function (error: any, response: any) {
                if (error) {
                    return reject(error);
                }

				if(response.statusCode != 200) {
					return reject(response.body);
				}

                const res = JSON.parse(response.body);
                const customers = res['_embedded'][`${process.env.FIKEN_BASE_URL}/rel/contacts`];

                const clientCustomers = customers.map(c => self.mapToCustomerClientModel(c)).filter(c => c.customerNumber);

                return resolve(clientCustomers);
            });
        });
    }

    private createFikenInvoiceData(order) {
        const self = this;
        const invoiceDueDays = 14;

        // todo: create invoice lines

        console.log(order.items);
      
        return {
            issueDate: moment().format('YYYY-MM-DD'),
            dueDate: moment().add(invoiceDueDays, 'd').format('YYYY-MM-DD'),
            lines:[
                {
                    netAmount: "20000",
                    vatAmount: "5000",
                    grossAmount: "25000",
                    vatType: "HIGH",
                    vatPercent: "25",
                    quantity: "2",
                    description: "Kaffe 250g",
                    incomeAccount: "3000"
                }
            ],
            bankAccountUrl: `${self.fikenUri}/bank-accounts/${process.env.FIKEN_BANK_ACCOUNT_ID}`,
            customer: {
                url: `${self.fikenUri}/contacts/730009065` // todo: customer id
            },
            invoiceText: `Ordre #${order.id}`,
            yourReference: '',
            ourReference: 'Yngve Ydersbond'       
        }
    }

    async createInvoice(invoice) { 
        const self = this;
        
        const options = {
            url: `${self.fikenUri}/create-invoice-service`,
            method: 'POST',
            headers : this.getHeaders(),
            body: JSON.stringify(self.createFikenInvoiceData(invoice))
        }

        console.log(options.body);

        return new Promise<any>(function (resolve, reject) {
            self.request(options, function (error: any, response: any) {
                if (error) {
                    return reject(error);
                }

				if(response.statusCode != 201) {
					return reject(response.body);
				}

                return resolve(true);
            });
        });
    }

    mapToCustomerClientModel = function(customer) {

        return {
            customerNumber: customer.customerNumber,
            name: customer.name,
            email: customer.email,
            address: {
                name: customer.name,
                street1: customer.address.address1,
                street2: customer.address.address2,
                place: customer.address.postalPlace,
                zipCode: customer.address.postalCode,
                country: "NO"
            }            
        }
    }
}

export default new FikenService();