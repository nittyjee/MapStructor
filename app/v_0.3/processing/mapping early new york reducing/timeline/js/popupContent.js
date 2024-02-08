//#region Main Popup Content Generation
// This function dynamically generates popup content based on the given ID and features from the map.
// It identifies the map layer and selects the appropriate content generation function for the popup.
function generatePopupContent(id, features, map) {
  const position = map === afterMap ? "right" : "left";
  if (id === `dutch_grants-5ehfqe-${position}`)
    return dutchGrantPopUpContent(features);
  else if (id === `lot_events-bf43eb-${position}`)
    return lotEventsPopupContent(features);
  else if (id === `places-${position}`)
    return castelloEventsPopUpContent(features);
  else if (id === `native-groups-area-${position}`)
    return longIslandPopupContent(features);
}



/* POSSIBLE REFACTOR:

function generatePopupContent(id, features, map) {
  const position = map === afterMap ? "right" : "left";
  const contentGenerators = {
    [`dutch_grants-5ehfqe-${position}`]: dutchGrantPopUpContent,
    [`lot_events-bf43eb-${position}`]: lotEventsPopupContent,
    [`places-${position}`]: castelloEventsPopUpContent,
    [`native-groups-area-${position}`]: longIslandPopupContent
  };

  return contentGenerators[id] ? contentGenerators[id](features) : null;
}

//END POSSIBLE REFACTOR
*/



//#endregion


//#region Utility Function
// Retrieves a globally defined function by its name, allowing for dynamic function execution.
// Useful for invoking specific popup content functions based on string identifiers.

function getPopupByName(name) {
  return window[name];
}
//#endregion


//#region Popup Content Functions
// Each function within this region is responsible for generating the HTML content
// for a different type of map layer popup. Functions are customized for Dutch Grants,
// Lot Events, Castello Events, and Long Island features, providing tailored content for each.

// Generates popup content for Dutch Grants, including name and lot details.
function dutchGrantPopUpContent(features){
    let PopUpHTML = ""
    if (
        typeof dutch_grant_lots_info[features[0].properties.Lot] == "undefined"
      ) {
        PopUpHTML =
          "<div class='infoLayerDutchGrantsPopUp'>" +
          features[0].properties.name +
          "<br>";
      } else {
        PopUpHTML =
          "<div class='infoLayerDutchGrantsPopUp'>" +
          (dutch_grant_lots_info[features[0].properties.Lot].name_txt.length > 0
            ? dutch_grant_lots_info[features[0].properties.Lot].name_txt
            : features[0].properties.name) +
          "<br>";
      }
      PopUpHTML +=
        "<b>Dutch Grant Lot: </b>" + features[0].properties.Lot + "</div>";
    return PopUpHTML;
}

// Generates popup content for Lot Events, displaying taxlot information with a hyperlink.
function lotEventsPopupContent(features) {
    return "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
    features[0].properties.TAXLOT +
    "' target='_blank'>" +
    features[0].properties.TAXLOT +
    "</a></h2></b></div>"
}

// Generates popup content for Castello Events, showing taxlot information from 1660.
function castelloEventsPopUpContent(features) {
    return "<div class='infoLayerCastelloPopUp'><b>Taxlot (1660):</b><br>" +
    features[0].properties.LOT2 +
    "</div>"
}

// Generates popup content for Long Island, displaying names and handling undefined properties.
function longIslandPopupContent(features){
    var PopUpHTML = ""
    if (
        typeof taxlot_event_entities_info[features[0].properties.nid] ==
          "undefined" ||
        features[0].properties.nid == ""
      ) {
        PopUpHTML =
          "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
          features[0].properties.name +
          "</div>";
      } else {
        PopUpHTML =
          "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
          (taxlot_event_entities_info[features[0].properties.nid].name.length > 0
            ? taxlot_event_entities_info[features[0].properties.nid].name
            : features[0].properties.name) +
          "</div>";
      }
      return PopUpHTML
}

// #endregion


// #region Click events flags

// Initialize flags for tracking click events on various map features.
var castello_click_ev = false,
  grant_lots_click_ev = false,
  demo_taxlot_click_ev = false,
  dutch_grant_click_ev = false,
  native_groups_click_ev = false,
  farms_click_ev = false,
  settlements_click_ev = false,
  karl_click_ev = false,
  curr_layer_click_ev = false,
  info_click_ev = false,
  gravesend_click_ev = false,
  zoom_labels_click_ev = false;

// #endregion



// #region Popups Initialization
// Initialize popups for displaying information on the maps. These popups are configured to not close on click, indicating they may be used for persistent display of information.

