export class SvgDraw {


  static SAFE_CORNER_ZONE = 30;


  static getElementInformation(elem: any): any {
    const left = elem.offsetLeft;
    const top = elem.offsetTop;
    const width = elem.offsetWidth;
    const height = elem.offsetHeight;
    const cx = left + 0.5 * width;
    const cy = top + 0.5 * height;
    const right = left + width;
    const bottom = top + height;

    return {left: left, right: right, top: top, bottom: bottom, cx: cx, cy: cy, height: height, width: width};
  }


  //   \ 1 /
  //    \ /
  //   4 X 2
  //    / \
  //   / 3 \

  static determineSituation(start: any, end: any): any {

    let quadrant = 0;

    if (start.cy < end.cy && ((start.cx > end.cx - (end.cy - start.cy)) && (start.cx < end.cx + (end.cy - start.cy)))) {
      quadrant = 1;
    } else if (start.cx > end.cx && ((start.cy < end.cy + (start.cx - end.cx)) && (start.cy > end.cy - (start.cx - end.cx)))) {
      quadrant = 2;
    } else if (start.cy > end.cy && ((start.cx < end.cx + (start.cy - end.cy)) && (start.cx > end.cx - (start.cy - end.cy)))) {
      quadrant = 3;
    } else if (start.cx < end.cx && ((start.cy > end.cy - (end.cx - start.cx)) && (start.cx < end.cy + (end.cx - start.cx)))) {
      quadrant = 4;
    }

    return quadrant;

  }

  static connectElements(svgContainer: any, svg: any, path: any, startElem: any, endElem: any) {
    const startInformation = this.getElementInformation(startElem);
    const endInformation = this.getElementInformation(endElem);

    const situation = this.determineSituation(startInformation, endInformation);

    let startX, startY, endX, endY: number;

    switch (situation) {
      case 1:
        startX = startInformation.cx;
        startY = startInformation.bottom;
        endY = endInformation.top;
        if (startX === endInformation.cx ||
          (startX < endInformation.cx && startX > endInformation.left + this.SAFE_CORNER_ZONE) ||
          (startX > endInformation.cx && startX < endInformation.right - this.SAFE_CORNER_ZONE)) {
          endX = startX;
        } else {
          if (startX > endInformation.cx) {
            endX = endInformation.right - this.SAFE_CORNER_ZONE;
          }else {
            endX = endInformation.left + this.SAFE_CORNER_ZONE;
          }
        }

        break;
      case 2:
        startX = startInformation.left;
        startY = startInformation.cy;
        endX = endInformation.right;
        if (startY === endInformation.cy ||
          (startY < endInformation.cy && startY > endInformation.top + this.SAFE_CORNER_ZONE) ||
          (startY > endInformation.cy && startY < endInformation.bottom - this.SAFE_CORNER_ZONE)) {
          endY = startY;
        } else {
          if (startY > endInformation.cy) {
            endY = endInformation.bottom - this.SAFE_CORNER_ZONE;
          }else {
            endY = endInformation.top + this.SAFE_CORNER_ZONE;
          }
        }
        break;
      case 3:
        startX = startInformation.cx;
        startY = startInformation.top;
        endY = endInformation.bottom;
        if (startX === endInformation.cx ||
          (startX < endInformation.cx && startX > endInformation.left + this.SAFE_CORNER_ZONE) ||
          (startX > endInformation.cx && startX < endInformation.right - this.SAFE_CORNER_ZONE)) {
          endX = startX;
        } else {
          if (startX > endInformation.cx) {
            endX = endInformation.right - this.SAFE_CORNER_ZONE;
          }else {
            endX = endInformation.left + this.SAFE_CORNER_ZONE;
          }
        }
        break;
      case 4:
        startX = startInformation.right;
        startY = startInformation.cy;
        endX = endInformation.left;
        if (startY === endInformation.cy ||
          (startY < endInformation.cy && startY > endInformation.top + this.SAFE_CORNER_ZONE) ||
          (startY > endInformation.cy && startY < endInformation.bottom - this.SAFE_CORNER_ZONE)) {
          endY = startY;
        } else {
          if (startY > endInformation.cy) {
            endY = endInformation.bottom - this.SAFE_CORNER_ZONE;
          }else {
            endY = endInformation.top + this.SAFE_CORNER_ZONE;
          }
        }
        break;
    }
    this.drawPath(svg, path, startX, startY, endX, endY, situation);

  }

  static drawPath(svg: any, path: any, startX: any, startY: any, endX: any, endY: any, situation: any) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    const stroke = parseFloat(path.getAttribute('stroke-width'));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.getAttribute('height') < Math.max(endY, startY) + stroke) {
      svg.setAttribute('height', Math.max(endY, startY) + stroke);
    }
    if (svg.getAttribute('width') < Math.max(endX, startX) + stroke) {
      svg.setAttribute('width', Math.max(endX, startX) + stroke);
    }

    if (endX === startX || endY === startY) {
      path.setAttribute('d', 'M' + startX + ' ' + startY +
        ' L' + endX + ' ' + endY);
    } else {

      if (situation === 1 || situation === 3) {
        path.setAttribute('d', 'M' + startX + ' ' + startY +
          ' C' + startX + ' ' + (startY + endY) / 2 +
          ' ' + endX + ' ' + (startY + endY) / 2 +
          ' ' + endX + ' ' + endY);
      } else if (situation === 2 || situation === 4) {
        path.setAttribute('d', 'M' + startX + ' ' + startY +
          ' C' + (startX + endX) / 2 + ' ' + startY +
          ' ' + (startX + endX) / 2 + ' ' + endY +
          ' ' + endX + ' ' + endY);
      }

    }

  }


}
