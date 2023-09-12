import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you-page',
  template: `<div class="container">
  <h1 class="title">Thank You!</h1>
  <p class="content">
      Your Order is on the way
  </p>
  <span>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Consequuntur deleniti nisi facere rem sequi incidunt eos error totam, 
      culpa dignissimos vero sint voluptas commodi impedit perferendis nostrum sit minima adipisci.
  </span>
</div>`,
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent  {

  constructor() { }

  ngOnInit(): void {
  }

}