// Function to create a mapboxgl.Popup with common options
function createPopup(offset = 0) {
  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: offset
  });
}

// Initialize popups for displaying information on the maps
var afterMapPopUp = createPopup(),
    beforeMapPopUp = createPopup(),
    afterMapPlacesPopUp = createPopup(),
    beforeMapPlacesPopUp = createPopup(),
    afterHighCastelloPopUp = createPopup(),
    beforeHighCastelloPopUp = createPopup(),
    afterHighGrantLotsPopUp = createPopup(5),
    beforeHighGrantLotsPopUp = createPopup(5),
    afterMapGrantLotPopUp = createPopup(5),
    beforeMapGrantLotPopUp = createPopup(5),
    afterHighMapGrantLotPopUp = createPopup(5),
    beforeHighMapGrantLotPopUp = createPopup(5),
    afterMapDutchGrantPopUp = createPopup(5),
    beforeMapDutchGrantPopUp = createPopup(5),
    afterMapNativeGroupsPopUp = createPopup(5),
    beforeMapNativeGroupsPopUp = createPopup(5),
    afterHighMapNativeGroupsPopUp = createPopup(5),
    beforeHighMapNativeGroupsPopUp = createPopup(5);


// #endregion


// #region Hovered and Clicked State Management
// Variables to manage the state of hovered and clicked map features. These are used to track which features are currently under interaction, allowing for dynamic updates to the UI or map based on user actions.
var hoveredStateIdRight = null,
hoveredStateIdLeft = null,
hoveredStateIdRightCircle = null,
hoveredStateIdLeftCircle = null,
hoveredGrantStateIdRight = null,
hoveredGrantStateIdLeft = null,
hoveredGrantLotIdRight = null,
hoveredGrantLotIdLeft = null,
hoveredDutchGrantIdRight = null,
hoveredDutchGrantIdLeft = null,
/* REPLACE THIS */
hoveredNativeGroupsIdRight = null,
hoveredNativeGroupsIdLeft = null;
(hoveredInfoIdRight = null), (hoveredInfoIdLeft = null);

var clickedInfoId = null,
clickedStateId = null,
clickedSettlementsId = null;

var demo_layer_feature_props = null,
demo_layer_features = null,
demo_layer_taxlot = "";
// #endregion


// #region Event Handling and Popups
// Functions to handle click events on map features and display popups with detailed information.

beforeMap.on("load", function () {
  init_zoom = beforeMap.getZoom();
  init_bearing = beforeMap.getBearing();
  init_center = beforeMap.getCenter();
  
  beforeMap
    .on("click", "lot_events-bf43eb-left", function (e) {
      DemoClickHandle(e);
    })
    .on("click", "places-left", function (e) {
      CastelloClickHandle(e);
    })
  
    .on("click", "dutch_grants-5ehfqe-left", function (e) {
      DutchGrantsClickHandle(e);
    })
  
    .on("click", "native-groups-area-left", function (e) {
      NativeGroupsClickHandle(e);
    })
    .on("click", function () {
      DefaultHandle();
    });
  });
  
  afterMap.on("load", function () {
  afterMap
    .on("click", "lot_events-bf43eb-right", function (e) {
      DemoClickHandle(e);
    })
    .on("click", "places-right", function (e) {
      CastelloClickHandle(e);
    })
    .on("click", "dutch_grants-5ehfqe-right", function (e) {
      DutchGrantsClickHandle(e);
    })
    .on("click", "native-groups-area-right", function (e) {
      NativeGroupsClickHandle(e);
    })
    .on("click", function () {
      DefaultHandle();
    });
  });
  
  beforeMap.on("error", function (e) {
  // Hide those annoying non-error errors
  if (e && e.error !== "Error") console.log(e);
  });
  
  afterMap.on("error", function (e) {
  // Hide those annoying non-error errors
  if (e && e.error !== "Error") console.log(e);
  });
  
  // #endregion
  
  

//#region Utility Handlers

function DefaultHandle() {
  if (
    !demo_taxlot_click_ev &&
    !castello_click_ev &&
    !grant_lots_click_ev &&
    !dutch_grant_click_ev &&
    !farms_click_ev &&
    !curr_layer_click_ev &&
    !settlements_click_ev &&
    !info_click_ev &&
    !gravesend_click_ev &&
    !native_groups_click_ev &&
    !karl_click_ev &&
    !zoom_labels_click_ev
  ) {
    if (windoWidth > 637)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");
  }

  demo_taxlot_click_ev = false;
  castello_click_ev = false;
  grant_lots_click_ev = false;
  dutch_grant_click_ev = false;
  native_groups_click_ev = false;
  zoom_labels_click_ev = false;
}

