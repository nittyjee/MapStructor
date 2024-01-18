
// get Dutch Grants Lots Info from REST API
var dutch_grant_lots_info = [],
  farms_grants_info = [],
  settlements_info = [],
  infos_entity = [],
  settlements_linked_location = [],
  brooklyn_grants_info = [],
  taxlot_events_info = [],
  taxlot_event_entities_info = [];
var dutch_grant_lots_info_length = 0,
  farms_grants_info_length = 0,
  settlements_info_length = 0,
  infos_entity_length = 0,
  brooklyn_grants_length = 0,
  taxlot_events_info_length = 0,
  taxlot_entities_info_length = 0;

var lots_info = new Array();
var lots_info_length = 0;
getLotsInfo();
getSettlementsInfo();
getInfosEntity();
getTaxlotEventsInfo();
getTaxlotEventEntitiesDescrInfo();

var modal_header_text = [];
var modal_content_html = [];
getInfoText(modal_header_text, modal_content_html);

var layer_view_flag = true;
var timeline_pointer_flag = true;
var windoWidth = 0;

var sliderStart = moment("01/01/1626").unix();
var sliderStartDrag = sliderStart;
var sliderEnd = moment("01/01/1700").unix();
var sliderEndDrag = sliderEnd;
var sliderMiddle = (sliderStart + sliderEnd) / 2;
var tooltiPos = -100;

var ruler_step = (sliderEnd - sliderStart) / 10,
  date_ruler1 = sliderStart + ruler_step,
  date_ruler2 = sliderStart + ruler_step * 3,
  date_ruler4 = sliderStart + ruler_step * 7,
  date_ruler5 = sliderStart + ruler_step * 9;

