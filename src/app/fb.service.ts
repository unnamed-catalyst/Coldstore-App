import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';



export interface supplier {
  id?: string
  email: string,
  name: string
}
export interface staff {
  id?: string
  email: string,
  name: string
}

export interface item {
  id?: string
  name: string,
  supplier: string,
  quantityPerBox: number,
  stock: number,
  threshhold:number,
  price:number,
  moving:string,
  category:string
}

export interface schedule {
  id?: string
  day: string,
  employeeName: string,
  shift: string
}

export interface trades {
  id?: string
  fromDay: string,
  fromName: string,
  fromShift: string,
  toDay: string,
  toName: string,
  toShift: string,
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class FBService {
  public suppliers!: Observable<supplier[]>;
  public supplierCollection!: AngularFirestoreCollection<supplier>;

  public staff!: Observable<staff[]> ;
  public staffCollection!: AngularFirestoreCollection<staff>;

  public items!: Observable<item[]> ;
  public itemsCollection!: AngularFirestoreCollection<item>;

  public schedules!: Observable<schedule[]>;
  public scheduleCollection!: AngularFirestoreCollection<schedule>;

  public trades!: Observable<trades[]>;
  public tradeCollection!: AngularFirestoreCollection<trades>;

  constructor(public  afs:  AngularFirestore, public alertCtrl:AlertController,
              public  afAuth: AngularFireAuth
              )  {
                this.staffCollection  =  this.afs.collection<staff>('staffTable');
                this.staff  =  this.staffCollection.snapshotChanges().pipe(
                    map(actions  =>  {
                        return  actions.map(a  =>  {
                            const  data  =  a.payload.doc.data();
                            const  id  =  a.payload.doc.id;
                            return  {  id,  ...data  };
                        });
                    })
                );   

                this.scheduleCollection  =  this.afs.collection<schedule>('schedules');
                this.schedules  =  this.scheduleCollection.snapshotChanges().pipe(
                    map(actions  =>  {
                        return  actions.map(a  =>  {
                            const  data  =  a.payload.doc.data();
                            const  id  =  a.payload.doc.id;
                            return  {  id,  ...data  };
                        });
                    })
                );   

            this.supplierCollection  =  this.afs.collection<supplier>('suppliersTable');
            this.suppliers  =  this.supplierCollection.snapshotChanges().pipe(
                map(actions  =>  {
                    return  actions.map(a  =>  {
                        const  data  =  a.payload.doc.data();
                        const  id  =  a.payload.doc.id;
                        return  {  id,  ...data  };
                    });
                })
            );

            this.tradeCollection  =  this.afs.collection<trades>('trades');
            this.trades  =  this.tradeCollection.snapshotChanges().pipe(
                map(actions  =>  {
                    return  actions.map(a  =>  {
                        const  data  =  a.payload.doc.data();
                        const  id  =  a.payload.doc.id;
                        return  {  id,  ...data  };
                    });
                })
            );

            this.itemsCollection  =  this.afs.collection<item>('itemsTable');
                this.items  =  this.itemsCollection.snapshotChanges().pipe(
                    map(actions  =>  {
                        return  actions.map(a  =>  {
                            const  data  =  a.payload.doc.data();
                            const  id  =  a.payload.doc.id;
                            return  {  id,  ...data  };
                        });
                    })
                );
        }
      
    getsuppliers():  Observable<supplier[]>  {
        return  this.suppliers;
    }
    getAllStaff():  Observable<staff[]>  {
      return  this.staff;
    }
    getItems():  Observable<item[]>  {
      return  this.items;
    }
    getschedules():  Observable<schedule[]>  {
      return  this.schedules;
  }

    // getSundaySchedules(): Observable<schedule[]>{
    //   this.schedules = this.scheduleCollection.ref.where("day", "==", "Sunday").get();
    //   return this.schedules
    // }
  
  
    // getsupplier(id:  string):  Observable<supplier>  {
    //           return  this.supplierCollection.doc<supplier>(id).valueChanges().pipe(
    //               map(idea  =>  {
    //                   idea.id  =  id;
    //                   return  idea
    //               })
    //           );
    //       }
    
    getStaff(id:  string):  Observable<staff>  {
      // @ts-ignore
        return  this.staffCollection.doc<staff>(id).valueChanges().pipe(
              map(idea  =>  {
                // @ts-ignore
                idea.id  =  id;
                return  idea
              })
          );
        }      
        
    addsupplier(supplier:  supplier):  Promise<DocumentReference>  {
            return  this.supplierCollection.add(supplier); 
    }
    addstaff(staff:  staff):  Promise<DocumentReference>  {
      return  this.staffCollection.add(staff); 
    }
    additem(item:  item):  Promise<DocumentReference>  {
      return  this.itemsCollection.add(item); 
    }
    addschedules(schedule:  schedule):  Promise<DocumentReference>  {
      return  this.scheduleCollection.add(schedule); 
    }
  
    updatesupplier(supplier:  supplier):  Promise<void>  {
        return  this.supplierCollection.doc(supplier.id).update({  email:  supplier.email,  name:  supplier.name  });
    }
    updateStaff(staff:  staff):  Promise<void>  {
      return  this.staffCollection.doc(staff.id).update({  email:  staff.email,  name:  staff.name });
  }
  updateItem(item:item):  Promise<void>  {
    return  this.itemsCollection.doc(item.id).update({  name: item.name, supplier: item.supplier ,
        quantityPerBox: item.quantityPerBox, stock: item.stock,
      threshhold:item.threshhold,  price:item.price, moving:item.moving, category:item.category });
}

updateItemQty(item:item, qty: number): Promise<void>  {
  return  this.itemsCollection.doc(item.id).update({ stock: qty });
}

updateTradeAccept(trade: trades){
  return this.tradeCollection.doc(trade.id).update({ status: "Accepted" })
}

  updateSchedule(schedule:  schedule):  Promise<void>  {
  return  this.scheduleCollection.doc(schedule.id).update({   day: schedule.day, employeeName: schedule.employeeName, shift: schedule.shift });
}  

  updateScheduleEmployee(schedule:  schedule, name: string):  Promise<void>  {
  return  this.scheduleCollection.doc(schedule.id).update({   day: schedule.day, employeeName: name, shift: schedule.shift });
}
  
    deletesupplier(id:  string):  Promise<void>  {
        return  this.supplierCollection.doc(id).delete();
    }
    deleteStaff(id:  string):  Promise<void>  {
      return  this.staffCollection.doc(id).delete();
  }

  deleteItem(id:  string):  Promise<void>  {
    return  this.itemsCollection.doc(id).delete();
}

deleteTrade(trade: trades):  Promise<void>  {
  return  this.tradeCollection.doc(trade.id).delete();
}

  setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;
  
    // Set it expire in 7 days
    date.setTime(date.getTime() + (60 * 60 * 1000));
  
    // Set it
    document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
  }
  // @ts-ignore
  getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length == 2) {
      // @ts-ignore
      return parts.pop().split(";").shift();
   }
  }
  deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}
      

    async Msg(header:any, msg:any){
        let alert =await this.alertCtrl.create({
          header: header,
          message: msg,
          buttons: ['OK']
        });
        alert.present();
    }
   
    SignIn(newEmail: string, newPassword: string): Promise<any> {
      return this.afAuth.signInWithEmailAndPassword(newEmail, newPassword);
    }

    SignOut(): Promise<void> {
      return this.afAuth.signOut();
   }

    SignUp(newEmail: string, newPassword: string): Promise<any> {
      return this.afAuth.createUserWithEmailAndPassword(newEmail, newPassword);
    }
    
    
}