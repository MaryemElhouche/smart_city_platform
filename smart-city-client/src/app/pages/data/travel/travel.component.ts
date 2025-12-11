import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGraphQLService } from '../../../services/data-graphql.service';
import { ToastService } from '../../../services/toast.service';
import { TravelSuggestions } from '../../../models/data.models';

@Component({
  selector: 'app-travel-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="travel-page">
      <div class="page-header">
        <h2>Travel Suggestions</h2>
        <p class="subtitle">Get smart travel recommendations based on air quality</p>
      </div>

      <!-- Search Form -->
      <div class="search-card">
        <div class="search-header">
          <div class="search-icon">
            <i class="fas fa-route"></i>
          </div>
          <h3>Plan Your Journey</h3>
        </div>
        <div class="search-form">
          <div class="form-row">
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt from"></i> From Station</label>
              <select [(ngModel)]="fromStation">
                <option value="">Select departure station...</option>
                @for (station of stations; track station) {
                  <option [value]="station">{{ station }}</option>
                }
              </select>
            </div>
            <div class="swap-btn" (click)="swapStations()">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt to"></i> To Station</label>
              <select [(ngModel)]="toStation">
                <option value="">Select destination station...</option>
                @for (station of stations; track station) {
                  <option [value]="station">{{ station }}</option>
                }
              </select>
            </div>
          </div>
          <button class="btn btn-primary btn-search" (click)="searchRoute()" [disabled]="!fromStation || !toStation || loading">
            @if (loading) {
              <div class="spinner-small"></div>
              Searching...
            } @else {
              <i class="fas fa-search"></i> Find Best Route
            }
          </button>
        </div>
      </div>

      <!-- Results -->
      @if (searchPerformed) {
        @if (!suggestion) {
          <div class="no-results">
            <div class="no-results-icon">
              <i class="fas fa-search"></i>
            </div>
            <h4>No Route Found</h4>
            <p>We couldn't find a direct route between these stations. Try different stations or check back later.</p>
          </div>
        } @else {
          <div class="results-section">
            <h3>Recommended Route</h3>
            
            <div class="route-card">
              <div class="route-header">
                <div class="route-stations">
                  <div class="station from">
                    <div class="station-marker"></div>
                    <span>{{ suggestion.fromStation }}</span>
                  </div>
                  <div class="route-line">
                    <div class="line-dots"></div>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  <div class="station to">
                    <div class="station-marker"></div>
                    <span>{{ suggestion.toStation }}</span>
                  </div>
                </div>
              </div>
              
              <div class="route-details">
                <div class="detail-card line">
                  <div class="detail-icon">
                    <i class="fas fa-subway"></i>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Recommended Line</span>
                    <span class="detail-value">{{ suggestion.recommendedLine }}</span>
                  </div>
                </div>
                
                <div class="detail-card air-quality" [ngClass]="getAirQualityClass(suggestion.airQualityRecommendation)">
                  <div class="detail-icon">
                    <i class="fas fa-wind"></i>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Air Quality Along Route</span>
                    <span class="detail-value">{{ suggestion.airQualityRecommendation }}</span>
                  </div>
                  <div class="air-quality-indicator">
                    <i [class]="getAirQualityIcon(suggestion.airQualityRecommendation)"></i>
                  </div>
                </div>
              </div>

              <div class="route-tips">
                <h5><i class="fas fa-lightbulb"></i> Travel Tips</h5>
                <ul>
                  @if (isGoodAirQuality(suggestion.airQualityRecommendation)) {
                    <li><i class="fas fa-check"></i> Air quality is excellent - great day for outdoor activities!</li>
                    <li><i class="fas fa-walking"></i> Consider walking part of your journey</li>
                  } @else if (isModerateAirQuality(suggestion.airQualityRecommendation)) {
                    <li><i class="fas fa-info-circle"></i> Air quality is moderate - sensitive groups should be cautious</li>
                    <li><i class="fas fa-mask"></i> Consider wearing a mask if you have respiratory concerns</li>
                  } @else {
                    <li><i class="fas fa-exclamation-triangle"></i> Air quality is poor - limit outdoor exposure</li>
                    <li><i class="fas fa-subway"></i> Prefer underground or enclosed transportation</li>
                    <li><i class="fas fa-clock"></i> Consider traveling during off-peak hours</li>
                  }
                </ul>
              </div>
            </div>
          </div>
        }
      }

      <!-- Recent Searches -->
      @if (recentSearches.length > 0) {
        <div class="recent-section">
          <h3>Recent Searches</h3>
          <div class="recent-grid">
            @for (search of recentSearches; track search.from + search.to) {
              <div class="recent-card" (click)="loadRecentSearch(search)">
                <div class="recent-route">
                  <span class="from">{{ search.from }}</span>
                  <i class="fas fa-arrow-right"></i>
                  <span class="to">{{ search.to }}</span>
                </div>
                <i class="fas fa-chevron-right"></i>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .subtitle {
      color: var(--gray-500);
      font-size: 14px;
      margin-top: 4px;
    }

    .search-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .search-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .search-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .search-form .form-row {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group {
      flex: 1;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-600);
      margin-bottom: 8px;
    }

    .form-group label i.from { color: #16a34a; }
    .form-group label i.to { color: #dc2626; }

    .form-group select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--gray-200);
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.2s;
    }

    .form-group select:focus {
      border-color: var(--primary);
      outline: none;
    }

    .swap-btn {
      width: 44px;
      height: 44px;
      background: var(--gray-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 4px;
    }

    .swap-btn:hover {
      background: var(--primary);
      color: white;
      transform: rotate(180deg);
    }

    .btn-search {
      width: 100%;
      padding: 16px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .no-results {
      text-align: center;
      padding: 60px 40px;
      background: white;
      border-radius: 16px;
    }

    .no-results-icon {
      width: 80px;
      height: 80px;
      background: var(--gray-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: var(--gray-400);
      margin: 0 auto 20px;
    }

    .no-results h4 {
      font-size: 20px;
      color: var(--gray-800);
      margin-bottom: 8px;
    }

    .no-results p {
      color: var(--gray-500);
      max-width: 400px;
      margin: 0 auto;
    }

    .results-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 16px;
    }

    .route-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .route-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px;
    }

    .route-stations {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .station {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .station-marker {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
    }

    .station.from .station-marker { background: #16a34a; }
    .station.to .station-marker { background: #dc2626; }

    .station span {
      font-size: 16px;
      font-weight: 600;
    }

    .route-line {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.7);
    }

    .line-dots {
      width: 100px;
      height: 3px;
      background: repeating-linear-gradient(
        90deg,
        rgba(255,255,255,0.5),
        rgba(255,255,255,0.5) 8px,
        transparent 8px,
        transparent 16px
      );
    }

    .route-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 24px;
    }

    .detail-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--gray-50);
      border-radius: 12px;
    }

    .detail-card.air-quality {
      position: relative;
    }

    .detail-card.air-quality.good { background: #dcfce7; }
    .detail-card.air-quality.moderate { background: #fef3c7; }
    .detail-card.air-quality.poor { background: #fee2e2; }

    .detail-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--primary);
    }

    .detail-label {
      display: block;
      font-size: 12px;
      color: var(--gray-500);
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .air-quality-indicator {
      position: absolute;
      right: 20px;
      font-size: 24px;
    }

    .air-quality-indicator i.good { color: #16a34a; }
    .air-quality-indicator i.moderate { color: #d97706; }
    .air-quality-indicator i.poor { color: #dc2626; }

    .route-tips {
      padding: 24px;
      border-top: 1px solid var(--gray-100);
      background: #f8fafc;
    }

    .route-tips h5 {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .route-tips h5 i { color: #eab308; }

    .route-tips ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .route-tips li {
      font-size: 14px;
      color: var(--gray-600);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .route-tips li i {
      width: 20px;
      text-align: center;
      color: var(--primary);
    }

    .recent-section {
      margin-top: 32px;
    }

    .recent-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 16px;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .recent-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .recent-card:hover {
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .recent-route {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .recent-route .from { color: #16a34a; font-weight: 500; }
    .recent-route .to { color: #dc2626; font-weight: 500; }
    .recent-route i { color: var(--gray-400); font-size: 12px; }

    .recent-card > i {
      color: var(--gray-400);
    }

    @media (max-width: 768px) {
      .search-form .form-row {
        flex-direction: column;
      }
      .swap-btn {
        align-self: center;
        transform: rotate(90deg);
      }
      .swap-btn:hover { transform: rotate(270deg); }
      .route-details { grid-template-columns: 1fr; }
    }
  `]
})
export class TravelSuggestionsComponent implements OnInit {
  fromStation = '';
  toStation = '';
  suggestion: TravelSuggestions | null = null;
  loading = false;
  searchPerformed = false;
  
  stations = [
    'Central Station', 'North Terminal', 'South Plaza', 'East Gate', 'West End',
    'Airport Express', 'Business District', 'University Station', 'Harbor View',
    'Industrial Park', 'Sports Complex', 'Medical Center', 'Tech Hub'
  ];
  
  recentSearches: { from: string; to: string }[] = [];

  constructor(
    private dataService: DataGraphQLService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRecentSearches();
  }

  searchRoute(): void {
    if (!this.fromStation || !this.toStation) return;
    if (this.fromStation === this.toStation) {
      this.toastService.error('Please select different stations');
      return;
    }

    this.loading = true;
    this.searchPerformed = true;
    
    this.dataService.getTravelSuggestions(this.fromStation, this.toStation).subscribe({
      next: (data) => {
        this.suggestion = data;
        this.addRecentSearch(this.fromStation, this.toStation);
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to get travel suggestions');
        this.loading = false;
      }
    });
  }

  swapStations(): void {
    const temp = this.fromStation;
    this.fromStation = this.toStation;
    this.toStation = temp;
  }

  loadRecentSearch(search: { from: string; to: string }): void {
    this.fromStation = search.from;
    this.toStation = search.to;
    this.searchRoute();
  }

  private loadRecentSearches(): void {
    const saved = localStorage.getItem('recentTravelSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved).slice(0, 4);
    }
  }

  private addRecentSearch(from: string, to: string): void {
    const existing = this.recentSearches.findIndex(s => s.from === from && s.to === to);
    if (existing > -1) {
      this.recentSearches.splice(existing, 1);
    }
    this.recentSearches.unshift({ from, to });
    this.recentSearches = this.recentSearches.slice(0, 4);
    localStorage.setItem('recentTravelSearches', JSON.stringify(this.recentSearches));
  }

  getAirQualityClass(recommendation: string): string {
    const lower = recommendation?.toLowerCase() || '';
    if (lower.includes('good') || lower.includes('excellent')) return 'good';
    if (lower.includes('moderate') || lower.includes('fair')) return 'moderate';
    return 'poor';
  }

  getAirQualityIcon(recommendation: string): string {
    const cls = this.getAirQualityClass(recommendation);
    switch (cls) {
      case 'good': return 'fas fa-check-circle good';
      case 'moderate': return 'fas fa-exclamation-circle moderate';
      default: return 'fas fa-times-circle poor';
    }
  }

  isGoodAirQuality(recommendation: string): boolean {
    return this.getAirQualityClass(recommendation) === 'good';
  }

  isModerateAirQuality(recommendation: string): boolean {
    return this.getAirQualityClass(recommendation) === 'moderate';
  }
}