//#endregion


//#region Close Info and ClickHandle Functions

function closeCastelloInfo() {
  $("#infoLayerCastello").slideUp();
  castello_layer_view_flag = false;
  if (afterHighCastelloPopUp.isOpen()) afterHighCastelloPopUp.remove();
  if (beforeHighCastelloPopUp.isOpen()) beforeHighCastelloPopUp.remove();
}

function CastelloClickHandle(event) {
  if (castello_layer_view_flag && clickedStateId == event.features[0].id) {
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) {
        $("#rightInfoBar").css("display", "block");
        setTimeout(function () {
          $("#rightInfoBar").slideUp();
        }, 500);
      }

    closeCastelloInfo();
  } else {
    clickedStateId = event.features[0].id;

    places_popup_html =
      "<h3>Castello Taxlot (1660)</h3><hr>" +
      "<br>" +
      "<b>" +
      "Taxlot: " +
      "</b>" +
      event.features[0].properties.LOT2 +
      "<br>" +
      "<b>" +
      "Property Type: " +
      "</b>" +
      event.features[0].properties.tax_lots_1 +
      "<br>" +
      "<br>" +
      "<b>" +
      "Encyclopedia Page: " +
      "</b>" +
      "<br>" +
      '<a href="https://encyclopedia.nahc-mapping.org/lots/taxlot' +
      event.features[0].properties.LOT2 +
      '" target="_blank">https://encyclopedia.nahc-mapping.org/lots/taxlot' +
      event.features[0].properties.LOT2 +
      "</a>";

    var coordinates = [];
    coordinates = event.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    beforeHighCastelloPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='infoLayerCastelloPopUp'><b>Taxlot (1660):</b><br>" +
          event.features[0].properties.LOT2 +
          "</div>"
      );
    if (!beforeHighCastelloPopUp.isOpen())
      beforeHighCastelloPopUp.addTo(beforeMap);

    afterHighCastelloPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='infoLayerCastelloPopUp'><b>Taxlot (1660):</b><br>" +
          event.features[0].properties.LOT2 +
          "</div>"
      );
    if (!afterHighCastelloPopUp.isOpen())
      afterHighCastelloPopUp.addTo(afterMap);
    if ($(".infoLayerElem").first().attr("id") != "infoLayerCastello")
      $("#infoLayerCastello").insertBefore($(".infoLayerElem").first());
    $("#infoLayerCastello").html(places_popup_html).slideDown();

    if (!layer_view_flag)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");
    //}
    castello_layer_view_flag = true;
  }
  castello_click_ev = true;
}

