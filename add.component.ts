import { HttpClient } from "@angular/common/http";
/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
// import { FormGroup } from "@angular/forms";
import { FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ConfirmationModalService } from "../../../lib/components/confirmation/confirmation-modal-service";
import { NotificationService } from "../../../services/notification.service";
// import { NamingSeriesService } from '../../../services/naming-series.service';
import { mapJsonToObject } from "../../../utils/json2object";
import { MasterMenuData } from "../../master/manage-masters/master-menu-default.model";
// import { CustomerConstant } from '../customer-constant';
import { CustomerObjectBuilder } from "../customer-object-builder";
import { Customer } from "../customer.model";
import { DataService } from "../data.service";
// import { FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  // component
  customerForm: FormGroup = new FormGroup({});
  alertMsg: boolean | undefined = undefined;
  submitted: boolean = false;
  customerId: string = "";
  phoneNumber: number | undefined = undefined;

  brands: FormArray = new FormArray([]);
  socialNetwork: FormArray = new FormArray([]);
  socialNetworkData: string[] = [];
  states: any[] = [];
  // image
  imageURL: any;
  imgURL: any;
  imagePath: string = "";
  imageData: string | undefined = undefined;
  photosData: any[] = [];
  isChecked: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    // private namingService: NamingSeriesService,
    private notificationService: NotificationService,
    private modelService: ConfirmationModalService,
    private httpService: HttpClient
  ) {}

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      name: ["", Validators.required],
      logo: [""],
      address: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      email: ["", Validators.required],
      contactPerson: ["", Validators.required],
      contactNumber: [
        "",
        [Validators.required, Validators.pattern("[0-9_-]{10}")]
      ],
      whatsappNumber: [""],
      gst: [""],
      longitude: ["", Validators.required],
      latitude: ["", Validators.required],
      brands: this.formBuilder.array([this.createBrands()]),
      Photos: [""],
      aboutUs: [""],
      socialNetwork: this.formBuilder.array([this.createSocialNetwork()])
    });
    this.getAllMasterDetails();

    this.httpService
      .get("./assets/data/bill-dropdown.json")
      .subscribe((result: any) => {
        this.states = result.states;
      });
  }

  getAllMasterDetails() {
    this.dataService.getAllMasterData().subscribe((result: any) => {
      const data = mapJsonToObject(result[0]["masterMenuData"], MasterMenuData);
      this.socialNetworkData = data.filter(
        (masterData: any) => masterData.application === "Social Master"
      );
    });
  }

  createBrands(): FormGroup {
    return this.formBuilder.group({
      brand: ""
    });
  }

  getControls() {
    return (this.customerForm.get("brands") as FormArray).controls;
  }

  addItem() {
    this.brands = this.customerForm.get("brands") as FormArray;
    this.brands.push(this.createBrands());
  }

  createSocialNetwork(): FormGroup {
    return this.formBuilder.group({
      socialNetwork: "",
      id: ""
    });
  }

  getSocialNetwork() {
    return (this.customerForm.get("socialNetwork") as FormArray).controls;
  }

  addsocialNetwork() {
    this.socialNetwork = this.customerForm.get("socialNetwork") as FormArray;
    this.socialNetwork.push(this.createSocialNetwork());
  }

  copyNumber() {
    this.customerForm.patchValue({
      whatsappNumber: this.phoneNumber
    });
  }

  handleFileInput(files: FileList) {
    // @ts-ignore TS2531
    const fileToUpload: File = files.item(0);
    const reader = new FileReader();
    const fileValue = new Promise(resolve => {
      reader.onload = () => {
        this.imageData = reader.result as any;
        // @ts-ignore TS2532
        if (this.imageData.length * 2 > 2 ** 21) {
          alert("File exceeds the maximum size");
        } // Note: 2*2**20 = 2**21
        resolve(reader.result);
      };
    });
    reader.readAsDataURL(fileToUpload);
    return fileValue;
  }

  handleFilePhotos(event: any) {
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (result: any) => {
          // @ts-ignore
          this.photosData.push(result.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  preview(files: any) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imgURL = reader.result;
    };
  }

  get f() {
    return this.customerForm.controls;
  }

  data = new FormGroup({
    name:new FormControl(''),
    gst:new FormControl(''),
    address:new FormControl(''),
    state:new FormControl(''),
    longitude:new FormControl(''),
    latitude:new FormControl(''),
    postalCode:new FormControl(''),
    email:new FormControl(''),
    contactNumber:new FormControl(''),
    whatsappNumber:new FormControl(''),
    contactPerson:new FormControl(''),
   })

  onFormSubmit(data: any) {
    this.dataService.create(data).subscribe((response)=>{
      this.data = new FormGroup({
        name:new FormControl(response['name']),
        gst:new FormControl(response['gst']),
        address:new FormControl(response['address']),
        state:new FormControl(response['state']),
        longitude:new FormControl(response['longitude']),
        latitude:new FormControl(response['latitude']),
        postalCode:new FormControl(response['postalCode']),
        email:new FormControl(response['email']),
        contactNumber:new FormControl(response['contactNumber']),
        whatsappNumber:new FormControl(response['whatsappNumber']),
        contactPerson:new FormControl(response['contactPerson']),
       })
       console.log(data)
      JSON.stringify(this.data);
      
    }     
    )
    this.submitted = true;

    if (this.customerForm.invalid) {
      this.notificationService.showError("Error","")
      return;
    }

    this.notificationService.showSuccess("Saved Successfully","")
    // this.namingService.createSerialNo(CustomerConstant.DOC_TYPE).subscribe((result: any) => {
    // this.customerId = result;
    const customer: Customer = CustomerObjectBuilder.create(
      data,
      this.customerId,
      this.imageData,
      this.photosData
    );

    this.dataService.create(customer).subscribe(() => {
      // this.namingService.updateNamingSeries().subscribe(() => {
      this.router.navigate(["/customer"]);
      // });
    });
    // });
  }

  onCancel() {
    const modal = this.modelService.createConfirmationModal();
    modal.content.showConfirmationModal(
      "Cancel Confirmation",
      "Are you sure want to cancel " + name + "?"
    );

    modal.content.onClose.subscribe((result: boolean) => {
      if (result === true) {
        // when pressed Yes
        this.router.navigateByUrl("/customer");
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  getSelectedId(value: any) {
    this.isChecked = value;
  }
}
