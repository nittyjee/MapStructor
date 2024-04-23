const layers = [
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "germany-highlighted",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      //url: "mapbox://mapny.18d146m2",
	  url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "output",
	"source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "fill-color": "#e3ed58",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0,
      ],
      "fill-outline-color": "#FF0000",
    },
    toggleElement: "german_layer",
  },
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "germany",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      //url: "mapbox://mapny.18d146m2",
	  url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "output",
	"source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "fill-color": "#e3ed58",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.45,
      ],
      "fill-outline-color": "#FF0000",
    },
  },
  {
    id: "germany-lines",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer_lines").checked
        ? "visible"
        : "none",
    },
    "source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "line-color": "#FF0000",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  },
  /*
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "global-highlighted",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      url: "mapbox://mapny.18d146m2",
    },
    layout: {
      visibility: document.getElementById("global_layer").checked
        ? "visible"
        : "none",
    },
    "source-layer": "output",
    paint: {
      "fill-color": "#e3ed58",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0,
      ],
      "fill-outline-color": "#FF0000",
    },
    toggleElement: "global_layer",
  },
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "global",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      url: "mapbox://mapny.18d146m2",
    },
    layout: {
      visibility: document.getElementById("global_layer").checked
        ? "visible"
        : "none",
    },
    "source-layer": "output",
    paint: {
      "fill-color": "#e3ed58",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.45,
      ],
      "fill-outline-color": "#FF0000",
    },
  },
  {
    id: "global-lines",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://mapny.18d146m2",
    },
    layout: {
      visibility: document.getElementById("global_layer_lines").checked
        ? "visible"
        : "none",
    },
    "source-layer": "output",
    paint: {
      "line-color": "#FF0000",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  },
  /*
  {
    id: "grant-lots-lines",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://mapny.dfmrnubu",
    },
    layout: {
      visibility: document.getElementById("grants_layer_lines").checked
        ? "visible"
        : "none",
    },
    "source-layer": "recombined-akk06o",
    paint: {
      "line-color": "#FF0000",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  },
  */
];