$(document).ready(function () {
  if (jQuery.browser.msie)
    alert(
      "Sorry, this application uses state of the art HTML5 techniques which are not (well) supported by Internet Explorer.\nUse Google Chrome or Mozilla Firefox to experience the full power of HTML5 and this application"
    );

  simple_tooltip("i.layer-info, i.zoom-to-layer", "tooltip");

  windoWidth = $(window).width();
  if (windoWidth <= 637) {
    if (layer_view_flag) {
      $("#studioMenu").css({ "margin-left": "-111%" });
      $("#view-hide-layer-panel").css({ "margin-left": "-337px" });
      $("#mobi-hide-sidebar").css({ "margin-left": "-111%" });
      layer_view_flag = false;
      $("#dir-txt").html("&#9205;");
    }
  }

  $(window).resize(function () {
    windoWidth = $(window).width();
  });

  $(".dutch_grants_layer_item").hide();
  $(".current_lots_layer_item").hide();
  $("#long-island-section-layers").slideUp();
  $("#info-section-layers").slideUp();
  $("#manahatta-maps-section").slideUp();
  $("#long-island-maps-section").slideUp();
  $("#long-island-maps-section1").slideUp();


  $("#ruler-date1").text(moment.unix(date_ruler1).format("YYYY"));
  $("#ruler-date2").text(moment.unix(date_ruler2).format("YYYY"));
  $("#ruler-date3").html(
    "&nbsp; &#8678; &nbsp; TIME &nbsp; &nbsp; &nbsp; &nbsp; SLIDE &nbsp; &#8680;"
  );
  $("#mobi-year").html(
    "&nbsp; &#8678; &nbsp; TIME &nbsp; &nbsp; &nbsp; &nbsp; SLIDE &nbsp; &#8680;"
  );
  $("#ruler-date4").text(moment.unix(date_ruler4).format("YYYY"));
  $("#ruler-date5").text(moment.unix(date_ruler5).format("YYYY"));

  $("#slider").slider({
    min: sliderStart,
    max: sliderEnd,
    step: 86400,
    value: sliderMiddle,
    slide: function (event, ui) {
      tooltiPos = ui.value < sliderMiddle ? 30 : -100;

      if (timeline_pointer_flag) {
        $("#ruler-date3").text(moment.unix(sliderMiddle).format("YYYY"));
        $("#mobi-year").css("display", "none");
        $("#ruler-date1").css("display", "block");
        $("#ruler-date2").css("display", "block");
        $("#ruler-date3").css("display", "block");
        $("#ruler-date4").css("display", "block");
        $("#ruler-date5").css("display", "block");
        timeline_pointer_flag = false;
      }

      if (demo_layer_view_flag) {
        if (ui.value <= sliderStartDrag) {
          $(this).slider("value", sliderStartDrag);
          changeDate(sliderStartDrag);
          $("#date").text(moment.unix(sliderStartDrag).format("DD MMM YYYY"));
          return false;
        }
        if (ui.value >= sliderEndDrag) {
          $(this).slider("value", sliderEndDrag);
          changeDate(sliderEndDrag);
          $("#date").text(moment.unix(sliderEndDrag).format("DD MMM YYYY"));
          return false;
        }
        if (ui.value <= sliderEndDrag && ui.value >= sliderStartDrag) {
          changeDate(ui.value);
          $("#date").text(moment.unix(ui.value).format("DD MMM YYYY"));
        }
      } else {
        changeDate(ui.value);
        $("#date").text(moment.unix(ui.value).format("DD MMM YYYY"));
      }
    },
    create: function (event, ui) {
      var tooltip = $('<div class="ui-slider-tooltip" />')
        .css({
          position: "absolute",
          top: 32,
          left: tooltiPos,
          color: "red",
          width: "100px",
          size: "1",
        })
        .text(moment.unix(sliderMiddle).format("MM/DD/YYYY"));
    },
    change: function (event, ui) {},
  });
  $("#date").text(
    moment.unix($("#slider").slider("values", 0)).format("DD MMM YYYY")
  );

  $(".footnote").click(function () {
    $("#footnotediv").toggle("slide");
  });


  $(".long_island").change(function () {
    if ($(".long_island:checked").length == $(".long_island").length) {
      $("#longisland_items").prop("checked", "checked");
    } else {
      $("#longisland_items").prop("checked", false);
    }
  });

  $("#longisland_coastline").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty("long-island-left", "visibility", "visible");
      afterMap.setLayoutProperty("long-island-right", "visibility", "visible");
    } else {
      beforeMap.setLayoutProperty("long-island-left", "visibility", "none");
      afterMap.setLayoutProperty("long-island-right", "visibility", "none");
    }
  });

  $("#longisland_area").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty(
        "long-island-area-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "long-island-area-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "long-island-area-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "long-island-area-right",
        "visibility",
        "none"
      );
    }
  });

  $("#longisland_items").change(function () {
    $(".long_island").prop("checked", this.checked);
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty("long-island-left", "visibility", "visible");
      afterMap.setLayoutProperty("long-island-right", "visibility", "visible");
      beforeMap.setLayoutProperty(
        "long-island-area-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "long-island-area-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty("long-island-left", "visibility", "none");
      afterMap.setLayoutProperty("long-island-right", "visibility", "none");
      beforeMap.setLayoutProperty(
        "long-island-area-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "long-island-area-right",
        "visibility",
        "none"
      );
    }
  });

  $("#castello_points").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty("places-left", "visibility", "visible");
      afterMap.setLayoutProperty("places-right", "visibility", "visible");
    } else {
      beforeMap.setLayoutProperty("places-left", "visibility", "none");
      afterMap.setLayoutProperty("places-right", "visibility", "none");

      if (castello_layer_view_flag) {
        closeCastelloInfo();
      }
    }
  });

  $("#grants_layer_items").change(function () {
    $(".grants_layer").prop("checked", this.checked);
    if ($(this).prop("checked")) {
      if (lots_info_length == 0) {
        getLotsInfo();
      }
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right",
        "visibility",
        "visible"
      );
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right-highlighted",
        "visibility",
        "visible"
      );

      beforeMap.setLayoutProperty(
        "grant-lots-lines-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "grant-lots-lines-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right",
        "visibility",
        "none"
      );
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right-highlighted",
        "visibility",
        "none"
      );

      beforeMap.setLayoutProperty(
        "grant-lots-lines-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "grant-lots-lines-right",
        "visibility",
        "none"
      );

      if (dgrants_layer_view_flag) {
        closeDutchGrantsInfo();
      }
    }
  });

  $(".grants_layer").change(function () {
    if ($(".grants_layer:checked").length == $(".grants_layer").length) {
      $("#grants_layer_items").prop("checked", "checked");
    } else {
      $("#grants_layer_items").prop("checked", false);
    }
  });

  $("#grants_layer").click(function () {
    if ($(this).prop("checked")) {
      if (lots_info_length == 0) {
        getLotsInfo();
      }
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right",
        "visibility",
        "visible"
      );
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right-highlighted",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right",
        "visibility",
        "none"
      );
      beforeMap.setLayoutProperty(
        "dutch_grants-5ehfqe-left-highlighted",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "dutch_grants-5ehfqe-right-highlighted",
        "visibility",
        "none"
      );
      if (dgrants_layer_view_flag) {
        closeDutchGrantsInfo();
      }
    }
  });

  $("#grants_layer_lines").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty(
        "grant-lots-lines-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "grant-lots-lines-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "grant-lots-lines-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "grant-lots-lines-right",
        "visibility",
        "none"
      );
    }
  });

  // Long Island Native Groups Layer Start
  $("#native_groups_layer_items").change(function () {
    $(".native_groups_layer").prop("checked", this.checked);
    if ($(this).prop("checked")) {
      if (taxlot_entities_info_length == 0) {
        getTaxlotEventEntitiesDescrInfo();
      }
      beforeMap.setLayoutProperty(
        "native-groups-area-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right",
        "visibility",
        "visible"
      );
      beforeMap.setLayoutProperty(
        "native-groups-area-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right-highlighted",
        "visibility",
        "visible"
      );

      beforeMap.setLayoutProperty(
        "native-groups-lines-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-lines-right",
        "visibility",
        "visible"
      );
      beforeMap.setLayoutProperty(
        "native-groups-labels-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-labels-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "native-groups-area-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right",
        "visibility",
        "none"
      );
      beforeMap.setLayoutProperty(
        "native-groups-area-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right-highlighted",
        "visibility",
        "none"
      );

      beforeMap.setLayoutProperty(
        "native-groups-lines-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-lines-right",
        "visibility",
        "none"
      );
      beforeMap.setLayoutProperty(
        "native-groups-labels-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-labels-right",
        "visibility",
        "none"
      );

      if (native_group_layer_view_flag) {
        closeNativeGroupsInfo();
      }
    }
  });

  $(".native_groups_layer").change(function () {
    if (
      $(".native_groups_layer:checked").length ==
      $(".native_groups_layer").length
    ) {
      $("#native_groups_layer_items").prop("checked", "checked");
    } else {
      $("#native_groups_layer_items").prop("checked", false);
    }
  });

  $("#native_groups_area").click(function () {
    if ($(this).prop("checked")) {
      if (taxlot_entities_info_length == 0) {
        getTaxlotEventEntitiesDescrInfo();
      }
      beforeMap.setLayoutProperty(
        "native-groups-area-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right",
        "visibility",
        "visible"
      );
      beforeMap.setLayoutProperty(
        "native-groups-area-left-highlighted",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right-highlighted",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "native-groups-area-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right",
        "visibility",
        "none"
      );
      beforeMap.setLayoutProperty(
        "native-groups-area-left-highlighted",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-area-right-highlighted",
        "visibility",
        "none"
      );

      if (native_group_layer_view_flag) {
        closeNativeGroupsInfo();
      }
    }
  });

  $("#native_groups_labels").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty(
        "native-groups-labels-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-labels-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "native-groups-labels-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-labels-right",
        "visibility",
        "none"
      );
    }
  });

  $("#native_groups_lines").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty(
        "native-groups-lines-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "native-groups-lines-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "native-groups-lines-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "native-groups-lines-right",
        "visibility",
        "none"
      );
    }
  });

  $("#grant_lots").click(function () {
    if ($(this).prop("checked")) {
      beforeMap.setLayoutProperty("grant-lots-left", "visibility", "visible");
      afterMap.setLayoutProperty("grant-lots-right", "visibility", "visible");
    } else {
      beforeMap.setLayoutProperty("grant-lots-left", "visibility", "none");
      afterMap.setLayoutProperty("grant-lots-right", "visibility", "none");

      if (grant_lots_view_flag) {
        closeGrantLotsInfo();
      }
    }
  });

  $("#view-hide-layer-panel").click(function () {
    if (layer_view_flag) {
      $("#studioMenu").animate({ "margin-left": "-337px" }, 500);
      $(this).animate({ "margin-left": "-337px" }, 500);
      $("#mobi-hide-sidebar").animate({ "margin-left": "-337px" }, 500);
      layer_view_flag = false;
      $("#dir-txt").html("&#9205;");
      $("#rightInfoBar").slideUp();
    } else {
      $("#studioMenu").animate({ "margin-left": "0px" }, 500);
      $(this).animate({ "margin-left": "0px" }, 500);
      $("#mobi-hide-sidebar").animate({ "margin-left": "0px" }, 500);
      layer_view_flag = true;
      $("#dir-txt").html("&#9204;");
      if (windoWidth > 637) $("#rightInfoBar").slideDown();
    }
  });

  $("#mobi-view-sidebar").click(function () {
    if (!layer_view_flag) {
      $("#studioMenu").animate({ "margin-left": "0px" }, 500);
      $("#view-hide-layer-panel").animate({ "margin-left": "0px" }, 500);
      $("#mobi-hide-sidebar").animate({ "margin-left": "0px" }, 500);
      layer_view_flag = true;
      $("#dir-txt").html("&#9204;");
    }
  });

  $("#mobi-hide-sidebar").click(function () {
    if (layer_view_flag) {
      $("#studioMenu").animate({ "margin-left": "-111%" }, 500);
      $("#view-hide-layer-panel").animate({ "margin-left": "-337px" }, 500);
      $(this).animate({ "margin-left": "-111%" }, 500);
      layer_view_flag = false;
      $("#dir-txt").html("&#9205;");
    }
  });

  /* change timeline CSS property on mouseover & mouseout */
  $("div.timeline")
    .mouseover(function () {
      $("div.ui-widget-content").css("background-color", "#baddf9");
      $("a.ui-slider-handle").css("background", "red");
    })
    .mouseout(function () {
      $("div.ui-widget-content").css("background-color", "#d1ecff");
      $("a.ui-slider-handle").css("background", "");
    });

  $(".trigger-popup").click(function (e) {
    var popup_id =
      e.target.id == "info" || e.target.id == "about-info"
        ? "about"
        : e.target.id;
    if (modal_header_text[popup_id].length > 0) {
      $("div.modal-header h1").text(modal_header_text[e.target.id]);
      $("div.modal-content").html(modal_content_html[e.target.id]);
      $("label#open-popup").trigger("click");
    }
  });

  // close modal by click outside the box

  $("#circle_point").click(function () {
    if ($(this).prop("checked")) {
      if (taxlot_events_info_length == 0) {
        getTaxlotEventsInfo();
      }
      beforeMap.setLayoutProperty(
        "lot_events-bf43eb-left",
        "visibility",
        "visible"
      );
      afterMap.setLayoutProperty(
        "lot_events-bf43eb-right",
        "visibility",
        "visible"
      );
    } else {
      beforeMap.setLayoutProperty(
        "lot_events-bf43eb-left",
        "visibility",
        "none"
      );
      afterMap.setLayoutProperty(
        "lot_events-bf43eb-right",
        "visibility",
        "none"
      );

      if (demo_layer_view_flag) {
        closeDemoInfo();
      }
    }
  });

  $("div.modal-body").click(function (e) {
    e.stopPropagation();
  });

  $("div.modal").click(function () {
    $("label#close").trigger("click");
  });

  setTimeout(function () {
    $("div#loading").css("display", "none");
  }, 5000);
});