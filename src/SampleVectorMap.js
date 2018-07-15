import VectorMap from './VectorMap.js';

export default class SampleVectorMap extends VectorMap {
  polygonStyle(mapcolor7, forHighlight) {
    const p = mapcolor7 % 5;
    return {
      fillColor: p === 0 ? '#800026' :
        p === 1 ? '#E31A1C' :
        p === 2 ? '#FEB24C' :
        p === 3 ? '#B2FE4C' : '#FFEDA0',
      fillOpacity: forHighlight ? 1 : 0.5,
      stroke: true,
      fill: true,
      color: forHighlight ? 'red' : 'black',
      opacity: 1,
      weight: forHighlight ? 2 : 0
    };
  }

  setHighlight(polygon) {
    if (this.setHighlight.highlightedPolygon) {
      this.vectorGridLayer.resetFeatureStyle(this.setHighlight.highlightedPolygon);
    }
    this.setHighlight.highlightedPolygon = polygon;
  }

  mapOnClick(e) {
    this.setHighlight();
  }

  polygonOnMouseOver(e) {
    // Highlight polygon
    const properties = e.layer.properties;
    L.popup()
      .setContent(properties.name || properties.type)
      .setLatLng(e.latlng)
      .openOn(this.map);

    this.setHighlight(properties.wb_a3);

    const style = this.polygonStyle(properties.mapcolor7, true);
    this.vectorGridLayer.setFeatureStyle(properties.wb_a3, style);
  }

  stylePolygon(properties, zoom) {
    return this.polygonStyle(properties.mapcolor7, false);
  };
}
