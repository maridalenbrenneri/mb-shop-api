import * as http from 'http';
import logger from '../utils/logger';

export class ShippingType {
    static readonly standard_private 	= 1;
    static readonly standard_business 	= 2;
}

export class ShippingCustomerInfo {
    email: string;
    phone: string;
    name: string;
    street1: string;
    street2: string;
    zipCode: string;
    place: string;
	country: string;	
	contactPerson: string;
	reference: string;
}

export class CargonizerService {
	private prod_consignment_url = "http://cargonizer.no/consignments.xml";
	private prod_transport_agreement_url = "http://cargonizer.no/transport_agreements.xml";
	private prod_service_partners_url = "http://cargonizer.no/service_partners.xml";

	private sandbox_consignment_url = "http://sandbox.cargonizer.no/consignments.xml";
	private sandbox_transport_agreement_url = "http://sandbox.cargonizer.no/transport_agreements.xml";
	private sandbox_service_partners_url = "http://sandbox.cargonizer.no/service_partners.xml";

	private api_key;
	private sender_id;
	private $curl; 
	private data_xml = "<xml></xml>";
	private data = Array<any>();
	private pkg_number;
	private urls = Array<any>();
	private cost_estimate = 0;
	private errors = Array<any>();
	private error_flag = 0;
	private sxml;
	private url;
	private transport_agreement_url;
	private transport_agreement;
	private service_partners_url;

	constructor() {

		const useSandbox = process.env.CARGONIZER_USE_SANDBOX;

		this.url = useSandbox ? this.sandbox_consignment_url : this.prod_consignment_url;
		this.transport_agreement_url = useSandbox ? this.sandbox_transport_agreement_url : this.prod_transport_agreement_url;
		this.service_partners_url = useSandbox ? this.sandbox_service_partners_url : this.prod_service_partners_url; 

		this.api_key = useSandbox ? process.env.CARGONIZER_SANDBOX_API_KEY : process.env.CARGONIZER_API_KEY;
		this.sender_id = useSandbox ? process.env.CARGONIZER_SANDBOX_SENDER_ID : process.env.CARGONIZER_SENDER_ID;
		this.transport_agreement = useSandbox ? process.env.CARGONIZER_SANDBOX_TRANSPORT_AGREEMENT : process.env.CARGONIZER_SANDBOX_AGREEMENT;
		
		// $this->curl = curl_init();
		// curl_setopt($this->curl, CURLOPT_URL, $this->consignment_url); 
		// curl_setopt($this->curl, CURLOPT_VERBOSE, 1); 
		// curl_setopt($this->curl, CURLOPT_HEADER, 0); 
		// curl_setopt($this->curl, CURLOPT_POST, 1); 
		// curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1); 
	}	

	public async requestConsignment(customer: ShippingCustomerInfo, shippingType: number, orderWeight: number) {
		this.pkg_number = "0";
		this.urls = Array<any>();
		this.cost_estimate = 0;

		let service_partner = null;
		
		let servicePartnerResponse = await this.requestServicePartners('NO', customer.zipCode);

		logger.debug(servicePartnerResponse);

		return servicePartnerResponse;
		
	//	let sxml = simplexml_load_string(servicePartnerResponse);
		

		// if($sxml->{'service-partners'}->{'service-partner'} != NULL) {
		// 	$partner = $sxml->{'service-partners'}->{'service-partner'}[0];
		// 	$address = new mb_address(
		// 		$partner->{'name'},
		// 		$partner->{'address1'},
		// 		$partner->{'address2'},
		// 		$partner->{'postcode'},
		// 		$partner->{'city'},
		// 		$partner->{'country'}
		// 	);
		// 	$service_partner = new mb_service_partner(
		// 		$partner->{'number'},
		// 		$address
		// 	);
		// }

		// $xml = this.toXmlFromWcOrder($wc_order, $wc_order_weight, service_partner); 

		// curl_setopt($this->curl, CURLOPT_URL, $this->consignment_url);
		// curl_setopt($this->curl, CURLOPT_POST, 1);
		// curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, "POST");
		
		// if($debug == 0) echo "XML<br>\n".print_r($xml,1)."<br>\n";
		
		// curl_setopt($this->curl, CURLOPT_POSTFIELDS, $xml);
		// $headers = array(
		// 	"X-Cargonizer-Key:".$this->api_key,
		// 	"X-Cargonizer-Sender:".$this->sender_id,
		// 	"Content-type:application/xml",
		// 	"Content-length:".strlen($xml),
		// );
		// if($debug == 1) echo "Header\n".print_r($headers,1)."<br>\n";	
		// curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers); 
		
		// if($debug == 0) $response = $this->runRequest($debug);
		
		// if($debug == 1) $this->parseResponse($response,$debug);
		
		// return $response;
	}

	
	public requestTransportAgreements($url = "") {
		// if($url == '') $url = $this->transport_agreement_url;
		// echo "URL: $url<br>\n";
		// curl_setopt($this->curl, CURLOPT_URL, $url);
		// curl_setopt($this->curl, CURLOPT_POST, 0);
		// $headers = array(
		// 	"X-Cargonizer-Key:".$this->api_key,
		// 	"X-Cargonizer-Sender:".$this->sender_id,
		// 	"Content-type:application/xml",
		// 	"Content-length:0",
		// );
		// curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
		// $response = $this->runRequest($debug);
		
		// return $response;
	}
		

