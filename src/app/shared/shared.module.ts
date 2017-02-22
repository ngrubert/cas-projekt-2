import { NgModule } from '@angular/core';

import { SharedComponent } from './shared.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [],
  exports: [
    SharedComponent,
    TranslateModule
  ],
  declarations: [SharedComponent],
  providers: [],
})
export class SharedModule { }
