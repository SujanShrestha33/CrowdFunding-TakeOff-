import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() currentAmount: number;
  @Input() goalAmount: number;

  getProgressPercentage(): number {
    return Math.min(100, Math.floor((this.currentAmount / this.goalAmount) * 100));
  }
}