	private async requestServicePartners($country, $postcode) {
		// let options = {
		// 	host: ,
		// 	// path: '?country=' + $country + '&postcode=' + $postcode,
		// 	method: "GET",
		// 	headers: {
		// 		"X-Cargonizer-Key": this.api_key,
		// 		"X-Cargonizer-Sender": this.sender_id
		// 	}
		// };

	   const url = this.service_partners_url + '?country=' + $country + '&postcode=' + $postcode;

	   return new Promise<Array<any>>(function (resolve, reject) {

			http.get(url, (response) => {

				// response.setEncoding('utf8');
				let rawData = '';
				response.on('data', (chunk) => { rawData += chunk; });
				response.on('end', () => {
					try {
						return resolve(JSON.parse(rawData));

					} catch (e) {
						reject (e)
					}
				});

			}).on('error', (e) => {
				reject(e);
			});
		});

		// return await http.get(url, response => {

		// 	logger.debug("YESH");

		// 	return response;
			

		// }).on('error', (e) => {
		// 	throw e;
		// });;

		// return await http.request(options, (response) => {
		// 	return response;

		// }).on('error', (e) => {
		// 	logger.error(e);
		// 	return e;
		// });

		// curl_setopt($this->curl, CURLOPT_URL, $url);
		// curl_setopt($this->curl, CURLOPT_POST, 0);
		// $headers = array(
		// 	"X-Cargonizer-Key:".$this->api_key,
		// 	"X-Cargonizer-Sender:".$this->sender_id,
		// 	"Content-type:application/xml",
		// 	"Content-length:0",
		// );
		// curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
		// $response = $this->runRequest();
		
		// return $response;
	}

	// private function runRequest($debug=0) {
	// 	$response = curl_exec($this->curl); 
	// 	if(!curl_errno($this->curl)) { 
	// 		$info = curl_getinfo($this->curl); 
	// 		if($debug == 1) echo 'Took ' . $info['total_time'] . ' seconds to send a request to ' . $info['url']."<br>\n"; 
	// 	} else { 
	// 		if($debug == 1) echo 'Curl error: ' . curl_error($this->curl)."<br>\n";
	// 		$this->error_flag = 1;
	// 		$this->errors['curl_request'] .= curl_error($this->curl)."\n";
	// 	} 
	// 	return $response;
	// }
	
	// private function parseResponse($xml,$debug=0) {
	// 	$sxml = simplexml_load_string($xml);
	// 	$this->sxml = $sxml;
		
	// 	if($sxml->getName() == "errors") {
	// 		if($debug == 1) echo "SXML<br><pre>".print_r($sxml,1)."</pre>";
	// 		$this->error_flag = 1;
	// 		if(array_key_exists('parsing', $this->errors)) $this->errors['parsing'] .= $sxml."\n".print_r($this->data,1);
	// 	} else {
	// 		if($debug == 1) echo "SXML<br><pre>".print_r($sxml,1)."</pre>";
	// 	}
	// 	foreach($sxml->consignment as $consignment) {
	// 		$this->pkg_number = (string)$consignment->{'number-with-checksum'};
	// 		if($debug == 1) echo "PDF: ".$consignment->{'consignment-pdf'}."<br>\n";
	// 		$this->urls['consignment-pdf'] = $consignment->{'consignment-pdf'};
	// 		$this->urls['collection-pdf'] = (string)$consignment->{'collection-pdf'};
	// 		$this->urls['waybill-pdf'] = (string)$consignment->{'waybill-pdf'};
	// 		$this->urls['tracking-url'] = (string)$consignment->{'tracking-url'};
	// 		if($debug == 1) echo "Values: ".print_r((string)$consignment->{'cost-estimate'}->gross,1)."<br>\n";
	// 		$this->cost_estimate = (string)$consignment->{'cost-estimate'}->gross;
	// 	}
	// }

