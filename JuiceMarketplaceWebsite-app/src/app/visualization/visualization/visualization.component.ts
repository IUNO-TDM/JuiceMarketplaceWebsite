import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SvgDraw} from './svgDraw';

import 'snapsvg-cjs';
import {BlockexplorerComponent} from './blockexplorer/blockexplorer.component';
import {Transaction} from './blockexplorer/Transaction';

declare var Snap: any;
declare var mina: any;
import {VisualizationSocketService} from "../services/visualization-socket.service";
import {AdminService} from "../../console/services/admin.service";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {ClientService} from "../../console/services/client.service";

@Component({
    selector: 'app-visualization',
    templateUrl: './visualization.component.html',
    styleUrls: ['./visualization.component.css'],
    providers: [VisualizationSocketService, AdminService, ClientService]
})
export class VisualizationComponent implements OnInit, AfterViewInit {

    pathToAnimate: 'path1';
    elementToAnimate: 'rectangle';
    animationReversed: false;

    @ViewChild('svgContainer') svgContainer: ElementRef;
    @ViewChild('svg1') svg1: ElementRef;

    @ViewChild('container') container: ElementRef;

    @ViewChild('tdm') tdm: ElementRef;
    @ViewChild('lc') lc: ElementRef;
    @ViewChild('btc') btc: ElementRef;
    @ViewChild('tdh1') tdh1: ElementRef;
    @ViewChild('tdh2') tdh2: ElementRef;
    @ViewChild('machine1') machine1: ElementRef;
    @ViewChild('machine2') machine2: ElementRef;
    @ViewChild('machine3') machine3: ElementRef;


    @ViewChild('blockexplorer') blockexplorer: BlockexplorerComponent;

    snapSVG: any;
    machine1SVG: any;
    machine2SVG: any;
    machine3SVG: any;
    tdh1SVG: any;
    tdh2SVG: any;

    path_lctdm: any;
    path_lctdm_ref: HTMLElement;

    path_tdh1tdm: any;
    path_tdh1tdm_ref: HTMLElement;

    path_tdh2tdm: any;
    path_tdh2tdm_ref: HTMLElement;

    path_m1tdm: any;
    path_m1tdm_ref: HTMLElement;

    path_m2tdm: any;
    path_m2tdm_ref: HTMLElement;

    path_m3tdm: any;
    path_m3tdm_ref: HTMLElement;

    machine1Connected = false;
    machine2Connected = false;
    machine3Connected = false;

    connectionObservable: Observable<Array<object>>;

    clients = {};


    payments = {};

    constructor(private visualizationSocketService: VisualizationSocketService, private adminService: AdminService, private clientService: ClientService) {
    }

    machineConnected(clientId: string) {

        const self = this;

        function showClient(clientId: string) {
            if (!self.clients[clientId]['displayNumber']) {
                if (!self.machine2Connected) {
                    self.clients[clientId]['displayNumber'] = 2;
                } else if (!self.machine1Connected) {
                    self.clients[clientId]['displayNumber'] = 1;
                } else if (!self.machine3Connected) {
                    self.clients[clientId]['displayNumber'] = 3;
                }
                self.connectMachine(self.clients[clientId]['displayNumber'], true, self.clients[clientId]);
            }
        }

        if (!this.clients.hasOwnProperty(clientId)) {
            this.clientService.getClient(clientId).subscribe(client => {
                self.clients[clientId] = client;
                showClient(clientId);
            });
        } else {
            showClient(clientId);
        }

    }

    machineDisconnected(clientId: string) {
        if (this.clients[clientId] && this.clients[clientId]['displayNumber']) {
            this.connectMachine(this.clients[clientId]['displayNumber'], false, null);
            delete this.clients[clientId]['displayNumber'];
        }
    }


