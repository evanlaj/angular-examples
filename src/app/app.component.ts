import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingComponent,
    ColorPickerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  form: FormGroup = new FormGroup({
    rating: new FormControl(0)
  });

  rating = 2; // on peut aussi initialiser la valeur du composant
}