function closeDemoInfo() {
  $("#demoLayerInfo").slideUp();
  demo_layer_view_flag = false;
  if (afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.remove();
  if (beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.remove();
}

function DemoClickHandle(event) {
  if (demo_layer_view_flag) {
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) {
        $("#rightInfoBar").css("display", "block");
        setTimeout(function () {
          $("#rightInfoBar").slideUp();
        }, 500);
      }

    closeDemoInfo();
  } else {
    demo_layer_taxlot = event.features[0].properties.TAXLOT;

    demoFilterRangeCalc();

    buildPopUpInfo(event.features[0].properties);
    if ($(".infoLayerElem").first().attr("id") != "demoLayerInfo")
      $("#demoLayerInfo").insertBefore($(".infoLayerElem").first());
    $("#demoLayerInfo").slideDown();

    if (!layer_view_flag)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");

    demo_layer_view_flag = true;

    var coordinates = [];
    coordinates = event.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    beforeHighDemoPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
          demo_layer_taxlot +
          "' target='_blank'>" +
          demo_layer_taxlot +
          "</a></h2></b></div>"
      );
    if (!beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.addTo(beforeMap);

    afterHighDemoPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
          demo_layer_taxlot +
          "' target='_blank'>" +
          demo_layer_taxlot +
          "</a></h2></b></div>"
      );
    if (!afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.addTo(afterMap);
  }
  demo_taxlot_click_ev = true;
}


function closeDutchGrantsInfo() {
  $("#infoLayerDutchGrants").slideUp();
  dgrants_layer_view_flag = false;
  afterMap.setFeatureState(
    {
      source: "dutch_grants-5ehfqe-right-highlighted",
      sourceLayer: "dutch_grants-5ehfqe",
      id: dgrants_layer_view_id,
    },
    { hover: false }
  );
  beforeMap.setFeatureState(
    {
      source: "dutch_grants-5ehfqe-left-highlighted",
      sourceLayer: "dutch_grants-5ehfqe",
      id: dgrants_layer_view_id,
    },
    { hover: false }
  );
  if (afterHighMapGrantLotPopUp.isOpen()) afterHighMapGrantLotPopUp.remove();
  if (beforeHighMapGrantLotPopUp.isOpen()) beforeHighMapGrantLotPopUp.remove();
}

function DutchGrantsClickHandle(event) {
  var highPopUpHTML = "";
  if (
    typeof dutch_grant_lots_info[event.features[0].properties.Lot] ==
    "undefined"
  ) {
    highPopUpHTML =
      "<div class='infoLayerDutchGrantsPopUp'>" +
      event.features[0].properties.name +
      "<br>";
  } else {
    highPopUpHTML =
      "<div class='infoLayerDutchGrantsPopUp'>" +
      (dutch_grant_lots_info[event.features[0].properties.Lot].name_txt.length >
      0
        ? dutch_grant_lots_info[event.features[0].properties.Lot].name_txt
        : event.features[0].properties.name) +
      "<br>";
  }
  highPopUpHTML +=
    "<b>Dutch Grant Lot: </b>" + event.features[0].properties.Lot + "</div>";

  if (dgrants_layer_view_id == event.features[0].id) {
    if (dgrants_layer_view_flag) {
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) {
          $("#rightInfoBar").css("display", "block");
          setTimeout(function () {
            $("#rightInfoBar").slideUp();
          }, 500);
        }

      closeDutchGrantsInfo();
    } else {
      buildDutchGrantPopUpInfo(event.features[0].properties);
      if ($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
        $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
      $("#infoLayerDutchGrants").slideDown();
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
      dgrants_layer_view_flag = true;
      afterMap.setFeatureState(
        {
          source: "dutch_grants-5ehfqe-right-highlighted",
          sourceLayer: "dutch_grants-5ehfqe",
          id: dgrants_layer_view_id,
        },
        { hover: true }
      );
      beforeMap.setFeatureState(
        {
          source: "dutch_grants-5ehfqe-left-highlighted",
          sourceLayer: "dutch_grants-5ehfqe",
          id: dgrants_layer_view_id,
        },
        { hover: true }
      );
      afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
      if (!afterHighMapGrantLotPopUp.isOpen())
        afterHighMapGrantLotPopUp.addTo(afterMap);
      beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
      if (!beforeHighMapGrantLotPopUp.isOpen())
        beforeHighMapGrantLotPopUp.addTo(beforeMap);
    }
  } else {
    buildDutchGrantPopUpInfo(event.features[0].properties);
    if ($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
      $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
    $("#infoLayerDutchGrants").slideDown();
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
    dgrants_layer_view_flag = true;
    //*A#
    afterMap.setFeatureState(
      {
        source: "dutch_grants-5ehfqe-right-highlighted",
        sourceLayer: "dutch_grants-5ehfqe",
        id: dgrants_layer_view_id,
      },
      { hover: false }
    );
    afterMap.setFeatureState(
      {
        source: "dutch_grants-5ehfqe-right-highlighted",
        sourceLayer: "dutch_grants-5ehfqe",
        id: event.features[0].id,
      },
      { hover: true }
    );
    beforeMap.setFeatureState(
      {
        source: "dutch_grants-5ehfqe-left-highlighted",
        sourceLayer: "dutch_grants-5ehfqe",
        id: dgrants_layer_view_id,
      },
      { hover: false }
    );
    beforeMap.setFeatureState(
      {
        source: "dutch_grants-5ehfqe-left-highlighted",
        sourceLayer: "dutch_grants-5ehfqe",
        id: event.features[0].id,
      },
      { hover: true }
    );
    afterHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
    if (!afterHighMapGrantLotPopUp.isOpen())
      afterHighMapGrantLotPopUp.addTo(afterMap);
    beforeHighMapGrantLotPopUp.setLngLat(event.lngLat).setHTML(highPopUpHTML);
    if (!beforeHighMapGrantLotPopUp.isOpen())
      beforeHighMapGrantLotPopUp.addTo(beforeMap);
  }
  dgrants_layer_view_id = event.features[0].id;
  dutch_grant_click_ev = true;
}


function closeNativeGroupsInfo() {
  $("#infoLayerNativeGroups").slideUp();
  native_group_layer_view_flag = false;
  afterMap.setFeatureState(
    {
      source: "native-groups-area-right-highlighted",
      sourceLayer: "indian_areas_long_island-50h2dj",
      id: native_group_layer_view_id,
    },
    { hover: false }
  );
  beforeMap.setFeatureState(
    {
      source: "native-groups-area-left-highlighted",
      sourceLayer: "indian_areas_long_island-50h2dj",
      id: native_group_layer_view_id,
    },
    { hover: false }
  );
  if (afterHighMapNativeGroupsPopUp.isOpen())
    afterHighMapNativeGroupsPopUp.remove();
  if (beforeHighMapNativeGroupsPopUp.isOpen())
    beforeHighMapNativeGroupsPopUp.remove();
}

function NativeGroupsClickHandle(event) {
  var highPopUpHTML = "";

  if (
    typeof taxlot_event_entities_info[event.features[0].properties.nid] ==
      "undefined" ||
    event.features[0].properties.nid == ""
  ) {
    highPopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      event.features[0].properties.name +
      "</div>";
  } else {
    highPopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      (taxlot_event_entities_info[event.features[0].properties.nid].name
        .length > 0
        ? taxlot_event_entities_info[event.features[0].properties.nid].name
        : event.features[0].properties.name) +
      "</div>";
  }

  if (native_group_layer_view_id == event.features[0].id) {
    if (native_group_layer_view_flag) {
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) {
          $("#rightInfoBar").css("display", "block");
          setTimeout(function () {
            $("#rightInfoBar").slideUp();
          }, 500);
        }

      closeNativeGroupsInfo();
    } else {
      buildNativeGroupPopUpInfo(event.features[0].properties);
      if ($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
        $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
      $("#infoLayerNativeGroups").slideDown();
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
      native_group_layer_view_flag = true;
      afterMap.setFeatureState(
        {
          source: "native-groups-area-right-highlighted",
          sourceLayer: "indian_areas_long_island-50h2dj",
          id: native_group_layer_view_id,
        },
        { hover: true }
      );
      beforeMap.setFeatureState(
        {
          source: "native-groups-area-left-highlighted",
          sourceLayer: "indian_areas_long_island-50h2dj",
          id: native_group_layer_view_id,
        },
        { hover: true }
      );
      afterHighMapNativeGroupsPopUp
        .setLngLat(event.lngLat)
        .setHTML(highPopUpHTML);
      if (!afterHighMapNativeGroupsPopUp.isOpen())
        afterHighMapNativeGroupsPopUp.addTo(afterMap);
      beforeHighMapNativeGroupsPopUp
        .setLngLat(event.lngLat)
        .setHTML(highPopUpHTML);
      if (!beforeHighMapNativeGroupsPopUp.isOpen())
        beforeHighMapNativeGroupsPopUp.addTo(beforeMap);
    }
  } else {
    buildNativeGroupPopUpInfo(event.features[0].properties);
    if ($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
      $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
    $("#infoLayerNativeGroups").slideDown();
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
    native_group_layer_view_flag = true;
    afterMap.setFeatureState(
      {
        source: "native-groups-area-right-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: native_group_layer_view_id,
      },
      { hover: false }
    );
    afterMap.setFeatureState(
      {
        source: "native-groups-area-right-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: event.features[0].id,
      },
      { hover: true }
    );
    beforeMap.setFeatureState(
      {
        source: "native-groups-area-left-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: native_group_layer_view_id,
      },
      { hover: false }
    );
    beforeMap.setFeatureState(
      {
        source: "native-groups-area-left-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: event.features[0].id,
      },
      { hover: true }
    );
    afterHighMapNativeGroupsPopUp
      .setLngLat(event.lngLat)
      .setHTML(highPopUpHTML);
    if (!afterHighMapNativeGroupsPopUp.isOpen())
      afterHighMapNativeGroupsPopUp.addTo(afterMap);
    beforeHighMapNativeGroupsPopUp
      .setLngLat(event.lngLat)
      .setHTML(highPopUpHTML);
    if (!beforeHighMapNativeGroupsPopUp.isOpen())
      beforeHighMapNativeGroupsPopUp.addTo(beforeMap);
  }
  native_group_layer_view_id = event.features[0].id;
  native_groups_click_ev = true;
}

function closeGrantLotsInfo() {
  $("#infoLayerGrantLots").slideUp();
  grant_lots_view_flag = false;
  if (afterHighGrantLotsPopUp.isOpen()) afterHighGrantLotsPopUp.remove();
  if (beforeHighGrantLotsPopUp.isOpen()) beforeHighGrantLotsPopUp.remove();
}


// #endregion