	// private function toXmlFromWcOrder($order, $wc_order_weight, $service_partner) {
	// 	$order_senders_ref = '#' . $order->get_order_number() . ' ';
	  
	//   	// Adding product names in short format for ref on printed labels
	//   	foreach ($order->get_items() as $item_id => $item_data) {
	// 	  $product = $item_data->get_product();
	// 	  $product_name = $product->get_name(); 
	// 	  $item_quantity = $item_data->get_quantity();

	// 	  if (strpos($product_name, 'Kaffeabonnement') !== false) {
	// 		$name = str_ireplace('Kaffeabonnement - ', 'ABO', $product_name);
	// 		$name2 = str_ireplace(', Månedlig', '', $name);
	// 		$shortName = str_ireplace(', Annenhver uke', '', $name2);
	// 		$order_senders_ref = $order_senders_ref . ' ' . $shortName . ' ';

	// 	  } else {

	// 		$pos1 = strpos($product_name, '(');
	// 		$pos2 = strpos($product_name, ')');
	// 		if($pos1 === false || $pos2 === false) {
	// 		  $order_senders_ref = $order_senders_ref + $item_quantity . $product_name . ' ';

	// 		} else {
	// 		  $shortName = substr($product_name, $pos1 + 1, $pos2 - $pos1 - 1);
	// 		  $order_senders_ref = $order_senders_ref . $item_quantity . $shortName . ' ';
	// 		}
	// 	  }
	// 	}
	  
	// 	$order_customer_number = $order->get_customer_id();
	// 	$order_name = $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name();
	// 	$order_address1 = $order->get_shipping_address_1();
	// 	$order_address2 = $order->get_shipping_address_2();
	// 	$order_postcode = $order->get_shipping_postcode();
	// 	$order_city = $order->get_shipping_city();
	// 	$order_country = $order->get_shipping_country();

	// 	$order_email = $order->get_billing_email();
	// 	$order_mobile = $order->get_billing_phone();

	// 	$order_weight = $wc_order_weight / 1000; // cargonizer wants kilogram

	// 	$xw = xmlwriter_open_memory();
	// 	xmlwriter_set_indent($xw, 1);
	// 	$res = xmlwriter_set_indent_string($xw, ' ');

	// 	xmlwriter_start_document($xw, '1.0', 'UTF-8');

	// 	// Root element
	// 	xmlwriter_start_element($xw, 'consignments');

	// 	xmlwriter_start_element($xw, 'consignment');

	// 	$this->createXmlAttr($xw, "transport_agreement", $this->transport_agreement);

	// 	xmlwriter_start_element($xw, 'product');
	// 	xmlwriter_text($xw, 'postnord_parcel_letter_mypack');
	// 	xmlwriter_end_element($xw); // product

	// 	xmlwriter_start_element($xw, 'parts');
		
	// 		xmlwriter_start_element($xw, 'consignee');

	// 			xmlwriter_start_element($xw, 'number');
	// 			xmlwriter_text($xw, $order_customer_number);
	// 			xmlwriter_end_element($xw); // number			
	// 			xmlwriter_start_element($xw, 'name');
	// 			xmlwriter_text($xw, $order_name);
	// 			xmlwriter_end_element($xw); // name
	// 			xmlwriter_start_element($xw, 'address1');
	// 			xmlwriter_text($xw, $order_address1);
	// 			xmlwriter_end_element($xw); // address1		
	// 			xmlwriter_start_element($xw, 'address2');
	// 			xmlwriter_text($xw, $order_address2);
	// 			xmlwriter_end_element($xw); // address2			
	// 			xmlwriter_start_element($xw, 'postcode');
	// 			xmlwriter_text($xw, $order_postcode);
	// 			xmlwriter_end_element($xw); // postcode
	// 			xmlwriter_start_element($xw, 'city');
	// 			xmlwriter_text($xw, $order_city);
	// 			xmlwriter_end_element($xw); // city
	// 			xmlwriter_start_element($xw, 'country');
	// 			xmlwriter_text($xw, $order_country);
	// 			xmlwriter_end_element($xw); // country
	// 			xmlwriter_start_element($xw, 'email');
	// 			xmlwriter_text($xw, $order_email);
	// 			xmlwriter_end_element($xw); // email
	// 			xmlwriter_start_element($xw, 'mobile');
	// 			xmlwriter_text($xw, $order_mobile);
	// 			xmlwriter_end_element($xw); // mobile

