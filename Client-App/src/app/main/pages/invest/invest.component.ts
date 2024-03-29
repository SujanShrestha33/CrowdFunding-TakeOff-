import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss']
})
export class InvestComponent {
  // amount: string = '';
  // taxamount: string = '';
  // totalAmount: string = '';
  // transactionUiid: string = '';
  // projectCode: string = '';
  // productServiceCharge: string = '0';
  // productDeliveryCharge: string = '0';
  // successUrl: string = 'http://localhost:8080/esewa/verify-payment';
  // failedUrl: string = 'https://google.com';
  // signedFieldnames: string = '';
  // signatures: string = '';

  constructor(private http: HttpClient) { }

  // submit() {
  //   const message = `total_amount=100,transaction_uuid=ab14a8f2b02c3,product_code=EPAYTEST`;
  //   const hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");
  //   const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  //   console.log(hashInBase64);
  //   const formData = new FormData();
  //   formData.append('amount', this.amount);
  //   formData.append('tax_amount', this.taxamount);
  //   formData.append('total_amount', this.totalAmount);
  //   formData.append('transaction_uuid', this.transactionUiid);
  //   formData.append('product_code', 'EPAYTEST');
  //   formData.append('product_service_charge', this.productServiceCharge);
  //   formData.append('product_delivery_charge', this.productDeliveryCharge);
  //   formData.append('success_url', this.successUrl);
  //   formData.append('failure_url', this.failedUrl);
  //   formData.append('signed_field_names', 'total_amount,transaction_uuid,product_code');
  //   formData.append('signature', hashInBase64);

  //   console.log(formData); // Check if form data is correctly populated
  //   console.log(JSON.stringify(formData))

  //   formData.forEach((value,key) => {
  //      console.log(key+" "+value)
  //    });
  //   this.http.post<any>('https://rc-epay.esewa.com.np/api/epay/main/v2/form', formData)
  //     .subscribe({
  //       next: (res) => {
  //         console.log(res);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       }
  //     });
  // }

  formData: any = {};

  submitForm() {
    const signatureData = `tootal_amount=${this.formData.total_amount},transaction_uiid=${this.formData.transaction_uuid},produc_code=EPAYTEST`;
    const secretKey = '8gBm/:&EnhH.1/q'; // Replace with your secret key
    const hash = CryptoJS.HmacSHA256(signatureData, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    this.formData.signature = signature;

    // For demonstration purposes, log the form data to console
    console.log(this.formData);

    // Now you can submit the form data to the server
    // Example:
    this.http.post('https://rc-epay.esewa.com.np/api/epay/main/v2/form', this.formData).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }
}
