const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\data:image\/svg\+xml;utf8,\\\$\\{/g, '\data:image/svg+xml;utf8,\\\\/g, '}\');
  fs.writeFileSync(file, content);
}

fixFile('D:/gwnagju-eco-tour/components/map/BusStopMarker.tsx');
fixFile('D:/gwnagju-eco-tour/components/map/SubwayStationMarker.tsx');
fixFile('D:/gwnagju-eco-tour/components/map/TourismMarker.tsx');

console.log('Fixed syntax errors');
