/* eslint-disable react/forbid-prop-types */
/* eslint max-classes-per-file: 0 */

import React, { Component } from 'react';
import Loadable from '@loadable/component';

export const LoadableSketch = Loadable(() => import('react-p5'));

class Attractor {
  constructor(p5, x, y, m) {
    this.p5 = p5;
    this.pos = p5.createVector(x, y);
    this.mass = m;
    this.r = p5.sqrt(this.mass) * 2;
  }

  attract(mover) {
    const { p5 } = this;
    const force = p5.createVector(this.pos.x - mover.pos.x, this.pos.y - mover.pos.y);
    const distanceSq = p5.constrain(force.magSq(), 100, 1000);
    const G = 5;
    const strength = (G * (this.mass * mover.mass)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  show() {
    const { p5 } = this;
    p5.noStroke();
    p5.fill(255, 0, 100);
    p5.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Mover {
  constructor(p5, x, y, m) {
    this.p5 = p5;
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(p5.random(), p5.random());
    this.vel.mult(5);
    this.acc = p5.createVector(0, 0);
    this.mass = m;
    this.r = p5.sqrt(this.mass) * 2;
  }

  applyForce(force) {
    const { p5 } = this;
    const f = p5.createVector(force.x / this.mass, force.y / this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    const { p5 } = this;
    p5.stroke(255);
    p5.strokeWeight(2);
    p5.fill(255, 100);
    p5.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Sketch extends Component {
  movers = [];

  attractors = [];

  setup = (p5, canvasParentRef) => {
    const { width, height } = this.getCanvasSizing();
    p5.createCanvas(width, height).parent(canvasParentRef);

    for (let i = 0; i < 10; i += 1) {
      const x = p5.random(width);
      const y = p5.random(height);
      const m = p5.random(50, 150);
      this.movers[i] = new Mover(p5, x, y, m);
    }

    p5.push();
    p5.translate(width / 2, height / 2);
    const radius = 300;
    let angle = 0;
    for (let i = 0; i < 6; i += 1) {
      const x = radius * p5.sin(angle);
      const y = radius * p5.cos(angle);
      this.attractors.push(new Attractor(p5, x, y, 100));
      angle += p5.TWO_PI / 6;
    }
    p5.pop();

    p5.background(0);
  };

  draw = (p5) => {
    p5.background(0);
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);

    this.movers.forEach((mover) => {
      mover.update();
      mover.show();
      this.attractors.map((attractor) => attractor.attract(mover));
    });

    this.attractors.map((attractor) => attractor.show());

    p5.pop();
  };

  windowResized = (p5) => {
    const { width, height } = this.getCanvasSizing();
    p5.resizeCanvas(width, height);
  }

  getRandomPosition = (p5) => {
    const x = p5.map(p5.random(), 0, 1, 0, p5.width);
    const y = p5.map(p5.random(), 0, 1, 0, p5.height);
    return [x, y];
  };

  getCanvasSizing = () => {
    const canvasContainer = document.getElementById('canvasContainer');

    return {
      width: typeof window !== 'undefined' ? canvasContainer.offsetWidth : 0,
      height: typeof window !== 'undefined' ? canvasContainer.offsetHeight : 0,
    };
  }

  render() {
    return (
      <LoadableSketch
        setup={this.setup}
        draw={this.draw}
        windowResized={this.windowResized}
      />
    );
  }
}

export default Sketch;
