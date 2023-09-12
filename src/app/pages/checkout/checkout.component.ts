import { Component, OnInit } from '@angular/core';
import { delay, switchMap, tap } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Store } from 'src/app/shared/Interface/store.interface';
import { NgForm } from '@angular/forms';
import { Details } from 'src/app/shared/Interface/order.interface';
import { Product } from '../products/interface/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  model ={
    name:'Dominicode',
    store: '',
    shippingAddress: '',
    city:'',
  };
  isDelivery= true;
  cart: Product[] = [];

  stores :Store[] = []
  constructor(
    private dataSvc: DataService, 
    private shoppingCartSvc:ShoppingCartService,
    private router: Router,
    private productSvc: ProductsService ) { 
      this.checkIfCartIsEmpty();
    }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }
  
  onPickupOrDelivery(value:boolean): void {
    this.isDelivery = value
  }
  onSubmit({value: formData}: NgForm){
    console.log('guardar', formData);
    const data ={
      ...formData,
      date:this.getCurrentDay(),
      isDelivery:this.isDelivery
    }
    this.dataSvc.saveOrder(data)
    .pipe(
      tap(res => console.log('Order ->', res)),
      switchMap(({id:orderId}) =>{
        const details =this.prepareDetails();
        return this.dataSvc.saveDetailsOrder({details, orderId});
        }),
        tap( ()=> this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap( ()=> this.shoppingCartSvc.resetCart()),
    )
    .subscribe();
  }
  private getStores(): void {
    //Todo:dessucrirbirte
    this.dataSvc.getStores()
    .pipe(
      tap( (stores:Store[])=>this.stores=stores) )
    .subscribe()
  }
  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details : Details[] = [];
    this.cart.forEach((product: Product)=> {
      const {id:productId, name:productName, qty:quantity, stock} = product;
      const updateStock = (stock - quantity);

      this.productSvc.updateStock(productId, updateStock)
      .pipe(
        tap(()=> details.push({productId, productName, quantity}))
      )
      .subscribe()

      
    })
    return details;
  }
  private getDataCart(): void {
    this.shoppingCartSvc.cartActions$.pipe(
      tap((products:Product[])=> this.cart = products)
    )
    .subscribe();
  }
  private checkIfCartIsEmpty():void {
    this.shoppingCartSvc.cartActions$
    .pipe(
      tap((products: Product[]) => {
        if(Array.isArray(products)&& !products.length){
         this.router.navigate(['/products']);
        }
        })
    )
  }
}
