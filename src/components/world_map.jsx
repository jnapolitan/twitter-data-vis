import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'toposjon-client';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.svgWidth = 800;
    this.svgHeight = 450;
  }

  projection() {
    return geoMercator()
      .scale(100)
      .translate([800 / 2, 450 / 2]);
  }

  componentDidMount() {
    fetch('/world-110m.json')
      .then(res => {
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.status}`);
          return;
        }
        res.json().then(data => {
          this.setState({ data: feature(data, data.objects.countries).features });
        });
      });
  }

  render() {
    const { svgWidth, svgHeight } = this;
    return(
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <g className="countries">
          {this.state.data.map(d, i) => {
            <path 
              key={`path-${i}`}
              d={geoPath().projection(this.projection())(d)}
              className="country"
              fill={`rgba(38,50,56,${1 / this.state.data.length * i})`}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          }}
        </g>
        <g className="markers">
          <circle
            cx={this.projection()[8, 48][0]}
            cy={this.projection()[8, 48][1]}
            r={10}
            fill="#E91E63"
            className="marker"
          />
        </g>
      </svg>
    )
  }


}