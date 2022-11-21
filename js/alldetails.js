var World = {
  isRequestingData: false,
  initiallyLoadedData: false,
  markerDrawableIdle: null,
  markerDrawableSelected: null,
  markerDrawableDirectionIndicator: null,

  markerList: [],

  currentMarker: null,

  locationUpdateCounter: 0,
  updatePlacemarkDistancesEveryXLocationUpdates: 10,

  loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
    World.markerList = [];

    World.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
      onError: World.onError,
    });

    World.markerDrawableSelected = new AR.ImageResource(
      "assets/marker_select.png",
      {
        onError: World.onError,
      }
    );
    World.markerDrawableDirectionIndicator = new AR.ImageResource(
      "assets/indi.png",
      {
        onError: World.onError,
      }
    );

    function searchParam(key) {
      return new URLSearchParams(location.search).get(key);
    }
    var link4 = searchParam("type");

    for (
      var currentPlaceNr = 0;
      currentPlaceNr < poiData.length;
      currentPlaceNr++
    ) {
      var singlePoi = {
        id: poiData[currentPlaceNr].id,
        latitude: parseFloat(poiData[currentPlaceNr].latitude),
        longitude: parseFloat(poiData[currentPlaceNr].longitude),
        altitude: parseFloat(poiData[currentPlaceNr].altitude),
        title: poiData[currentPlaceNr].name,
        description: poiData[currentPlaceNr].description,
        distance: poiData[currentPlaceNr].distance,
        imagelink: poiData[currentPlaceNr].imagelink,
      };

      if(link4 == "all"){
        World.markerList.push(new Marker(singlePoi));
      }
      else if(link4 == poiData[currentPlaceNr].name){
        World.markerList.push(new Marker(singlePoi));
      }

    }

    World.updateDistanceToUserValues();

    World.updateStatusMessage(currentPlaceNr + " places loaded");
  },

  updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
    for (var i = 0; i < World.markerList.length; i++) {
      World.markerList[i].distanceToUser =
        World.markerList[i].markerObject.locations[0].distanceToUser();
    }
  },

  locationChanged: function locationChangedFn(lat, lon, alt, acc) {
    if (!World.initiallyLoadedData) {
      World.requestDataFromLocal(lat, lon);
      World.initiallyLoadedData = true;
    }
  },

  onMarkerDeSelected: function onMarkerDeSelectedFn(marker) {
    World.closePanel();
  },

  onMarkerSelected: function onMarkerSelectedFn(marker) {
    World.closePanel();

    World.currentMarker = marker;
    document.getElementById("poiDetailTitle").innerHTML = marker.poiData.title;
    document.getElementById("poiDetailDescription").innerHTML =
      marker.poiData.description;

    document.getElementById("poiDetailImage").src = marker.poiData.imagelink;

    if (undefined === marker.distanceToUser) {
      marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
    }

    var distanceToUserValue =
      marker.distanceToUser > 999
        ? (marker.distanceToUser / 1000).toFixed(2) + " km"
        : Math.round(marker.distanceToUser) + " m";

    // document.getElementById("poiDetailDistance").innerHTML = distanceToUserValue;

    document.getElementById("panelPoiDetail").style.visibility = "visible";
  },

  closePanel: function closePanel() {
    document.getElementById("panelPoiDetail").style.visibility = "hidden";

    if (World.currentMarker != null) {
      World.currentMarker.setDeselected(World.currentMarker);
      World.currentMarker = null;
    }
  },
  onScreenClick: function onScreenClickFn() {
    World.closePanel();
  },

  getMaxDistance: function getMaxDistanceFn() {
    World.markerList.sort(World.sortByDistanceSortingDescending);
    var maxDistanceMeters = World.markerList[0].distanceToUser;
    return maxDistanceMeters * 1.1;
  },

  requestDataFromLocal: function requestDataFromLocalFn(
    centerPointLatitude,
    centerPointLongitude
  ) {
    var poiData = [];

    poiData.push({
      id: 1,
      latitude: 37.502824775159816,
      longitude: 127.02779847587531,
      description: "something about coffee",
      altitude: 100.0,
      name: "CAFE",
      distance: "5$",
      imagelink:
        "https://ldb-phinf.pstatic.net/20200410_63/1586525835413cIJAS_JPEG/tgP2t6xLpFwDN_PCxDkLFXzU.jpeg.jpg",
    });

    poiData.push({
      id: 2,
      latitude: 37.5029796720996,
      longitude: 127.028119720582,
      description: "alver coffee",
      altitude: 100.0,
      name: "CAFE",
      distance: "4$",
      imagelink:
        "https://pup-review-phinf.pstatic.net/MjAyMjExMjBfMTk3/MDAxNjY4OTQ0MDY5MTMz.yT57x-H8ZwIHe6fjiggp4XWbjHxz7vNP2RzGA5UPWHMg.YDBAmXwcfYQR3hFkfnsFThSWdVKlxDB6s0PkasIhM7gg.JPEG/20221120_153039.jpg",
    });

    poiData.push({
      id: 3,
      latitude: 37.5034987166465,
      longitude: 127.027843963703,
      description: "macho chef",
      altitude: 100.0,
      name: "RESTAURANT",
      distance: "15$",
      imagelink:
        "https://ldb-phinf.pstatic.net/20181017_295/1539760407307VqTwf_JPEG/WoCvtxZO6LDFGI_2w7jnNwyj.jpg",
    });

    poiData.push({
      id: 4,
      latitude: 37.503116764524,
      longitude: 127.027527157767,
      description: "paulin pancake",
      altitude: 100.0,
      name: "RESTAURANT",
      distance: "13$",
      imagelink:
        "https://ldb-phinf.pstatic.net/20181202_29/15437195517664ojMr_JPEG/q_CIjFmn90u4WKQ90cKEsalX.jpg",
    });

    // poiData.push({
    //   id: 1,
    //   latitude: 37.5039061,
    //   longitude: 127.0254854,
    //   description: "Baek Sojung",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 47.4,
    //   name: "RESTAURANT",
    //   distance: "2$",
    //   imagelink:
    //     "https://ldb-phinf.pstatic.net/20221025_83/1666676850732gtnxA_JPEG/10.jpg",
    // });

    // poiData.push({
    //   id: 2,
    //   latitude: 37.5039952,
    //   longitude: 127.0259106,
    //   description: "Gabaedo",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 48.4,
    //   name: "CAFE",
    //   distance: "15$",
    //   imagelink:
    //     "https://ldb-phinf.pstatic.net/20180902_235/1535886175483NejeH_JPEG/3pFnSjXANIoXk28jj4qUYW5j.jpg",
    // });

    // poiData.push({
    //   id: 3,
    //   latitude: 37.5039048,
    //   longitude: 127.026423,
    //   description: "jongdon",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 45.4,
    //   name: "RESTAURANT",
    //   distance: "15$",
    //   imagelink:
    //     "https://pup-review-phinf.pstatic.net/MjAyMjExMDRfMjE5/MDAxNjY3NTU0Njc2ODkw.Ew1dYZA-THeMVGCvlQ3y27S1MJlvPnYddSHosnAQssUg.8zuayl1ygtcpaMxnHu2VZ7sRzJaV-PZhLpQ91sVJvOsg.JPEG/20221104_174933.jpg",
    // });

    // poiData.push({
    //   id: 4,
    //   latitude: 37.5037544,
    //   longitude: 127.0262044,
    //   description: "mibundang",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 47.4,
    //   name: "RESTAURANT",
    //   distance: "8$",
    //   imagelink:
    //     "https://pup-review-phinf.pstatic.net/MjAyMjEwMjZfMTUw/MDAxNjY2NzQ1ODQ2MTIx.x6aZ4TLC5n-vJSwELvrv89on5J3skcC5NF0_yBk_tfUg.d7m5einHvDsNrakon78sz25Jq0wKZ2nZJMVqGD44hIEg.JPEG/D1033C66-C88C-41BF-A1B4-64E54666002F.jpeg",
    // });

    // poiData.push({
    //   id: 5,
    //   latitude: 37.5035981,
    //   longitude: 127.0259328,
    //   description: "Grilled Casa beef r",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 50.4,
    //   name: "RESTAURANT",
    //   distance: "8$",
    //   imagelink:
    //     "https://ldb-phinf.pstatic.net/20210706_274/1625562793688SfwWj_JPEG/U4RTD0d4QYMco5KkpBHLMdG9.jpg",
    // });

    // poiData.push({
    //   id: 6,
    //   latitude: 37.5034606,
    //   longitude: 127.0259877,
    //   description: "Into the kimbap",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 47.4,
    //   name: "RESTAURANT",
    //   distance: "8$",
    //   imagelink:
    //     "https://pup-review-phinf.pstatic.net/MjAyMjEwMjFfMTU5/MDAxNjY2MzI0OTY2MDE1.LfH3xjfLrQGB6HpBSNLq6y5MIqIuaoseAHyASs0fdFAg.Gx_YyI85PkPR7JVgaPjL34VjOCZkxGCaJ-iKyApnRnUg.JPEG/D39DB36A-4542-4B33-B58D-7BDD531B3451.jpeg",
    // });

    // poiData.push({
    //   id: 7,
    //   latitude: 37.504024,
    //   longitude: 127.0257275,
    //   description: "CU",
    //   /* Use this value to ignore altitude information in general - marker will always be on user-level. */
    //   altitude: 45.4,
    //   name: "MARKET",
    //   distance: "8$",
    //   imagelink:
    //     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/CU_BI_%282017%29.svg/1200px-CU_BI_%282017%29.svg.png",
    // });

    World.loadPoisFromJsonData(poiData);
  },

  sortByDistanceSorting: function sortByDistanceSortingFn(a, b) {
    return a.distanceToUser - b.distanceToUser;
  },

  sortByDistanceSortingDescending: function sortByDistanceSortingDescendingFn(
    a,
    b
  ) {
    return b.distanceToUser - a.distanceToUser;
  },

  onError: function onErrorFn(error) {
    alert(error);
  },
};

AR.context.onLocationChanged = World.locationChanged;
AR.context.onScreenClick = World.onScreenClick;
