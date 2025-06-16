import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-files-tree',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './files-tree.component.html',
  styleUrl: './files-tree.component.scss'
})
export class FilesTreeComponent {

  bgIndex = 0;
  iconBgList = ['green', 'purple', 'blue'];

  getBgIndex(index: number) {
    if (index % 3 == 0) {
      this.bgIndex = 0;
    }else{
      this.bgIndex++
    }
    return this.bgIndex;
  }
}
