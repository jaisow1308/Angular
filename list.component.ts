/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ConfirmationModalService } from "../../../lib/components/confirmation/confirmation-modal-service";
// import { Settings } from '../../../model/settings/settings.model';
// import { Customer } from "../customer.model";
import { DataService } from "../data.service";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
// import { values } from "lodash";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  // component
  displayView: string = "table";
  submitted: boolean = false;
  customerData: any[]= [];
  settingsData: any[] = [];

  searchText: string | undefined = undefined;
  defaultPagination: string | undefined = undefined;
  nameFilter: string | undefined = undefined;

  // pagination
  page: number = 1;

  // checkbox
  isChecked: boolean = false;
  checkedIdList: any[] = [];
  id: string = "";

  // filter
  isCollapsed: boolean = true;
  filterStatus: boolean = false;
  actualList: boolean = true;
  settings: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private modelService: ConfirmationModalService
  ) {}
  
  ngOnInit() {
    this.getAllDocumentDetails();
    this.dataService.getAll().subscribe((datas: any) => {
      console.log(datas)

      if(datas){
        const tempData: any =[];        
        datas.rows.forEach( (val:any)=> {
          const data:any ={
            name:val.doc.name,
            gst: val.doc.gst,
            address: val.doc.address,
            contactNumber: val.doc.contactNumber,
            whatsappNumber:val.doc.whatsappNumber,
            email:val.doc.email
          }
          tempData.push(data);          
        });        
        console.log(datas)
        this.customerData = this.customerData.concat(tempData);
      }
    });

  }

  getAllDocumentDetails() {
    // @ts-ignore TS2345
    this.settings = JSON.parse(localStorage.getItem("settings"));
    this.defaultPagination = this.settings.paginate;
  }

  applyFilter() {
    this.actualList = false;
    this.filterStatus = true;
  }

  reset() {
    this.actualList = true;
    this.filterStatus = false;
  }

  onDelete(_id: string) {
    const modal = this.modelService.createConfirmationModal();
    modal.content.showConfirmationModal(
      "Delete Confirmation",
      "Are you sure want to delete " + name + "?"
    );

    modal.content.onClose.subscribe((result: boolean) => {
      if (result === true) {
        // when pressed Yes
        this.dataService.delete(_id).subscribe(() => {
          this.getAllDocumentDetails();
        });
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  getSelectedId(isChecked: boolean, id: string) {
    this.id = id;
    if (isChecked === true) {
      this.checkedIdList.push(this.id);
    } else {
      const index = this.checkedIdList.indexOf(this.id);
      this.checkedIdList.splice(index);
    }
  }

  viewDocument(_id: string) {
    this.router.navigate(["/customer/view"], { queryParams: { id: _id } });
  }

  editDocument(_id: string) {
    this.router.navigate(["/customer/edit"], { queryParams: { id: _id } });
  }

  refreshPage() {
    this.getAllDocumentDetails();
  }

  exportFile() {
    const filename = "Customer";
    const exceldata = this.customerData.map((data: any) => {
      return {
        name: data.name,
        adress: data.address,
        email: data.email,
        contactNumber: data.contactNumber,
        whatsappNumber: data.whatsappNumber,
        gst: data.gst,
        latitude: data.latitude,
        longitude: data.longitude,
        brands: data.brands,
        aboutUs: data.aboutUs,
        socialNetwork: data.socialNetwork
      };
    });
    this.exportAsExcelFile(exceldata, filename);
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"]
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