    ngOnInit() {

        let lcfrom = moment().startOf('day').subtract(1, 'month').toDate();
        let lcto = moment().endOf('day').toDate();

        this.connectionObservable = this.adminService.getLastConnectionProtocols(lcfrom, lcto);
        this.connectionObservable.subscribe(list => {
            for (let event of list) {
                if (event['payload'] && event['payload']['connected']) {
                    this.machineConnected(event['clientid']);
                }
            }
        });

        this.visualizationSocketService.getUpdates('machineconnection').subscribe(data => {
            console.log("MachineConnection: connected=" + data.connected);
            if (data.connected) {
                this.machineConnected(data.clientId);
            } else {
                this.machineDisconnected(data.clientId);
            }
        });
        this.visualizationSocketService.getUpdates('offerrequest').subscribe(data => {
            if (this.clients[data.clientId] && this.clients[data.clientId]['displayNumber']) {
                this.animateOfferRequest(this.clients[data.clientId]['displayNumber']);
            }
        });
        this.visualizationSocketService.getUpdates('payment').subscribe(data => {
            if (this.clients[data.clientId] && this.clients[data.clientId]['displayNumber']) {
                if(!this.payments[data['payment']['transactionUUID']]){
                    this.animatePayment1(this.clients[data.clientId]['displayNumber']);
                    this.payments[data['payment']['transactionUUID']] = data['payment'];
                }else{
                    if (data['payment']['depth'] >= 6){
                        delete this.payments[data['payment']['transactionUUID']]; //TODO not sure if this is correct
                    }
                }

            }
        });
        this.visualizationSocketService.getUpdates('payingtransactions').subscribe(data => {
            console.log("PayingTransactions: " + data.transactions[0].transaction);
            let tx = new Transaction();
            tx.tx =  data.transactions[0].transaction;
            tx.state =  data.transactions[0].state.state;
            tx.depth =  data.transactions[0].state.depthInBlocks;
            this.blockexplorer.addTransaction(tx);

        });
        this.visualizationSocketService.getUpdates('productionState').subscribe(data => {
            console.log("ProductionState: " + data.state.state);
            if (this.clients[data.clientId] && this.clients[data.clientId]['displayNumber']) {
                var machine;
                switch (this.clients[data.clientId]['displayNumber']) {
                    case 1:
                        machine = this.machine1SVG;
                        break;
                    case 2:
                        machine = this.machine2SVG;
                        break;
                    case 3:
                        machine = this.machine3SVG;
                        break;
                }
                if (data.state.state === 'startProcessing') {
                    this.startMachineAnimation(machine);
                }else if(data.state.state === 'finished' || data.state.state === 'errorProcessing' || data.state.state === 'productionPaused' || data.state.state === 'pumpControlServiceMode'){
                    this.stopMachineAnimation(machine);
                }
            }
        });
        this.visualizationSocketService.getUpdates('licenseAvailable').subscribe(data => {
            console.log("LicenseAvailable: " + data.hsmId);
            if (this.clients[data.clientId] && this.clients[data.clientId]['displayNumber']) {
                this.animateLicenseOrder();
            }

        });
        this.visualizationSocketService.getUpdates('licenseupdate').subscribe(data => {
            console.log("LicenseUpdate: " + data.hsmId);
            if (this.clients[data.clientId] && this.clients[data.clientId]['displayNumber']) {
                this.animateLicense1(this.clients[data.clientId]['displayNumber']);
            }
        });
        this.visualizationSocketService.getUpdates('licenseupdateconfirm').subscribe(data => {
            console.log("LicenseUpdateConfirm: " + data.hsmId);
        });
        this.visualizationSocketService.getUpdates('newtechnologydata').subscribe(data => {
            console.log("NewTechnologyData: " + data.technologydataid);
            this.animateNewTd();
        });
    }

    ngAfterViewInit() {
        this.snapSVG = Snap('#svg1');
        this.machine1SVG = Snap('#machine1svg');
        this.machine2SVG = Snap('#machine2svg');
        this.machine3SVG = Snap('#machine3svg');
        this.tdh1SVG = Snap('#tdh1svg');
        this.tdh2SVG = Snap('#tdh2svg');
        this.connectAll();
        this.drawTDH(this.tdh1SVG);
        this.drawTDH(this.tdh2SVG);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.connectAll();
    }


    connectAll() {
        this.svg1.nativeElement.setAttribute('height', this.container.nativeElement.offsetHeight);
        this.svg1.nativeElement.setAttribute('width', this.container.nativeElement.offsetWidth);

        // draw connection between lc and tdm
        this.path_lctdm = this.snapSVG.path('M0 0');
        this.path_lctdm.attr({stroke: '#000', fill: 'none', 'stroke-width': '12px', id: 'path_lctdm'});
        this.path_lctdm_ref = document.getElementById('path_lctdm');
        SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path_lctdm_ref,
            this.lc.nativeElement, this.tdm.nativeElement);

