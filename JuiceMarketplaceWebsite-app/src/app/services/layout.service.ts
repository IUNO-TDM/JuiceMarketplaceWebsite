import { Injectable } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

class LayoutProperties {
  mqAlias: String
  isSmallLayout: boolean
  isTouchDevice: boolean
}

@Injectable()
export class LayoutService {
  private _layoutProperties: BehaviorSubject<LayoutProperties> = new BehaviorSubject(new LayoutProperties())
  public readonly layoutProperties: Observable<LayoutProperties> = this._layoutProperties.asObservable()

  private watcher: Subscription = null

  constructor(
    private media: ObservableMedia
  ) {
    this.watcher = media.subscribe((change: MediaChange) => {
      // console.log("Watcher: " + change.mqAlias)

      var layoutProperties = new LayoutProperties()
      layoutProperties.mqAlias = change.mqAlias

      layoutProperties.isSmallLayout = false
      if (change.mqAlias == 'xs' || change.mqAlias == 'sm') {
        layoutProperties.isSmallLayout = true
      }

      var ua = window.navigator.userAgent
      var touchDevice = false
      layoutProperties.isTouchDevice = false
      // https://stackoverflow.com/a/25394023/1771537
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        layoutProperties.isTouchDevice = true
      }
      this._layoutProperties.next(layoutProperties)

    });
  }

}
