import { Component } from './component';

export class TechnologyData {
  id: string;
  technologyId: string;
  name: string;
  description: string;
  licenseFee: number;
  backgroundColor: string;
  components: Array<Component>;
  juices: Array<Component>;
  machines: Array<Component>;
  materials: Array<Component>;
}
