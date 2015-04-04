var map, featureList, boroughSearch = [], bicycleParkingSearch = [], cameraSearch = [];
var projectSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#community-btn").click(function() {
  $("#communityModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through camera layer and add only features which are in the map bounds */
  cameras.eachLayer(function (layer) {
    if (map.hasLayer(cameraLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i width="16" height="18" class="fa fa-video-camera"></i></td><td class="feature-name">' + layer.feature.properties.nom + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through projects layer and add only features which are in the map bounds */
  projects.eachLayer(function (layer) {
    if (map.hasLayer(projectLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i width="16" height="18" class="fa fa-comments-o"></i></td><td class="feature-name">' + layer.feature.properties.nom + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through bicycle parkings layer and add only features which are in the map bounds */
  bicycleParkings.eachLayer(function (layer) {
    if (map.hasLayer(bicycleParkingLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i width="16" height="18" class="fa fa-bicycle"></i></td><td class="feature-name">' + layer.feature.properties.adresse + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

function add() {

}

var pistes_cyclables = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      weight: 2,
      opacity: 1
    };
  }
});
$.getJSON("data/pistes_cyclables.geojson", function (data) {
  pistes_cyclables.addData(data);
});

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "green",
      fill: true,
      opacity: 1,
      weight: 1,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom du quartier</th><td>" + feature.properties.nom + "</td></tr>" + "<tr><th>Numéro d'arrondissement</th><td>" + feature.properties.numero_arrondissement + "</td></tr>" + "<tr><th>Nombre d'habitants inscrits</th><td>" + feature.properties.user_count + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.nom_majuscule);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        },
        mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        boroughs.resetStyle(e.target);
      }
      });
    }
    boroughSearch.push({
      name: layer.feature.properties.nom,
      source: "Quartiers",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

var subwayLines = L.geoJson(null, {
  style: function (feature) {
    if (feature.properties.ligne === "A") {
      return {
        color: "#EE3897",
        weight: 5,
        opacity: 1
      };
    }
    if (feature.properties.ligne === "B") {
      return {
        color: "#007DC5",
        weight: 5,
        opacity: 1
      };
    }
    if (feature.properties.ligne === "F1" || feature.properties.ligne === "F2") {
      return {
        color: "#8CC751",
        weight: 5,
        opacity: 1
      };
    }

    if (feature.properties.ligne === "D") {
      return {
        color: "#00AB4F",
        weight: 5,
        opacity: 1
      };
    }
    if (feature.properties.ligne === "C") {
      return {
        color: "#F99D1C",
        weight: 5,
        opacity: 1
      };
    }
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Ligne</th><td>" + feature.properties.ligne + "</td></tr>" + "<tr><th>Libellé</th><td>" + feature.properties.libelle + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

var cameraLayer = L.geoJson(null);
var cameras = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: 'video-camera',
        markerColor: 'orange',
        prefix: 'fa'
      })
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.nom + "</td></tr>" + "<tr><th>Dernière image capturée</th><td><img src='" + feature.properties.url + "'></img></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.nom);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/camera_icon.jpeg"></td><td class="feature-name">' + layer.feature.properties.nom + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      cameraSearch.push({
        name: layer.feature.properties.nom,
        address: layer.feature.properties.libellelong,
        source: "Cameras",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/connected_cameras.geojson", function (data) {
  cameras.addData(data);
  map.addLayer(cameraLayer);
});

var bicycleParkingLayer = L.geoJson(null);
var bicycleParkings = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: 'bicycle',
        markerColor: 'red',
        prefix: 'fa'
      })
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Adresse</th><td>" + feature.properties.adresse + "</td></tr>" + "<tr><th>Dernière image capturée</th><td><img src='" + feature.properties.url + "'></img></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.adresse);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/camera_icon.jpeg"></td><td class="feature-name">' + layer.feature.properties.nom + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      bicycleParkingSearch.push({
        address: layer.feature.properties.adresse,
        source: "",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/parc_a_velos.geojson", function (data) {
  bicycleParkings.addData(data);
  map.addLayer(bicycleParkingLayer);
});

var projectLayer = L.geoJson(null);
var projects = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: 'comments-o',
        markerColor: 'blue',
        prefix: 'fa'
      })
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.nom + "</td></tr>" + "<tr><th>Description</th><td>" + feature.properties.description + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.nom);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/camera_icon.jpeg"></td><td class="feature-name">' + layer.feature.properties.nom + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      projectSearch.push({
        name: layer.feature.properties.nom,
        source: "Projects",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/projects.geojson", function (data) {
  projects.addData(data);
  map.addLayer(projectLayer);
});