        // draw connection between tdh1 and tdm
        this.path_tdh1tdm = this.snapSVG.path('M0 0');
        this.path_tdh1tdm.attr({stroke: '#000', fill: 'none', 'stroke-width': '12px', id: 'path_tdh1tdm'});
        this.path_tdh1tdm_ref = document.getElementById('path_tdh1tdm');
        SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path_tdh1tdm_ref,
            this.tdh1.nativeElement, this.tdm.nativeElement);

        // draw connection between tdh2 and tdm
        this.path_tdh2tdm = this.snapSVG.path('M0 0');
        this.path_tdh2tdm.attr({stroke: '#000', fill: 'none', 'stroke-width': '12px', id: 'path_tdh2tdm'});
        this.path_tdh2tdm_ref = document.getElementById('path_tdh2tdm');
        SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path_tdh2tdm_ref,
            this.tdh2.nativeElement, this.tdm.nativeElement);


        for (let clientId in this.clients) {
            if (this.clients[clientId]['displayNumber']) {
                this.connectMachine(this.clients[clientId]['displayNumber'], true, this.clients[clientId]);
            }
        }
    }

    connectMachine(machine: number, connect: boolean, client: any) {
        let machineSVG;
        let path_mtdm;
        let path_mtdm_ref;
        let element;
        let machineConnected;
        switch (machine) {
            case 1:
                machineSVG = this.machine1SVG;
                path_mtdm = this.path_m1tdm;
                path_mtdm_ref = this.path_m1tdm_ref;
                element = this.machine1;
                machineConnected = this.machine1Connected;
                break;
            case 2:
                machineSVG = this.machine2SVG;
                path_mtdm = this.path_m2tdm;
                path_mtdm_ref = this.path_m2tdm_ref;
                element = this.machine2;
                machineConnected = this.machine2Connected;
                break;
            case 3:
                machineSVG = this.machine3SVG;
                path_mtdm = this.path_m3tdm;
                path_mtdm_ref = this.path_m3tdm_ref;
                element = this.machine3;
                machineConnected = this.machine3Connected;
                break;

        }
        if (connect) {
            if (!machineConnected) {
                this.drawMachine(machineSVG);
            }
            path_mtdm = this.snapSVG.path('M0 0');
            path_mtdm.attr({stroke: '#000', fill: 'none', 'stroke-width': '12px', id: 'path_mtdm_' + machine});
            path_mtdm_ref = document.getElementById('path_mtdm_' + machine);
            SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, path_mtdm_ref,
                element.nativeElement, this.tdm.nativeElement);

        } else {
            if (!machineConnected) {
                return;
            }
            this.clearMachine(machineSVG);
        }

        switch (machine) {
            case 1:
                this.machine1Connected = connect;
                this.path_m1tdm = path_mtdm;
                this.path_m1tdm_ref = path_mtdm_ref;
                break;
            case 2:
                this.machine2Connected = connect;
                this.path_m2tdm = path_mtdm;
                this.path_m2tdm_ref = path_mtdm_ref;
                break;
            case 3:
                this.machine3Connected = connect;
                this.path_m3tdm = path_mtdm;
                this.path_m3tdm_ref = path_mtdm_ref;
                break;
        }

    }


    getAnimationPoint(path: any, objCenter: any, step: any, dist: any) {
        const point = Snap.path.getPointAtLength(path, step);
        const x = point.x - objCenter.x + dist * Math.cos((point.alpha - 90) / 180 * Math.PI);
        const y = point.y - objCenter.y + dist * Math.sin((point.alpha - 90) / 180 * Math.PI);
        return {x: x, y: y, alpha: point.alpha};

    }

    animateOfferRequest(machineNr: number) {
        this.loadSVG('assets/visualization/offerrequest.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            var path = null;
            switch (machineNr) {
                case 1:
                    path = this.path_m1tdm;
                    break;
                case 2:
                    path = this.path_m2tdm;
                    break;
                case 3:
                    path = this.path_m3tdm;
                    break;
            }
            if (path) {
                this.animateObject(animationObject, path, false, 2000, () => {
                    this.animateOffer(machineNr);
                });
            }

        });
    }

    animateOffer(machineNr: number) {
        this.loadSVG('assets/visualization/offer.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            var path = null;
            switch (machineNr) {
                case 1:
                    path = this.path_m1tdm;
                    break;
                case 2:
                    path = this.path_m2tdm;
                    break;
                case 3:
                    path = this.path_m3tdm;
                    break;
            }
            if (path) {
                this.animateObject(animationObject, path, true, 2000, () => {
                    // this.animateOffer(machineNr);

                });
            }

        });
    }

    animatePayment1(machineNr: number) {
        this.loadSVG('assets/visualization/bitcoin.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            var path = null;
            switch (machineNr) {
                case 1:
                    path = this.path_m1tdm;
                    break;
                case 2:
                    path = this.path_m2tdm;
                    break;
                case 3:
                    path = this.path_m3tdm;
                    break;
            }
            if (path) {
                this.animateObject(animationObject, path, false, 2000, () => {
                    this.animatePayment2();

                });
            }

        });
    }

    animatePayment2() {
        this.loadSVG('assets/visualization/bitcoin.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            this.animateObject(animationObject, this.path_tdh1tdm, true, 2000, () => {
                // this.animateOffer(machineNr);
            });

        });
    }

    animateLicenseOrder() {
        this.loadSVG('assets/visualization/licenseOrder.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            this.animateObject(animationObject, this.path_lctdm, true, 2000, () => {
                // this.animateOffer(machineNr);
            });

        });
    }

    animateNewTd() {
        this.loadSVG('assets/visualization/td.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            this.animateObject(animationObject, this.path_tdh1tdm, false, 2000, () => {
            });

        });
    }
    animateLicense1(machineNr: number) {
        this.loadSVG('assets/visualization/license.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);
            this.animateObject(animationObject, this.path_lctdm, false, 2000, () => {
                this.animateLicense2(machineNr);
            });

        });
    }
    animateLicense2(machineNr: number) {
        this.loadSVG('assets/visualization/license.svg', (fragment: any) => {
            const animationObject = fragment.select('g');
            this.snapSVG.append(animationObject);

            var path = null;
            switch (machineNr) {
                case 1:
                    path = this.path_m1tdm;
                    break;
                case 2:
                    path = this.path_m2tdm;
                    break;
                case 3:
                    path = this.path_m3tdm;
                    break;
            }
            if (path) {
                this.animateObject(animationObject, path, true, 2000, () => {
                    // this.animatePayment2();

                });
            }
        });
    }



    animateObject(animationObject: any, animationPath: any, reversed: boolean, duration: number, finished: any) {

        const animationObjectCenter = {x: animationObject.getBBox().cx, y: animationObject.getBBox().cy};
        // const animation_path = this.snapSVG.select('#' + this.pathToAnimate);
        const animation_path_length = Snap.path.getTotalLength(animationPath);

        // const reversed = this.animationReversed;
        const firstPoint = this.getAnimationPoint(animationPath, animationObjectCenter, reversed ? animation_path_length : 0, reversed ? -30 : 30);
        animationObject.transform('translate(' + firstPoint.x + ',' + firstPoint.y + ')');
        const self = this;
        Snap.animate(0, 100, function (step: any) {
            animationObject.attr('opacity', step / 100);
        }, 250, function () {
            Snap.animate(0, animation_path_length, function (step: any) {
                animationObject.attr('opacity', 1);
                const moveToPoint = self.getAnimationPoint(animationPath, animationObjectCenter, (reversed ? (animation_path_length - step) : step), (reversed ? -30 : 30));
                animationObject.transform('translate(' + moveToPoint.x + ',' + moveToPoint.y + ')');
            }, duration, function () {
                Snap.animate(0, 100, function (step: any) {
                    animationObject.attr('opacity', 1 - step / 100);
                }, 250, function () {
                    animationObject.remove();
                    if (finished && typeof finished === "function") {
                        finished();
                    }
                });

            });
        });
    }


    loadSVG(path: any, callback: any) {
        Snap.load(path, function (loadedFragment: any) {
            callback(loadedFragment);
        });
    }


    clearMachine(svg: any) {
        svg.children()[0].remove();
    }

    drawMachine(svg: any) {
        const self = this;
        this.loadSVG('assets/visualization/machine.svg', function (fragment: any) {
            const machineSVG = fragment.select('svg');
            svg.append(machineSVG);
            const led = machineSVG.select('#LED');
            led.attr('opacity', 0);
            const cocktail = machineSVG.select('#COCKTAIL');
            cocktail.attr('opacity', 0);

        });
    }


    drawTDH(svg: any) {
        const self = this;
        this.loadSVG('assets/visualization/tdh.svg', function (fragment: any) {
            const tdhSVG = fragment.select('svg');
            svg.append(tdhSVG);
        });
    }

    stopMachineAnimation(machine: any) {
        machine['animationActive'] = false;
    }

    startMachineAnimation(machine: any) {
        if (machine['animationActive']) {
            return;
        }
        machine['animationActive'] = true;
        const led = machine.select('#LED');
        led.attr('opacity', 1);
        const cocktail = machine.select('#COCKTAIL');


        function checkAnimationStillActive() {
            if (machine['animationActive'] && machine['animationActive'] === true) {
                machineAnimation();
            } else {
                led.attr('opacity', 0);
                cocktail.attr('opacity', 0);
            }
        }

        function machineAnimation() {
            Snap.animate(0, 360, function (step: any) {
                const m = new Snap.Matrix().rotate(-step, 200, 200);
                led.transform(m);
                cocktail.attr('opacity', Math.sin(step / 180 * Math.PI));
            }, 3000, mina.linear, checkAnimationStillActive);
        }

        machineAnimation();
    }

}