	// 		xmlwriter_end_element($xw); // consignee

	// 		if($service_partner != NULL) {
	// 			xmlwriter_start_element($xw, 'service_partner');
	// 				xmlwriter_start_element($xw, 'number');
	// 				xmlwriter_text($xw, $service_partner->service_partner_number);
	// 				xmlwriter_end_element($xw); // number
	// 				xmlwriter_start_element($xw, 'name');
	// 				xmlwriter_text($xw,  $service_partner->address->name);
	// 				xmlwriter_end_element($xw); // name
	// 				xmlwriter_start_element($xw, 'address1');
	// 				xmlwriter_text($xw, $service_partner->address->address1);
	// 				xmlwriter_end_element($xw); // address1
	// 				xmlwriter_start_element($xw, 'address2');
	// 				xmlwriter_text($xw, $service_partner->address->address2);
	// 				xmlwriter_end_element($xw); // address2
	// 				xmlwriter_start_element($xw, 'postcode');
	// 				xmlwriter_text($xw, $service_partner->address->postcode);
	// 				xmlwriter_end_element($xw); // postcode
	// 				xmlwriter_start_element($xw, 'city');
	// 				xmlwriter_text($xw, $service_partner->address->city);
	// 				xmlwriter_end_element($xw); // city
	// 				xmlwriter_start_element($xw, 'country');
	// 				xmlwriter_text($xw, $service_partner->address->country);
	// 				xmlwriter_end_element($xw); // country
	// 			xmlwriter_end_element($xw); // service_partner
	// 		}

	// 	xmlwriter_end_element($xw); // parts

	// 	xmlwriter_start_element($xw, 'items');

	// 		xmlwriter_start_element($xw, 'item');
	// 		$this->createXmlAttr($xw, "type", "package");
	// 		$this->createXmlAttr($xw, "amount", "1");
	// 		$this->createXmlAttr($xw, "weight", '' . $order_weight);
	// 		xmlwriter_end_element($xw); // item

	// 	xmlwriter_end_element($xw); // items

	// 	xmlwriter_start_element($xw, 'services');
	// 	// xmlwriter_text($xw, $order_name);
	// 	xmlwriter_end_element($xw); // services

	// 	xmlwriter_start_element($xw, 'references');
	// 		xmlwriter_start_element($xw, 'consignor');
	// 		xmlwriter_text($xw, $order_senders_ref);
	// 		xmlwriter_end_element($xw); // consignor
	// 	xmlwriter_end_element($xw); // references

	// 	xmlwriter_start_element($xw, 'return_address');
	// 		xmlwriter_start_element($xw, 'name');
	// 		xmlwriter_text($xw, 'Maridalen Brenneri AS');
	// 		xmlwriter_end_element($xw); // name
	// 		xmlwriter_start_element($xw, 'address1');
	// 		xmlwriter_text($xw, 'Sørbråtveien 36');
	// 		xmlwriter_end_element($xw); // address1
	// 		xmlwriter_start_element($xw, 'postcode');
	// 		xmlwriter_text($xw, '0891');
	// 		xmlwriter_end_element($xw); // postcode
	// 		xmlwriter_start_element($xw, 'city');
	// 		xmlwriter_text($xw, 'Oslo');
	// 		xmlwriter_end_element($xw); // city
	// 		xmlwriter_start_element($xw, 'country');
	// 		xmlwriter_text($xw, 'NO');
	// 		xmlwriter_end_element($xw); // country
	// 	xmlwriter_end_element($xw); // return_address
		
	// 	xmlwriter_end_element($xw); // consignment

	// 	xmlwriter_end_element($xw); // consignments

	// 	xmlwriter_end_document($xw);

	// 	return xmlwriter_output_memory($xw);
	// }

	// private function createXmlAttr($xw, $name, $value){
	// 	xmlwriter_start_attribute($xw, $name);
	// 	xmlwriter_text($xw, $value);
	// 	xmlwriter_end_attribute($xw);
	// }
}

