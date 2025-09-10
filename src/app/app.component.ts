import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorInputComponent } from './components/color-input/color-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingComponent,
    ColorInputComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  rating = 2; // on peut aussi initialiser la valeur du composant
  color: string = 'c0ffee';

  form: FormGroup = new FormGroup({
    rating: new FormControl(0),
    // disabled color
    color: new FormControl({value: 'c0ffee', disabled: true})
  });

}
