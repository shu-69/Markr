import { Component } from '@angular/core';
import { SideSheetService } from '../../services/side-sheet.service';

@Component({
  selector: 'app-side-sheet',
  templateUrl: './side-sheet.component.html',
  styleUrl: './side-sheet.component.scss',
  standalone: false
})
export class SideSheetComponent {
  constructor(public sideSheetService: SideSheetService) {}
}
