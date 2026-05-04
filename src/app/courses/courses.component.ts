import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  comingSoonOptions: AnimationOptions = {
    path: '/assets/anims/coming-soon.json',
    loop: true
  };

}
