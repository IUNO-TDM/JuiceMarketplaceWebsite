import {TestBed, async} from '@angular/core/testing';

import {SvgDraw} from './svgDraw';

describe('DeterminSitation Test', () => {

  it('check quadrant 1 a', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 5, cy: 10};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation).toBe(1);
  }));
  it('check quadrant 1 b', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 10, cy: 10};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 1 || situation === 4).toBe(true);
  }));

  it('check quadrant 1 c', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 0, cy: 10};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 1 || situation === 2).toBe(true);
  }));


  it('check quadrant 2 a', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 0, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation).toBe(2);
  }));
  it('check quadrant 2 b', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 0, cy: 0};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 2 || situation === 3).toBe(true);
  }));

  it('check quadrant 2 c', async(() => {
    const startInfo = {cx: 5, cy: 5};
    const endInfo = {cx: 0, cy: 10};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 1 || situation === 2).toBe(true);
  }));

  it('check quadrant 3 a', async(() => {
    const startInfo = {cx: 5, cy: 10};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect( situation).toBe(3);
  }));

  it('check quadrant 3 b', async(() => {
    const startInfo = {cx: 0, cy: 10};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 4 || situation === 3).toBe(true);
  }));

  it('check quadrant 3 c', async(() => {
    const startInfo = {cx: 10, cy: 10};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 2 || situation === 3).toBe(true);
  }));

  it('check quadrant 4 a', async(() => {
    const startInfo = {cx: 0, cy: 5};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect( situation).toBe(4);
  }));

  it('check quadrant 4 b', async(() => {
    const startInfo = {cx: 0, cy: 0};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 1 || situation === 4).toBe(true);
  }));

  it('check quadrant 4 c', async(() => {
    const startInfo = {cx: 0, cy: 10};
    const endInfo = {cx: 5, cy: 5};
    const situation = SvgDraw.determineSituation(startInfo, endInfo);
    expect(situation === 3 || situation === 4).toBe(true);
  }));




});
