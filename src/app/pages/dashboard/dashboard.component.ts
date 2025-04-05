import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Total Earning',
    iconClass: 'nb-checkmark', // Example icon for earnings
    type: 'primary',
  };
  
  rollerShadesCard: CardSettings = {
    title: 'Total Payable to Sponsor',
    iconClass: 'nb-bar-chart', // Example icon for payments
    type: 'success',
  };
  
  wirelessAudioCard: CardSettings = {
    title: 'Total Payable to Assets',
    iconClass: 'nb-bar-chart', // Example icon for assets
    type: 'info',
  };
  
  coffeeMakerCard: CardSettings = {
    title: 'Total Expenses',
    iconClass: 'nb-fold', // Example icon for expenses
    type: 'warning',
  };
  
  profitCard: CardSettings = {
    title: 'Profit',
    iconClass: 'nb-plus', // Example icon for profit
    type: 'success',
  };
  

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
    this.profitCard
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
      {
        ...this.profitCard,
        type: 'success',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
        console.log("this.statusCards",this.statusCards);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

    // Toggle Invoice Details
    toggleDetails() {
      if (this.selectedDateRange) {
        this.prepareInvoice(this.selectedDateRange);
      }
    }
  selectedDateRange(selectedDateRange: any) {
    throw new Error('Method not implemented.');
  }
  
    prepareInvoice(selectedDate): void {


  
      // this.invoiceService.prepareInvoic(data).subscribe(
      //   (data) => {
      //     this.invoiceData = data;
      //     if (this.invoiceData?.detailedProjectInvoiceList?.length != 0) {
      //       this.showDetails = true;
      //         this.calculateTotalAmount();
      //     }else{
      //       this.toasterService.showSuccess('No Record Found!');
      //     }
      //   },
      //   (error) => {
      //     console.error('Error loading projects:', error);
      //   }
      // );
  }
}
