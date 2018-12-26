
export class ShippingType {
	static readonly standard_private = 1;
	static readonly standard_business = 2;
}

export class Consignment {
	shippingType: number;
	weight: number;
	reference: string;
	customer: {
		email: string;
		phone: string;
		name: string;
		street1: string;
		street2: string;
		zipCode: string;
		place: string;
		country: string;
		contactPerson: string;
	}
}

export class CargonizerService {
	private prod_consignment_url = "https://cargonizer.no/consignments.xml";
	private prod_transport_agreement_url = "https://cargonizer.no/transport_agreements.xml";
	private prod_service_partners_url = "https://cargonizer.no/service_partners.xml";

	private sandbox_consignment_url = "https://sandbox.cargonizer.no/consignments.xml";
	private sandbox_transport_agreement_url = "https://sandbox.cargonizer.no/transport_agreements.xml";
	private sandbox_service_partners_url = "https://cargonizer.no/service_partners.xml"; // use prod, sandbox doesn't work (read only anyway)

	private api_key: string;
	private sender_id: string;
	private url: string;
	private transport_agreement_url: string;
	private transport_agreement: string;
	private service_partners_url: string;


	constructor() {

		const useSandbox = process.env.CARGONIZER_USE_SANDBOX;

		this.url = useSandbox ? this.sandbox_consignment_url : this.prod_consignment_url;
		this.transport_agreement_url = useSandbox ? this.sandbox_transport_agreement_url : this.prod_transport_agreement_url;
		this.service_partners_url = useSandbox ? this.sandbox_service_partners_url : this.prod_service_partners_url;

		this.api_key = useSandbox ? process.env.CARGONIZER_SANDBOX_API_KEY : process.env.CARGONIZER_API_KEY;
		this.sender_id = useSandbox ? process.env.CARGONIZER_SANDBOX_SENDER_ID : process.env.CARGONIZER_SENDER_ID;
		this.transport_agreement = useSandbox ? process.env.CARGONIZER_SANDBOX_TRANSPORT_AGREEMENT : process.env.CARGONIZER_TRANSPORT_AGREEMENT;
	}

	public async requestConsignment(consignment: Consignment) {

		const xml = await this.createConsignmentXml(consignment);

		const result = await this.createConsignment(xml);

		return {
			xml: xml,
			result: result
		} 
	}

	private async createConsignment(xml: string) {
		let options = {
			url: this.url,
			method: "POST",
			headers: {
				"X-Cargonizer-Key": this.api_key,
				"X-Cargonizer-Sender": this.sender_id,
				"Content-length": xml.length
			}
		};

		return new Promise<any>(function (resolve, reject) {

			const request = require('request');

			request(options, function (error: any, response: any) {
				if (error) {
					return reject(error);
				}

				if(response.statusCode != 200 || response.statusCode != 201) {
					return resolve(response);
				}

				require('xml2js').parseString(response.body, function (parseError: any, result: any) {
					if (parseError) {
						return reject(parseError);
					}

					return resolve(result);
				});
			});
		});
	}

	// toso: OBSOLETE ? 
	private async requestTransportAgreement() {

		let options = {
			url: this.transport_agreement_url,
			method: "GET",
			headers: {
				"X-Cargonizer-Key": this.api_key,
				"X-Cargonizer-Sender": this.sender_id
			}
		};

		return new Promise<any>(function (resolve, reject) {

			const request = require('request');

			request(options, function (error: any, response: { body: any; }) {

				if (error) {
					return reject(error);
				}
				
				require('xml2js').parseString(response.body, function (parseError, result) {

					if(parseError) {
						return reject(parseError);
					}

					const agreements = result['transport-agreements'];
					const agreement = agreements['transport-agreement'][0];

					return resolve(agreement.id[0]);
				});
			});
		});
	}

	private async requestServicePartners($country, $postcode) {

		const url = this.service_partners_url + '?country=' + $country + '&postcode=' + $postcode;

		return new Promise<any>(function (resolve, reject) {

			const request = require('request');
			request(url, function (error: any, response: { body: any; }) {
				if (error) {
					return reject(error);
				}

				require('xml2js').parseString(response.body, function (parseError: any, result: any) {
					if(parseError) {
						return reject(parseError);
					}

					const partners = result.results['service-partners'][0];
					const partner = partners['service-partner'][0];

					let servicePartner = {
						service_partner_number: partner.number[0],
						address: {
							name: partner.name[0],
							address1: partner.address1[0],
							address2: partner.address2[0],
							postcode: partner.postcode[0],
							city: partner.city[0],
							country: partner.country[0],
						}
					}

					return resolve(servicePartner);
				});
			});
		});
	}

	private async createConsignmentXml(consignment: Consignment) {

		let xml2js = require('xml2js');
	
		const weight = consignment.weight / 1000; // cargonizer wants kilogram

		const service_partner = await this.requestServicePartners('NO', consignment.customer.zipCode);

		// const transport_agreement = await this.requestTransportAgreement();

		const obj = {
			consignments: {
				consignment: {
					$: {
						"transport_agreement":  this.transport_agreement
					},
					product: this.ShippingTypeToProduct(consignment.shippingType),
					parts: {
						number: '',
						name: consignment.customer.name,
						order_address1: consignment.customer.street1,
						order_address2: consignment.customer.street2,
						postcode: consignment.customer.zipCode,
						city: consignment.customer.place,
						country: consignment.customer.country,
						email: consignment.customer.email,
						mobile: ''
					},
					service_partner: {
						number: service_partner.service_partner_number,
						name: service_partner.address.name,
						order_address1: service_partner.address.address1,
						order_address2: service_partner.address.address2,
						postcode: service_partner.address.zipCode,
						city: service_partner.address.city,
						country: service_partner.address.country
					},			
					items: {
						$: {
							"type":  "package",
							"amount": 1,
							"weight": weight
						}	
					 },
					services: { },
					references: { consignor: consignment.reference },
					return_address: {
						name: "Maridalen Brenneri AS",
						address1: "Sørbråtveien 36",
						postcode: "0891",
						city: "Oslo",
						country: "NO"
					}
				}
			}
		};

		const builder = new xml2js.Builder();
		const xml = builder.buildObject(obj);

		return xml;
	}

	private ShippingTypeToProduct(shippingType: number) : string {
		if(shippingType == ShippingType.standard_business) {
			return "QWERTY"; // todo ...
		}

		return "postnord_parcel_letter_mypack";
	}
}