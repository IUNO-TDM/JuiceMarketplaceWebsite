import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SvgDraw} from './svgDraw';

import 'snapsvg-cjs';
import {BlockexplorerComponent} from './blockexplorer/blockexplorer.component';
import {Transaction} from './blockexplorer/Transaction';

declare var Snap: any;
declare var mina: any;
import {VisualizationSocketService} from "../services/visualization-socket.service";

@Component({
    selector: 'app-visualization',
    templateUrl: './visualization.component.html',
    styleUrls: ['./visualization.component.css'],
    providers: [VisualizationSocketService]
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


    constructor(private visualizationSocketService: VisualizationSocketService) {
    }

    ngOnInit() {

        this.visualizationSocketService.getUpdates('machineconnection').subscribe(data => {
            console.log("MachineConnection: connected=" + data.connected);
        });
        this.visualizationSocketService.getUpdates('offerrequest').subscribe(data => {
            console.log("OfferRequest: " + data.items[0].dataId);
        });
        this.visualizationSocketService.getUpdates('payment').subscribe(data => {
            console.log("Payment: " + data.payment.confidenceState);
        });
        this.visualizationSocketService.getUpdates('payingtransactions').subscribe(data => {
            console.log("PayingTransactions: " + data.transactions[0].transaction);
        });
        this.visualizationSocketService.getUpdates('productionState').subscribe(data => {
            console.log("ProductionState: " + data.state.state);
        });
        this.visualizationSocketService.getUpdates('licenseAvailable').subscribe(data => {
            console.log("LicenseAvailable: " + data.hsmId);
        });
        this.visualizationSocketService.getUpdates('licenseupdate').subscribe(data => {
            console.log("LicenseUpdate: " + data.hsmId);
        });
        this.visualizationSocketService.getUpdates('licenseupdateconfirm').subscribe(data => {
            console.log("LicenseUpdateConfirm: " + data.hsmId);
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
        this.drawMachine(this.machine1SVG);
        this.drawMachine(this.machine2SVG);
        this.drawMachine(this.machine3SVG);
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


        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path1.nativeElement,
        //     this.tdh1.nativeElement, this.tdm.nativeElement);
        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path2.nativeElement,
        //     this.tdh2.nativeElement, this.tdm.nativeElement);
        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path3.nativeElement,
        //     this.machine1.nativeElement, this.tdm.nativeElement);
        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path4.nativeElement,
        //     this.machine2.nativeElement, this.tdm.nativeElement);
        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path5.nativeElement,
        //     this.machine3.nativeElement, this.tdm.nativeElement);
        // SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, this.path7.nativeElement,
        //     this.btc.nativeElement, this.tdm.nativeElement);
    }

    connectMachine(machine: number, connect: boolean) {
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
            if(machineConnected){
                return;
            }
            this.drawMachine(machineSVG);
            path_mtdm = this.snapSVG.path('M0 0');
            path_mtdm.attr({stroke: '#000', fill: 'none', 'stroke-width': '12px', id: 'path_mtdm_' + machine});
            path_mtdm_ref = document.getElementById('path_mtdm_' + machine);
            SvgDraw.connectElements(this.svgContainer.nativeElement, this.svg1.nativeElement, path_mtdm_ref,
                element.nativeElement, this.tdm.nativeElement);

        } else {
            if(!machineConnected){
                return;
            }
            this.clearMachine(machineSVG);
        }

        switch (machine) {
            case 1:
                this.machine1Connected = connect;
                break;
            case 2:
                this.machine2Connected = connect;
                break;
            case 3:
                this.machine3Connected = connect;
                break;
        }

    }


    getAnimationPoint(path: any, objCenter: any, step: any, dist: any) {
        const point = Snap.path.getPointAtLength(path, step);
        const x = point.x - objCenter.x + dist * Math.cos((point.alpha - 90) / 180 * Math.PI);
        const y = point.y - objCenter.y + dist * Math.sin((point.alpha - 90) / 180 * Math.PI);
        return {x: x, y: y, alpha: point.alpha};

    }

    animate() {
        if (this.elementToAnimate === 'rectangle') {
            const animationObject = this.snapSVG.rect(0, 0, 50, 50);
            animationObject.attr({fill: '#f00', opacity: 0, strokeWidth: 1, stroke: '#ddd'});
            this.animateObject(animationObject);
        } else if (this.elementToAnimate === 'circle') {
            const animationObject = this.snapSVG.circle(0, 0, 25);
            animationObject.attr({fill: '#f00', opacity: 0, strokeWidth: 1, stroke: '#ddd'});
            this.animateObject(animationObject);
        } else if (this.elementToAnimate === 'star') {
            const animationObject = this.snapSVG.path('M25,0L30.9,19.2L50,19.1L34.5,30.9L40.5,50L25,38.2L9.5,50L15.5,30.9L0,19.1L19.1,19.1Z');
            animationObject.attr({fill: '#f00', opacity: 0, strokeWidth: 1, stroke: '#ddd'});
            this.animateObject(animationObject);
        } else if (this.elementToAnimate === 'bitcoin') {
            this.loadSVG('assets/visualization/bitcoin.svg', (fragment: any) => {
                const animationObject = fragment.select('g');
                this.snapSVG.append(animationObject);
                this.animateObject(animationObject);
            });
        } else if (this.elementToAnimate === 'offer') {
            this.loadSVG('assets/visualization/offer.svg', (fragment: any) => {
                const animationObject = fragment.select('g');
                this.snapSVG.append(animationObject);
                this.animateObject(animationObject);
            });
        } else if (this.elementToAnimate === 'offerrequest') {
            this.loadSVG('assets/visualization/offerrequest.svg', (fragment: any) => {
                const animationObject = fragment.select('g');
                this.snapSVG.append(animationObject);
                this.animateObject(animationObject);
            });
        } else if (this.elementToAnimate === 'licenseOrder') {
            this.loadSVG('assets/visualization/licenseOrder.svg', (fragment: any) => {
                const animationObject = fragment.select('g');
                this.snapSVG.append(animationObject);
                this.animateObject(animationObject);
            });
        } else if (this.elementToAnimate === 'license') {
            this.loadSVG('assets/visualization/license.svg', (fragment: any) => {
                const animationObject = fragment.select('g');
                this.snapSVG.append(animationObject);
                this.animateObject(animationObject);
            });
        }

    }

    animateObject(animationObject: any) {

        const animationObjectCenter = {x: animationObject.getBBox().cx, y: animationObject.getBBox().cy};
        const animation_path = this.snapSVG.select('#' + this.pathToAnimate);
        const animation_path_length = Snap.path.getTotalLength(animation_path);

        const reversed = this.animationReversed;
        const firstPoint = this.getAnimationPoint(animation_path, animationObjectCenter, reversed ? animation_path_length : 0, reversed ? -30 : 30);
        animationObject.transform('translate(' + firstPoint.x + ',' + firstPoint.y + ')');
        const self = this;
        Snap.animate(0, 100, function (step: any) {
            animationObject.attr('opacity', step / 100);
        }, 500, function () {
            Snap.animate(0, animation_path_length, function (step: any) {
                animationObject.attr('opacity', 1);
                const moveToPoint = self.getAnimationPoint(animation_path, animationObjectCenter, (reversed ? (animation_path_length - step) : step), (reversed ? -30 : 30));
                animationObject.transform('translate(' + moveToPoint.x + ',' + moveToPoint.y + ')');
            }, 5000, function () {
                Snap.animate(0, 100, function (step: any) {
                    animationObject.attr('opacity', 1 - step / 100);
                }, 500, function () {
                    animationObject.remove();
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

    animateMachine1() {
        this.startMachineAnimation(this.machine1SVG);
    }

    animateMachine2() {
        this.startMachineAnimation(this.machine2SVG);
    }

    animateMachine3() {
        this.startMachineAnimation(this.machine3SVG);
    }

    addTransaction() {
        let tx = new Transaction();
        tx.tx = 'xsdcfvgbhnjmk';
        tx.date = new Date();
        tx.amount = 1;
        this.blockexplorer.addTransaction(tx);
    }

}