// class mb_address {
// 	public $name;
// 	public $address1;
// 	public $address2;
// 	public $postcode;
//   	public $city;
// 	public $country;

// 	public function __construct($name, $address1, $address2, $postcode, $city, $country) {
// 		$this->name = $name;
// 		$this->address1 = $address1;
// 		$this->address2 = $address2;
// 		$this->postcode = $postcode;
// 	  	$this->city = $city;
// 		$this->country = $country;
// 	}
// }

// class mb_service_partner {
// 	public $service_partner_number;
// 	public $address;

// 	public function __construct($service_partner_number, $address) {
// 		$this->service_partner_number = $service_partner_number;
// 		$this->address = $address;
// 	}
// }

/*
function cargonizer_request_consignment( $order, $useSandbox = 0 ) {
    $order_emballage_weight = 150;
  $crg_api_key = "17ac0bc561137c28f663e6d22ecd6d7bc097092d";
  $crg_sender_id = "6350";
  $crg_consignment_url = "http://cargonizer.no/consignments.xml";
  $crg_transport_url = "http://cargonizer.no/transport_agreements.xml";
  $crg_transport_agreement = "9389";
  
  if($useSandbox == 1) {
      $crg_api_key = "3929bc31e5d97fe928ab0c1b3dde7ff71bf85ad2";
      $crg_sender_id = "1319";
      $crg_consignment_url = "http://sandbox.cargonizer.no/consignments.xml";
      $crg_transport_url = "http://sandbox.cargonizer.no/transport_agreements.xml";
      $crg_transport_agreement = "1061";
  }
  
  $debug = 0;
  
  $wc_order = new WC_Order($order->get_id());
  $total_weight = 0;

  foreach( $order->get_items() as $item_id => $product_item ){
    $quantity = $product_item->get_quantity(); // get quantity
    $product = $product_item->get_product(); // get the WC_Product object
    $product_weight = $product->get_weight(); // get the product weight
    // Add the line item weight to the total weight calculation
    $total_weight += floatval( $product_weight * $quantity );
  }

  if($total_weight > 0) {
    $total_weight += $order_emballage_weight;
  }

  $crg = new cargonizer($crg_api_key, $crg_sender_id, $crg_transport_agreement, $crg_consignment_url);
  $response = $crg->requestConsignment($wc_order, $total_weight, $debug);
  
  // TODO: check response for errors and 40x, 50x => Add error note on product (and log etc.)
  //$order->add_order_note($response);
    
  // Add the sent flag
  update_post_meta( $order->get_id(), '_wc_order_sent_to_cargonizer', true );

  // Add a note to order saying its been sent
  if($useSandbox == 1) {
      $message = '[TEST] Order sent to Cargonizer Sandbox';
  }  else {
      $message = sprintf( __( 'Order sent to Cargonizer by %s', 'my-textdomain' ), wp_get_current_user()->display_name);
  }
  $order->add_order_note( $message);
}


class cargonizer {
	private $consignment_url = "http://cargonizer.no/consignments.xml";
	private $transport_agreement_url = "http://cargonizer.no/transport_agreements.xml";
	private $service_partners_url = "http://cargonizer.no/service_partners.xml";
	private $api_key;
	private $sender_id;
	private $curl; 
	private $data_xml = "<xml></xml>";
	private $data = array();
	private $pkg_number;
	private $urls = array();
	private $cost_estimate = 0;
	private $errors = array();
	private $error_flag = 0;
	private $sxml;
	private $transport_agreement;

	public function __construct($api_key, $sender_id, $transport_agreement, $url = '') {
		if($url != '') $this->consignment_url = $url;

		$this->api_key = $api_key;
		$this->sender_id = $sender_id;
		$this->transport_agreement = $transport_agreement;
		
		$this->curl = curl_init();
		curl_setopt($this->curl, CURLOPT_URL, $this->consignment_url); 
		curl_setopt($this->curl, CURLOPT_VERBOSE, 1); 
		curl_setopt($this->curl, CURLOPT_HEADER, 0); 
		curl_setopt($this->curl, CURLOPT_POST, 1); 
		curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1); 
	}
	
	public function __destruct() {
		curl_close($this->curl);
	}
	
	public function getPkgNumber() {
		return $this->pkg_number;
	}
	
	public function getUrls() {
		return $this->urls;
	}
	
	public function getErrorFlag() {
		return $this->error_flag;
	}
	
	public function getErrors() {
		return $this->errors;
	}
	
	public function getCostEstimate() {
		return $this->cost_estimate;
	}
	

	public function getResultXml() {
		return $this->sxml;
	}
	

	public function requestConsignment($wc_order, $wc_order_weight,	 $debug=0) {
		$this->pkg_number = "0";
		$this->urls = array();
		$this->cost_estimate = 0;
		$this->wc_order = $wc_order;

		$service_partner = NULL;
		$servicePartnerResponse = $this->requestServicePartners('NO', $wc_order->get_shipping_postcode());
		
		$sxml = simplexml_load_string($servicePartnerResponse);
		
		echo "<pre>".print_r($sxml->{'service-partners'}->{'service-partner'},1)."</pre>";

		if($sxml->{'service-partners'}->{'service-partner'} != NULL) {
			$partner = $sxml->{'service-partners'}->{'service-partner'}[0];
			$address = new mb_address(
				$partner->{'name'},
				$partner->{'address1'},
				$partner->{'address2'},
				$partner->{'postcode'},
				$partner->{'city'},
				$partner->{'country'}
			);
			$service_partner = new mb_service_partner(
				$partner->{'number'},
				$address
			);
		}

		$xml = $this->toXmlFromWcOrder($wc_order, $wc_order_weight, $service_partner); 

		curl_setopt($this->curl, CURLOPT_URL, $this->consignment_url);
		curl_setopt($this->curl, CURLOPT_POST, 1);
		curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, "POST");
		
		if($debug == 0) echo "XML<br>\n".print_r($xml,1)."<br>\n";
		
		curl_setopt($this->curl, CURLOPT_POSTFIELDS, $xml);
		$headers = array(
			"X-Cargonizer-Key:".$this->api_key,
			"X-Cargonizer-Sender:".$this->sender_id,
			"Content-type:application/xml",
			"Content-length:".strlen($xml),
		);
		if($debug == 1) echo "Header\n".print_r($headers,1)."<br>\n";	
		curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers); 
		
		if($debug == 0) $response = $this->runRequest($debug);
		
		if($debug == 1) $this->parseResponse($response,$debug);
		
		return $response;
	}

	
	public function requestTransportAgreements($url = "") {
		if($url == '') $url = $this->transport_agreement_url;
		echo "URL: $url<br>\n";
		curl_setopt($this->curl, CURLOPT_URL, $url);
		curl_setopt($this->curl, CURLOPT_POST, 0);
		$headers = array(
			"X-Cargonizer-Key:".$this->api_key,
			"X-Cargonizer-Sender:".$this->sender_id,
			"Content-type:application/xml",
			"Content-length:0",
		);
		curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
		$response = $this->runRequest($debug);
		
		return $response;
	}
		

	public function requestServicePartners($country, $postcode, $url = "") {
		if($url == '') $url = $this->service_partners_url;
		
		$url = $url . '?country=' . $country . '&postcode=' . $postcode;

		curl_setopt($this->curl, CURLOPT_URL, $url);
		curl_setopt($this->curl, CURLOPT_POST, 0);
		$headers = array(
			"X-Cargonizer-Key:".$this->api_key,
			"X-Cargonizer-Sender:".$this->sender_id,
			"Content-type:application/xml",
			"Content-length:0",
		);
		curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
		$response = $this->runRequest();
		
		return $response;
	}

	private function runRequest($debug=0) {
		$response = curl_exec($this->curl); 
		if(!curl_errno($this->curl)) { 
			$info = curl_getinfo($this->curl); 
			if($debug == 1) echo 'Took ' . $info['total_time'] . ' seconds to send a request to ' . $info['url']."<br>\n"; 
		} else { 
			if($debug == 1) echo 'Curl error: ' . curl_error($this->curl)."<br>\n";
			$this->error_flag = 1;
			$this->errors['curl_request'] .= curl_error($this->curl)."\n";
		} 
		return $response;
	}
	
	private function parseResponse($xml,$debug=0) {
		$sxml = simplexml_load_string($xml);
		$this->sxml = $sxml;
		
		if($sxml->getName() == "errors") {
			if($debug == 1) echo "SXML<br><pre>".print_r($sxml,1)."</pre>";
			$this->error_flag = 1;
			if(array_key_exists('parsing', $this->errors)) $this->errors['parsing'] .= $sxml."\n".print_r($this->data,1);
		} else {
			if($debug == 1) echo "SXML<br><pre>".print_r($sxml,1)."</pre>";
		}
		foreach($sxml->consignment as $consignment) {
			$this->pkg_number = (string)$consignment->{'number-with-checksum'};
			if($debug == 1) echo "PDF: ".$consignment->{'consignment-pdf'}."<br>\n";
			$this->urls['consignment-pdf'] = $consignment->{'consignment-pdf'};
			$this->urls['collection-pdf'] = (string)$consignment->{'collection-pdf'};
			$this->urls['waybill-pdf'] = (string)$consignment->{'waybill-pdf'};
			$this->urls['tracking-url'] = (string)$consignment->{'tracking-url'};
			if($debug == 1) echo "Values: ".print_r((string)$consignment->{'cost-estimate'}->gross,1)."<br>\n";
			$this->cost_estimate = (string)$consignment->{'cost-estimate'}->gross;
		}
	}

	private function toXmlFromWcOrder($order, $wc_order_weight, $service_partner) {
		$order_senders_ref = '#' . $order->get_order_number() . ' ';
	  
	  	// Adding product names in short format for ref on printed labels
	  	foreach ($order->get_items() as $item_id => $item_data) {
		  $product = $item_data->get_product();
		  $product_name = $product->get_name(); 
		  $item_quantity = $item_data->get_quantity();

		  if (strpos($product_name, 'Kaffeabonnement') !== false) {
			$name = str_ireplace('Kaffeabonnement - ', 'ABO', $product_name);
			$name2 = str_ireplace(', Månedlig', '', $name);
			$shortName = str_ireplace(', Annenhver uke', '', $name2);
			$order_senders_ref = $order_senders_ref . ' ' . $shortName . ' ';

		  } else {

			$pos1 = strpos($product_name, '(');
			$pos2 = strpos($product_name, ')');
			if($pos1 === false || $pos2 === false) {
			  $order_senders_ref = $order_senders_ref + $item_quantity . $product_name . ' ';

			} else {
			  $shortName = substr($product_name, $pos1 + 1, $pos2 - $pos1 - 1);
			  $order_senders_ref = $order_senders_ref . $item_quantity . $shortName . ' ';
			}
		  }
		}
	  
		$order_customer_number = $order->get_customer_id();
		$order_name = $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name();
		$order_address1 = $order->get_shipping_address_1();
		$order_address2 = $order->get_shipping_address_2();
		$order_postcode = $order->get_shipping_postcode();
		$order_city = $order->get_shipping_city();
		$order_country = $order->get_shipping_country();

		$order_email = $order->get_billing_email();
		$order_mobile = $order->get_billing_phone();

		$order_weight = $wc_order_weight / 1000; // cargonizer wants kilogram

		$xw = xmlwriter_open_memory();
		xmlwriter_set_indent($xw, 1);
		$res = xmlwriter_set_indent_string($xw, ' ');

		xmlwriter_start_document($xw, '1.0', 'UTF-8');

		// Root element
		xmlwriter_start_element($xw, 'consignments');

		xmlwriter_start_element($xw, 'consignment');

		$this->createXmlAttr($xw, "transport_agreement", $this->transport_agreement);

		xmlwriter_start_element($xw, 'product');
		xmlwriter_text($xw, 'postnord_parcel_letter_mypack');
		xmlwriter_end_element($xw); // product

		xmlwriter_start_element($xw, 'parts');
		
			xmlwriter_start_element($xw, 'consignee');

				xmlwriter_start_element($xw, 'number');
				xmlwriter_text($xw, $order_customer_number);
				xmlwriter_end_element($xw); // number			
				xmlwriter_start_element($xw, 'name');
				xmlwriter_text($xw, $order_name);
				xmlwriter_end_element($xw); // name
				xmlwriter_start_element($xw, 'address1');
				xmlwriter_text($xw, $order_address1);
				xmlwriter_end_element($xw); // address1		
				xmlwriter_start_element($xw, 'address2');
				xmlwriter_text($xw, $order_address2);
				xmlwriter_end_element($xw); // address2			
				xmlwriter_start_element($xw, 'postcode');
				xmlwriter_text($xw, $order_postcode);
				xmlwriter_end_element($xw); // postcode
				xmlwriter_start_element($xw, 'city');
				xmlwriter_text($xw, $order_city);
				xmlwriter_end_element($xw); // city
				xmlwriter_start_element($xw, 'country');
				xmlwriter_text($xw, $order_country);
				xmlwriter_end_element($xw); // country
				xmlwriter_start_element($xw, 'email');
				xmlwriter_text($xw, $order_email);
				xmlwriter_end_element($xw); // email
				xmlwriter_start_element($xw, 'mobile');
				xmlwriter_text($xw, $order_mobile);
				xmlwriter_end_element($xw); // mobile

			xmlwriter_end_element($xw); // consignee

			if($service_partner != NULL) {
				xmlwriter_start_element($xw, 'service_partner');
					xmlwriter_start_element($xw, 'number');
					xmlwriter_text($xw, $service_partner->service_partner_number);
					xmlwriter_end_element($xw); // number
					xmlwriter_start_element($xw, 'name');
					xmlwriter_text($xw,  $service_partner->address->name);
					xmlwriter_end_element($xw); // name
					xmlwriter_start_element($xw, 'address1');
					xmlwriter_text($xw, $service_partner->address->address1);
					xmlwriter_end_element($xw); // address1
					xmlwriter_start_element($xw, 'address2');
					xmlwriter_text($xw, $service_partner->address->address2);
					xmlwriter_end_element($xw); // address2
					xmlwriter_start_element($xw, 'postcode');
					xmlwriter_text($xw, $service_partner->address->postcode);
					xmlwriter_end_element($xw); // postcode
					xmlwriter_start_element($xw, 'city');
					xmlwriter_text($xw, $service_partner->address->city);
					xmlwriter_end_element($xw); // city
					xmlwriter_start_element($xw, 'country');
					xmlwriter_text($xw, $service_partner->address->country);
					xmlwriter_end_element($xw); // country
				xmlwriter_end_element($xw); // service_partner
			}

		xmlwriter_end_element($xw); // parts

		xmlwriter_start_element($xw, 'items');

			xmlwriter_start_element($xw, 'item');
			$this->createXmlAttr($xw, "type", "package");
			$this->createXmlAttr($xw, "amount", "1");
			$this->createXmlAttr($xw, "weight", '' . $order_weight);
			xmlwriter_end_element($xw); // item

		xmlwriter_end_element($xw); // items

		xmlwriter_start_element($xw, 'services');
		// xmlwriter_text($xw, $order_name);
		xmlwriter_end_element($xw); // services

		xmlwriter_start_element($xw, 'references');
			xmlwriter_start_element($xw, 'consignor');
			xmlwriter_text($xw, $order_senders_ref);
			xmlwriter_end_element($xw); // consignor
		xmlwriter_end_element($xw); // references

		xmlwriter_start_element($xw, 'return_address');
			xmlwriter_start_element($xw, 'name');
			xmlwriter_text($xw, 'Maridalen Brenneri AS');
			xmlwriter_end_element($xw); // name
			xmlwriter_start_element($xw, 'address1');
			xmlwriter_text($xw, 'Sørbråtveien 36');
			xmlwriter_end_element($xw); // address1
			xmlwriter_start_element($xw, 'postcode');
			xmlwriter_text($xw, '0891');
			xmlwriter_end_element($xw); // postcode
			xmlwriter_start_element($xw, 'city');
			xmlwriter_text($xw, 'Oslo');
			xmlwriter_end_element($xw); // city
			xmlwriter_start_element($xw, 'country');
			xmlwriter_text($xw, 'NO');
			xmlwriter_end_element($xw); // country
		xmlwriter_end_element($xw); // return_address
		
		xmlwriter_end_element($xw); // consignment

		xmlwriter_end_element($xw); // consignments

		xmlwriter_end_document($xw);

		return xmlwriter_output_memory($xw);
	}

	private function createXmlAttr($xw, $name, $value){
		xmlwriter_start_attribute($xw, $name);
		xmlwriter_text($xw, $value);
		xmlwriter_end_attribute($xw);
	}
}

class mb_address {
	public $name;
	public $address1;
	public $address2;
	public $postcode;
  	public $city;
	public $country;

	public function __construct($name, $address1, $address2, $postcode, $city, $country) {
		$this->name = $name;
		$this->address1 = $address1;
		$this->address2 = $address2;
		$this->postcode = $postcode;
	  	$this->city = $city;
		$this->country = $country;
	}
}

class mb_service_partner {
	public $service_partner_number;
	public $address;

	public function __construct($service_partner_number, $address) {
		$this->service_partner_number = $service_partner_number;
		$this->address = $address;
	}
}

*/