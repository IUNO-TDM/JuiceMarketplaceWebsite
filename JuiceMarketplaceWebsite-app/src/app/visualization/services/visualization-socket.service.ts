import {Injectable} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class VisualizationSocket extends Socket {

    constructor() {
        super({
            url: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/visualization',
            options: {}
        });
    }

}

@Injectable()
export class VisualizationSocketService {

    constructor(private socket: VisualizationSocket) {
    }

    joinRoom(room: string) {
        this.socket.emit('room', room);
    }

    getUpdates(subject: string): Observable<any> {
        return this.socket
            .fromEvent<any>(subject);
    }
}
