const manhattanLayerSections = [
  {
    id: "grants_layer_items",
    caretId: "dutch-grants-layer-caret",
    label: "1640-64 | Dutch Grants",
    itemSelector: ".dutch_grants_layer_item",
    zoomTo: "NA",
    infoId: "grants-info-layer",
    type: "group",
  },
  {
    id: "grants_layer",
    className: "grants_layer",
    name: "grants_layer",
    iconColor: "#e3ed58",
    label: "Information",
    topLayerClass: "dutch_grants_layer",
    iconType: "square",
    isSolid: true,
  },
  {
    id: "grants_layer_lines",
    className: "grants_layer",
    name: "grants_layer_lines",
    iconColor: "#ff0000",
    label: "Lines",
    topLayerClass: "dutch_grants_layer",
    iconType: "square",
    isSolid: false,
  },
  {
    id: "circle_point",
    name: "circle_point",
    checked: true,
    label: "1643-75 | Lot Events",
    iconColor: "#097911",
    zoomTo: "NA",
    infoId: "demo-taxlot-info-layer",
    type: "lots-events",
  },
  {
    id: "castello_points",
    name: "castello_points",
    label: "1660 | Castello Taxlots",
    iconColor: "#ff0000",
    zoomTo: "NA",
    infoId: "castello-info-layer",
    type: "castello-points",
  }
];

const longIslandLayerSections = [

  {
    id: 'native_groups_layer_items',
    name: 'native_groups_layer_items',
    caretId: 'native-groups-layer-caret',
    label: '1600s | Long Island Tribes',
    zoomTo: 'LongIsland',
    infoId: 'native-groups-info-layer',
    type: 'group',
    itemSelector: ".native_groups_layer_item"
  },
  {
    className: 'native_groups_layer',
    id: 'native_groups_labels',
    name: 'native_groups_labels',
    iconColor: '#0b0ee5',
    label: 'Labels',
    topLayerClass: "native_groups_layer",
    iconType: "comment-dots",
    isSolid: true,
  },
  {
    className: 'native_groups_layer',
    id: 'native_groups_area',
    name: 'native_groups_area',
    iconColor: '#ff1493',
    label: 'Area',
    iconType: "square",
    topLayerClass: "native_groups_layer",
    isSolid: true
  },
  {
    className: 'native_groups_layer',
    id: 'native_groups_lines',
    name: 'native_groups_lines',
    iconColor: '#ff0000',
    label: 'Borders',
    iconType: "square",
    topLayerClass: "native_groups_layer",
  },
  
];

const informationOfInterest = [
  
]