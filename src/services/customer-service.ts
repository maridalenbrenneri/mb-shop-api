class CustomerService {

    async getCustomers() {
        const self = this;
        const request = require('request');
        
        const options = {
            url: `${process.env.FIKEN_BASE_URL}/companies/${process.env.FIKEN_COMPANY}/contacts`,
            method: 'GET',
            headers : {
                "Authorization" : "Basic " + new Buffer(process.env.FIKEN_USER + ":" + process.env.FIKEN_PWD).toString("base64")
            }
        }

        return new Promise<any>(function (resolve, reject) {
            request(options, function (error: any, response: any) {
                if (error) {
                    return reject(error);
                }

				if(response.statusCode != 200) {
					return reject(response.body);
				}

                const res = JSON.parse(response.body);
                const customers = res['_embedded']["https://fiken.no/api/v1/rel/contacts"];

                const clientCustomers = customers.map(c => self.mapToClientModel(c)).filter(c => c.customerNumber);

                return resolve(clientCustomers);
            });
        });
    }

    mapToClientModel = function(customer) {

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

export default new CustomerService();