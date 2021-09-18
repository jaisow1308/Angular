/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { SettingsConstant } from "../../model/settings-constant";
import { DbService } from "../../services/db.service";
import { MasterConstant } from "../master/manage-masters/master.constant";
import { VyaRestClientService } from "vya-restclient";
import { catchError, map, mapTo } from "rxjs/operators";

// import { CustomerConstant } from "./customer-constant";
// import { CustomerHistoryConstant } from "./customer-history-constant";
import { CustomerHistory } from "./customer-history.model";
import { Customer } from "./customer.model";


@Injectable()
export class DataService {
  constructor(private dbService: DbService,
    private restClient: VyaRestClientService) {}
  
  customerUrl ="/api/customer" ;

    getAll(): Observable<any> {
      return  this.restClient.get(`${this.customerUrl}`).pipe(
        map((value: any) => {
          console.log(value)
          return value.response;
        }),
        catchError(error => {
          return error;
        })
      );
    }
    // getAll(): Observable<any> {
    //   return new Observable((observer) => {
    //     this.restClient.get(`${this.customerUrl}`).subscribe(
    //       (result: any) => {
    //         console.log(result)
    //         observer.next(result);
            
    //       },
    //       (error: any) => {
    //         console.error("Error in getting all document:", error);
    //         observer.next(error);
    //       }
    //     );
    //   });
    // }

    create(data: any): Observable<any> {
      return this.restClient.post(`${this.customerUrl}`, data).pipe(
        map((value: any) => {
          console.log(value)
          return value.response;
        }),
        catchError(error => {
          console.log(error)
          return error;
        })
      );
    }
    // create(customer: Customer): Observable<any> {
    //   const data = JSON.parse(JSON.stringify(customer));
    //   return new Observable(observer => {
    //     this.dbService.create(data).subscribe(
    //       (result: any) => {
    //         observer.next(result);
    //       },
    //       (error: any) => {
    //         console.error("Error in creating document:", error);
    //         observer.next(error);
    //       }
    //     );
    //   });
    // }

    // create(customer: Customer): Observable<any> {
    //   const data = JSON.parse(JSON.stringify(customer));
    //   return new Observable((observer) => {
    //     this.restClient.post(`${this.customerUrl}`, data).pipe(
    //       map((value: any) => {
    //           console.log(value);
    //         return observer.next(value);
    //       }),
    //       catchError((error: any) => {
    //           console.log(error);
    //         return error;
    //       })
    //     );
    //   });
    // }

    // create(customer: Customer): Observable<any> {
    //   const data = JSON.parse(JSON.stringify(customer));
    //   return new Observable(observer => {
    //     this.dbService.create(data).subscribe(
    //       (result: any) => {
    //         console.log(result)
    //         observer.next(result);
    //       },
    //       (error: any) => {
    //         console.error("Error in creating document:", error);
    //         observer.next(error);
    //       }
    //     );
    //   });
    // }

    // create(customer:any){
    //   return this.restClient.post(`${this.customerUrl}`, customer)
  
    //   .pipe(
    //     map((value: any) => {
    //         console.log(value);
    //       return value;
    //     }),
    //     catchError((error: any) => {
    //         console.log(error);
    //       return error;
    //     })
    //   );
    // }

  createCustomerHistory(customerHistory: CustomerHistory): Observable<any> {
    // const data = JSON.parse(JSON.stringify(CustomerHistory));
    return new Observable((observer) => {
      this.dbService.create(customerHistory).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in creating document:", error);
          observer.next(error);
        }
      );
    });
  }

 

  // createCustomerHistory(customerHistory: CustomerHistory): Observable<any> {
  //   const data = JSON.parse(JSON.stringify(customerHistory));
  //   return new Observable(observer => {
  //     this.dbService.create(data).subscribe(
  //       (result: any) => {
  //         observer.next(result);
  //       },
  //       (error: any) => {
  //         console.error("Error in creating document:", error);
  //         observer.next(error);
  //       }
  //     );
  //   });
  // }

  get(_id: string): Observable<any> {
    return new Observable((observer) => {
      this.dbService.get(`${this.customerUrl}/${_id}`).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in getting document:", error);
          observer.next(error);
        }
      );
    });
  }

    getAllCustomerHistory(): Observable<any> {
        return new Observable((observer) => {
          this.dbService.get(`${this.customerUrl}`).subscribe(
            (result: any) => {
              observer.next(result);
            },
            (error: any) => {
            console.error("Error in getting all document:", error);
            observer.next(error);
            }
          );
        });
      }

  getAllMasterData(): Observable<any> {
    return new Observable(observer => {
      this.dbService
        .getAll(MasterConstant.KEY_DOC_TYPE, MasterConstant.DOC_TYPE)
        .subscribe(
          (result: any) => {
            observer.next(result);
          },
          (error: any) => {
            console.error("Error in getting all document:", error);
            observer.next(error);
          }
        );
    });
  }

  getAllSettings(): Observable<any> {
    return new Observable(observer => {
      this.dbService
        .getAll(SettingsConstant.KEY_DOC_TYPE, SettingsConstant.DOC_TYPE)
        .subscribe(
          (result: any) => {
            observer.next(result);
          },
          (error: any) => {
            console.error("Error in getting all document:", error);
            observer.next(error);
          }
        );
    });
  }

  // getAllCustomerHistory(): Observable<any> {
  //   return new Observable(observer => {
  //     this.dbService
  //       .getAll(
  //         CustomerHistoryConstant.KEY_DOC_TYPE,
  //         CustomerHistoryConstant.DOC_TYPE
  //       )
  //       .subscribe(
  //         (result: any) => {
  //           observer.next(result);
  //         },
  //         (error: any) => {
  //           console.error("Error in getting all document:", error);
  //           observer.next(error);
  //         }
  //       );
  //   });
  // }

  // createCustomerHistory(customerHistory: CustomerHistory): Observable<any> {
  //   const data = JSON.parse(JSON.stringify(customerHistory));
  //   return new Observable(observer => {
  //     this.dbService.create(data).subscribe(
  //       (result: any) => {
  //         observer.next(result);
  //       },
  //       (error: any) => {
  //         console.error("Error in creating document:", error);
  //         observer.next(error);
  //       }
  //     );
  //   });
  // }

  // get(_id: string): Observable<any> {
  //   return new Observable(observer => {
  //     this.dbService.get(_id).subscribe(
  //       (result: any) => {
  //         observer.next(result);
  //       },
  //       (error: any) => {
  //         console.error("Error in getting document:", error);
  //         observer.next(error);
  //       }
  //     );
  //   });
  // }

  update(_id: string, customer: Customer): Observable<any> {
    const data = JSON.parse(JSON.stringify(customer));
    return new Observable(observer => {
      this.dbService.update(data).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in updating document:", error);
          observer.next(error);
        }
      );
    });
  }

  delete(_id: string): Observable<any> {
    return new Observable(observer => {
      this.dbService.remove(_id).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in deleting document:", error);
          observer.next(error);
        }
      );
    });
  }
}
