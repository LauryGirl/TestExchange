import { NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component} from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currencies } from './models/currencies';
import { Exchange } from './models/exchange';
import { CurrencieServiceService } from './services/currencie-service.service';
import { ExchangeService } from './services/exchange.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Exchange Rate Calculator';
  public countCorrect!:FormGroup;
  public count_:number = 1;
  public result_:string = '';
  public optMoney1:string = "";
  public optMoney2:string = "";
  public optCount:number= 1;
  public money1:string = "USD";
  public money2:string = "EUR";
  public descripcion: string[] = [];
  public exchangeValue: number[] = [0];

  public start = false;
  public exchangeCalculate = true;

  public notFound = false;
  public exchange!:Exchange;
  public currencies!:Currencies;

  public jsonString1!: string;
  public jsonString2!: string;

  public money1Control = new FormControl('', Validators.required);
  public money2Control = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private exchangeService:ExchangeService, private currenciesService: CurrencieServiceService, private cdr: ChangeDetectorRef){
    this.start = false;
    this.exchangeCalculate = true;
  }

  public ngOnInit(){
    this.buildForm();
  }

  public ngAfterViewInit(){
    this.cdr.detectChanges();
  }

  private buildForm(){
    this.countCorrect = this.formBuilder.group({
      count: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  startButton(){
    if(!this.start)
    {
      this.start = true;
      this.notFound = false;
      this.currenciesService.onCount('latest').subscribe((currenciesFromTheApi: Currencies) =>
      {
        this.currencies = currenciesFromTheApi;
        console.log(currenciesFromTheApi);
      }, (err: any) => {
        console.error(err);
        console.log(err);
        this.notFound = true;
      }); 
    }
  }

  takeResult(){
    if(this.money1 == this.money2){
      return;
    }
    
    this.jsonString2 = JSON.stringify(this.exchange.rates);
    var temp = this.jsonString2.split(':')[1];
    this.result_ = temp.slice(0, temp.length - 1)
    this.exchangeCalculate = true;  
  }

  takeDescription(){
    this.jsonString1 = JSON.stringify(this.currencies.rates);

    this.descripcion = [];

    let arr = this.jsonString1.split(",");
    arr[0] = arr[0].replace("{","");
    arr[arr.length - 1] = arr[arr.length - 1].replace("}", "");

    for(var i = 0, current; i < arr.length; i++){
      current = arr[i].split(":");
      var money = current[0].slice(1,current[0].length - 1);
      this.descripcion.push(money);
    }
    this.descripcion.push('EUR');
  }

  onCount(value:number){
    if(value != 0 && this.count_ != value){
      //this.exchangeCalculate = false;
      this.count_ = value;
    }
  }

  onMoney1(){
    if (this.money1 != "" && this.money1 != this.optMoney1)
    {
      this.exchangeCalculate = false;
      this.optMoney1 = this.money1;

      if(this.money2 != ""){
        this.solveButton();
      }
    }
    
  }
  onMoney2(){
    if(this.money2 != "" && this.money2 != this.optMoney2){
      this.exchangeCalculate = false;
      this.optMoney2 = this.money2;

      if(this.money1 != ""){
        this.solveButton();
      }
    }
  }

  swapButton(){
    if(this.money1 != "" && this.money2 != ""){
      var swap = this.money1;
      this.money1 = this.money2;
      this.money2 = swap;
      this.exchangeCalculate = false;
      this.solveButton()
    }
  }

  solveButton(){
    if(this.optMoney1 == this.optMoney2) {
      this.exchangeCalculate = true;
    }
    else if(this.money1 != "" && this.money2 != "" && !this.exchangeCalculate){
      this.exchangeCalculate = true;
      let value = 'latest?amount=1' + '&from=' + this.money1 +  '&to=' + this.money2;
      this.exchangeService.onCount(value).subscribe((exchangeFromTheApi: Exchange) =>
      {
        this.exchange = exchangeFromTheApi;
        console.log(exchangeFromTheApi);
      }, (err: any) => {
        console.error(err);
        console.log(err);
        this.notFound = true;
      });  
    }
  }

  exchangeSolve(count:string){
    var tonumber = +count;
    if(tonumber != 0 && this.count_ != tonumber){
      this.count_ = tonumber;
      this.exchangeCalculate = false;
    }
  }
  exchangeTextEquals(){
    if(this.money1 == this.money2 && this.money1 != "")
    {
      return this.count_ + " " + this.money1 + " = " + this.count_ + " " + this.money2;
    }
    if(this.money1 != "" && this.money2 != "" && this.count_ != 0){
      return this.count_ + " " + this.money1 + " = " +  (+this.result_ * this.count_) + " " + this.money2;
    }
    return "";
  }

  exchangeText(){
    if(this.money1 == this.money2 && this.money1 != "" && this.money1 !="0")
    {
      return Math.round((this.count_ + Number.EPSILON) * 100) / 100;
    }
    if(this.money1 != "" && this.money2 != "" && this.count_ != 0){
      return Math.round(((+this.result_ * this.count_) + Number.EPSILON) * 100) / 100;
    }

    return "";

  }
}
