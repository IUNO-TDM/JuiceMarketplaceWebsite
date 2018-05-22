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

  transactions = new Array<Transaction>();
  timer: Observable<any>;
  TRANSACTION_TIMEOUT = 10 * 1000;

  constructor() {
  }

  ngOnInit() {
    this.timer = timer(1000, 1000);
    this.timer.subscribe(() => {
        const txToBeRemoved = new Array<Transaction>();
        for (const tx of this.transactions) {
          if ((new Date().getTime() - tx.date.getTime()) > this.TRANSACTION_TIMEOUT) {
            txToBeRemoved.push(tx);
          }
        }

        for (const tx of txToBeRemoved) {
          const index = this.transactions.indexOf(tx);
          this.transactions.splice(index, 1);
        }
      }
    );
  }


  addTransaction(transaction: Transaction) {
    this.transactions.splice(0, 0, transaction);
  }

}
