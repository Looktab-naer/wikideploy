


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

        /* Start loading marker assets. */
        World.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
            onError: World.onError
        });

        World.markerDrawableSelected = new AR.ImageResource("assets/marker_select.png", {
            onError: World.onError
        });
        World.markerDrawableDirectionIndicator = new AR.ImageResource("assets/indi.png", {
            onError: World.onError
        });

        /* Loop through POI-information and create an AR.GeoObject (=Marker) per POI. */
        for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
            var singlePoi = {
                "id": poiData[currentPlaceNr].id,
                "latitude": parseFloat(poiData[currentPlaceNr].latitude),
                "longitude": parseFloat(poiData[currentPlaceNr].longitude),
                "altitude": parseFloat(poiData[currentPlaceNr].altitude),
                "title": poiData[currentPlaceNr].name,
                "description": poiData[currentPlaceNr].description,
                "distance": poiData[currentPlaceNr].distance,
                "imagelink": poiData[currentPlaceNr].imagelink
            };

            World.markerList.push(new Marker(singlePoi));
        }

        /* Updates distance information of all placemarks. */
        World.updateDistanceToUserValues();

        World.updateStatusMessage(currentPlaceNr + ' places loaded');
    },

    updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
        }
    },

    locationChanged: function locationChangedFn(lat, lon, alt, acc) {


            if (!World.initiallyLoadedData) {
                World.requestDataFromLocal(lat, lon);
                World.initiallyLoadedData = true;
            }
    },

    onMarkerDeSelected: function onMarkerDeSelectedFn(marker){
        World.closePanel();
    },

    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.closePanel();

        World.currentMarker = marker;
        document.getElementById("poiDetailTitle").innerHTML = marker.poiData.title;
        document.getElementById("poiDetailDescription").innerHTML = marker.poiData.description;

        document.getElementById("poiDetailImage").innerHTML = marker.poiData.imagelink;
        
        // document.getElementById("poiImage").src = "https://source.unsplash.com/random"

        if (undefined === marker.distanceToUser) {
            marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
        }

        var distanceToUserValue = (marker.distanceToUser > 999) ?
            ((marker.distanceToUser / 1000).toFixed(2) + " km") :
            (Math.round(marker.distanceToUser) + " m");

        document.getElementById("poiDetailDistance").innerHTML = distanceToUserValue;

        /* Show panel. */
        document.getElementById("panelPoiDetail").style.visibility = "visible";
    },

    closePanel: function closePanel() {
        /* Hide panel. */
        document.getElementById("panelPoiDetail").style.visibility = "hidden";

        if (World.currentMarker != null) {
            /* Deselect AR-marker when user exits detail screen div. */
            World.currentMarker.setDeselected(World.currentMarker);
            World.currentMarker = null;
        }
    },

    /* Screen was clicked but no geo-object was hit. */
    onScreenClick: function onScreenClickFn() {
        /* You may handle clicks on empty AR space too. */
        World.closePanel();
    },

    /* Returns distance in meters of placemark with maxdistance * 1.1. */
    getMaxDistance: function getMaxDistanceFn() {

        /* Sort places by distance so the first entry is the one with the maximum distance. */
        World.markerList.sort(World.sortByDistanceSortingDescending);

        /* Use distanceToUser to get max-distance. */
        var maxDistanceMeters = World.markerList[0].distanceToUser;
        return maxDistanceMeters * 1.1;
    },

    requestDataFromLocal: function requestDataFromLocalFn(centerPointLatitude, centerPointLongitude) {
        var poisToCreate = 5;
        var poiData = [];
        

        
        poiData.push({
            "id": 1,
            "latitude": 37.504041,
            "longitude": 127.025744,
            "description": ("CU Convenience Store"),
            /* Use this value to ignore altitude information in general - marker will always be on user-level. */
            "altitude": AR.CONST.UNKNOWN_ALTITUDE,
            "name": ("Life"),
            "distance": ("2$"),
            "imagelink": ("https://ldb-phinf.pstatic.net/20220307_32/1646653305887fngqS_JPEG/KakaoTalk_Photo_2022-03-07-11-34-55_008.jpeg")
        });        
        
        poiData.push({
            "id": 2,
            "latitude": 37.503945,
            "longitude": 127.025543,
            "description": ("Baeksojung Pork Cutlet"),
            /* Use this value to ignore altitude information in general - marker will always be on user-level. */
            "altitude": AR.CONST.UNKNOWN_ALTITUDE,
            "name": ("RESTAURANT"),
            "distance": ("15$"),
            "imagelink": ("https://ldb-phinf.pstatic.net/20220307_32/1646653305887fngqS_JPEG/KakaoTalk_Photo_2022-03-07-11-34-55_008.jpeg")
        });  

        poiData.push({
            "id": 3,
            "latitude": 37.503866,
            "longitude": 127.025821,
            "description": ("Mapo Galmaegi"),
            /* Use this value to ignore altitude information in general - marker will always be on user-level. */
            "altitude": AR.CONST.UNKNOWN_ALTITUDE,
            "name": ("RESTAURANT"),
            "distance": ("15$"),
            "imagelink": ("https://ldb-phinf.pstatic.net/20220307_32/1646653305887fngqS_JPEG/KakaoTalk_Photo_2022-03-07-11-34-55_008.jpeg")
        });

        poiData.push({
            "id": 4,
            "latitude": 37.503531,
            "longitude": 127.025686,
            "description": ("Damso Soondae"),
            /* Use this value to ignore altitude information in general - marker will always be on user-level. */
            "altitude": AR.CONST.UNKNOWN_ALTITUDE,
            "name": ("RESTAURANT"),
            "distance": ("8$"),
            "imagelink": ("https://ldb-phinf.pstatic.net/20220307_32/1646653305887fngqS_JPEG/KakaoTalk_Photo_2022-03-07-11-34-55_008.jpeg")
        });  

        // for (var i = 0; i < poisToCreate; i++) {
        //     var longitude =  (centerPointLongitude + (Math.random() / 5 - 0.1))
        //     var latitude =  (centerPointLatitude + (Math.random() / 5 - 0.1))
        //     poiData.push({
        //         "id": (i + 1),
        //         "longitude": longitude,
        //         "latitude": latitude,
        //         "description": (longitude.toString() + (i + 1)),
        //         /* Use this value to ignore altitude information in general - marker will always be on user-level. */
        //         "altitude": AR.CONST.UNKNOWN_ALTITUDE,
        //         "name": (latitude.toString() + (i + 1))
        //     });
        // }
        World.loadPoisFromJsonData(poiData);
    },

    

    /* Helper to sort places by distance. */
    sortByDistanceSorting: function sortByDistanceSortingFn(a, b) {
        return a.distanceToUser - b.distanceToUser;
    },

    /* Helper to sort places by distance, descending. */
    sortByDistanceSortingDescending: function sortByDistanceSortingDescendingFn(a, b) {
        return b.distanceToUser - a.distanceToUser;
    },

    onError: function onErrorFn(error) {
        alert(error);
    }
};


/* Forward locationChanges to custom function. */
AR.context.onLocationChanged = World.locationChanged;

/* Forward clicks in empty area to World. */
AR.context.onScreenClick = World.onScreenClick;