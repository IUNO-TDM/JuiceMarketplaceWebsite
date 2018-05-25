import {Component, OnInit} from '@angular/core';
import {Transaction} from './Transaction';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Observable} from "rxjs/Observable";
import {timer} from "rxjs/observable/timer";

@Component({
  selector: 'app-blockexplorer',
  templateUrl: './blockexplorer.component.html',
  styleUrls: ['./blockexplorer.component.css'],
  animations: [
    trigger('easeInOut', [
      transition('void => *', [
        style({
          opacity: 0,
          'background-color': 'transparent'
        }),
        animate(1000, keyframes([
          style({opacity: 0, 'background-color': 'transparent', offset: 0}),
          style({opacity: 1, 'background-color': '#a6ff4d', offset: 0.5}),
          style({opacity: 1, 'background-color': 'transparent', offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate('1s ease-in-out', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class BlockexplorerComponent implements OnInit {

  transactionIds = new Array<string>();
  transactions = {};

  // transactions = new Array<Transaction>();
  // timer: Observable<any>;
  TRANSACTION_TIMEOUT = 10 * 1000;

  constructor() {
  }

  ngOnInit() {
  }


  addTransaction(transaction: Transaction) {
    if(this.transactionIds.indexOf(transaction.tx) === -1){
      this.transactionIds.splice(0,0,transaction.tx);
    }
    this.transactions[transaction.tx] = transaction;
  }



}