map = L.map("map", {
  zoom: 14,
  center: [45.758415,4.83241],
  layers: [mapquestOSM, boroughs, markerClusters],//, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === bicycleParkingLayer) {
    markerClusters.addLayer(bicycleParkings);
    syncSidebar();
  }
  if (e.layer === cameraLayer) {
    markerClusters.addLayer(cameras);
    syncSidebar();
  }
  if (e.layer === projectLayer) {
    markerClusters.addLayer(projects);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === bicycleParkingLayer) {
    markerClusters.removeLayer(bicycleParkings);
    syncSidebar();
  }
  if (e.layer === cameraLayer) {
    markerClusters.removeLayer(cameras);
    syncSidebar();
  }
  if (e.layer === projectLayer) {
    markerClusters.removeLayer(projects);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by Overcharge | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "icon-direction",
  metric: false,
  strings: {
    title: "Ma géolocalisation",
    popup: "Vous êtes à {distance} {unit} de cet endroit",
    outsideMapBoundsMsg: "Vous êtes en dehors des limites de la carte"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Carte classique": mapquestOSM
};

var groupedOverlays = {
  "Objets d'intérêt": {
    "<i width='30' height='36' class='fa fa-bicycle'>&nbsp;Parcs à vélos": bicycleParkingLayer,
    "<i width='30' height='36' class='fa fa-comments-o'>&nbsp;Projets participatifs": projectLayer,
    "<i width='30' height='36' class='fa fa-video-camera'>&nbsp;Caméras connectées": cameraLayer
  },
  "Filtres urbains": {
    "Quartiers": boroughs,
    "Lignes de métro & funiculaires": subwayLines,
    "Pistes cyclables": pistes_cyclables
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var camerasBH = new Bloodhound({
    name: "Cameras",
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: cameraSearch,
    limit: 10
  });

  var projetsBH = new Bloodhound({
    name: "Projects",
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: projectSearch,
    limit: 10
  });

  var bicycleParkingsBH = new Bloodhound({
    name: "BicycleParkings",
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d.address);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: bicycleParkingSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  geonamesBH.initialize();
  camerasBH.initialize();
  projetsBH.initialize();
  bicycleParkingsBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Quartiers</h4>"
    }
  }, {
    name: "Projects",
    displayKey: "name",
    source: projetsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i width='30' height='36' class='fa fa-comments-o'>&nbsp;Projets participatifs</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Cameras",
    displayKey: "name",
    source: camerasBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i width='30' height='36' class='fa fa-video-camera'>&nbsp;Caméras connectées</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "BicycleParkings",
    displayKey: "address",
    source: bicycleParkingsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i width='30' height='36' class='fa fa-bicycle'>&nbsp;Parcs à vélos</h4>",
      suggestion: Handlebars.compile(["<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Quartiers") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Projects") {
      if (!map.hasLayer(projectLayer)) {
        map.addLayer(projectLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Cameras") {
      if (!map.hasLayer(cameraLayer)) {
        map.addLayer(cameraLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "BicycleParkings") {
      if (!map.hasLayer(bicycleParkingLayer)) {
        map.addLayer(bicycleParkingLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
