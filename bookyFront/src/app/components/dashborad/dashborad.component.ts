import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.css']
})
export class DashboardComponent implements OnInit {
  chart: any;
  bookStats: {bookTitle: string, totalQuantity: number}[] = [];

  constructor(private cartService: CartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(): void {
    this.cartService.getCartItems().subscribe({
      next: (carts) => {
        this.processCartData(carts);
        this.createPieChart();
      },
      error: (err) => {
        console.error('Error loading cart data:', err);
      }
    });
  }

  processCartData(carts: any[]): void {
    const bookQuantityMap = new Map<string, number>();
    
    carts.forEach(cart => {
      if (cart.bookTitle) {
        const currentQuantity = bookQuantityMap.get(cart.bookTitle) || 0;
        bookQuantityMap.set(cart.bookTitle, currentQuantity + (cart.quantity || 1));
      }
    });

    this.bookStats = Array.from(bookQuantityMap.entries())
      .map(([bookTitle, totalQuantity]) => ({ bookTitle, totalQuantity }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }

  createPieChart(): void {
    const ctx = document.getElementById('bookChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }

    // Generate distinct colors for each segment
    const backgroundColors = this.generateDistinctColors(this.bookStats.length);

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.bookStats.map(item => item.bookTitle),
        datasets: [{
          data: this.bookStats.map(item => item.totalQuantity),
          backgroundColor: backgroundColors,
          borderColor: 'var(--card-bg)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'var(--text-color)',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = Math.round((Number(value) / Number(total)) * 100);
                return `${label}: ${value} units (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  getPercentage(totalQuantity: number): number {
    const total = this.bookStats.reduce((sum, item) => sum + item.totalQuantity, 0);
    return (totalQuantity / total) * 100;
  }

  generateDistinctColors(count: number): string[] {
    // A palette of 20 distinct colors
    const colorPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC24A', '#EA5F89', '#00BCD4', '#F06292',
      '#673AB7', '#009688', '#E91E63', '#3F51B5', '#CDDC39',
      '#FF5722', '#607D8B', '#795548', '#9C27B0', '#2196F3'
    ];
    
    // If we need more colors than in the palette, we'll cycle through them
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(colorPalette[i % colorPalette.length]);
    }
    
    return colors;
  }
}