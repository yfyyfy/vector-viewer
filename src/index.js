import 'babel-polyfill';

import SampleVectorMap from './SampleVectorMap.js';

let vm = new SampleVectorMap({
  mapId: 'map',
  tileURL: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  jsonFile: require('./eu-countries.json')
});
