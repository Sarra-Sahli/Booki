// password-strength.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  template: `
    <div class="password-strength">
      <div class="progress-container">
        <div 
          class="progress-bar" 
          [style.width.%]="strength"
          [class.very-weak]="strength <= 20"
          [class.weak]="strength > 20 && strength <= 40"
          [class.moderate]="strength > 40 && strength <= 60"
          [class.strong]="strength > 60 && strength <= 80"
          [class.very-strong]="strength > 80"
        ></div>
      </div>
      <div class="strength-message">{{message}}</div>
    </div>
  `,
  styles: [`
    .password-strength {
      margin-top: 8px;
    }
    .progress-container {
      height: 5px;
      background-color: #f0f0f0;
      border-radius: 5px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      transition: width 0.3s ease;
    }
    .very-weak { background-color: #ff4d4d; }
    .weak { background-color: #ffa64d; }
    .moderate { background-color: #ffcc00; }
    .strong { background-color: #66cc66; }
    .very-strong { background-color: #2ecc71; }
    .strength-message {
      font-size: 12px;
      margin-top: 4px;
      color: #666;
    }
  `]
})
export class PasswordStrengthComponent {
  @Input() strength: number = 0;
  @Input() message: string = '';
}