var changeAnimationDuration = 500;
var resizeAnimationDuration = 1000;

function Marker(poiData) {
  this.poiData = poiData;
  this.isSelected = false;
  this.animationGroupIdle = null;
  this.animationGroupSelected = null;

  var markerLocation = new AR.GeoLocation(
    poiData.latitude,
    poiData.longitude,
    poiData.altitude
  );

  this.markerDrawableIdle = new AR.ImageDrawable(
    World.markerDrawableIdle,
    2.0,
    {
      zOrder: 0,
      scale: {
        x: 1,
        y: 1,
      },
      onClick: Marker.prototype.getOnClickTrigger(this),
    }
  );

  this.markerDrawableSelected = new AR.ImageDrawable(
    World.markerDrawableSelected,
    2.0,
    {
      zOrder: 0,
      opacity: 0.0,
      onClick: Marker.prototype.getOnClickTrigger(this),
    }
  );

  this.titleLabel = new AR.Label(poiData.title.trunc(12), 1, {
    zOrder: 1,
    translate: {
      x: -1.1,
      y: 0.4,
    },
    scale: {
      x: 0.4,
      y: 0.4,
    },
    style: {
      textColor: "#cccccc",
    },
  });

  this.descriptionLabel = new AR.Label(poiData.description.trunc(10), 1, {
    zOrder: 1,
    translate: {
      x: -0.8,
      y: -0.45,
    },
    scale: {
      x: 0.6,
      y: 0.6,
    },
    style: {
      textColor: "#ffffff",
    },
  });

  this.distanceLabel = new AR.Label(poiData.distance.trunc(10), 1, {
    zOrder: 1,
    translate: {
      x: 1.6,
      y: -0.45,
    },
    scale: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      textColor: "#cccccc",
    },
  });

  this.directionIndicatorDrawable = new AR.ImageDrawable(
    World.markerDrawableDirectionIndicator,
    0.1,
    {
      enabled: false,
      verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,
    }
  );

  this.markerObject = new AR.GeoObject(markerLocation, {
    drawables: {
      cam: [
        this.markerDrawableIdle,
        this.markerDrawableSelected,
        this.titleLabel,
        this.descriptionLabel,
        this.distanceLabel,
      ],
      indicator: this.directionIndicatorDrawable,
    },
  });

  return this;
}

Marker.prototype.getOnClickTrigger = function (marker) {

  return function () {
    if (!Marker.prototype.isAnyAnimationRunning(marker)) {
      if (marker.isSelected) {
        Marker.prototype.setDeselected(marker);
        try {
          World.onMarkerDeSelected(marker);
        } catch (err) {
          alert(err);
        }
      } else {
        Marker.prototype.setSelected(marker);
        try {
          World.onMarkerSelected(marker);
        } catch (err) {
          alert(err);
        }
      }
    } else {
      AR.logger.debug("a animation is already running");
    }

    return true;
  };
};

Marker.prototype.setSelected = function (marker) {
  marker.isSelected = true;

  if (marker.animationGroupSelected === null) {
    var easingCurve = new AR.EasingCurve(
      AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC,
      {
        amplitude: 2.0,
      }
    );

    var idleDrawableResizeAnimationX = new AR.PropertyAnimation(
      marker.markerDrawableIdle,
      "scale.x",
      null,
      0.0,
      changeAnimationDuration
    );

    var idleDrawableResizeAnimationY = new AR.PropertyAnimation(
      marker.markerDrawableIdle,
      "scale.y",
      null,
      0.0,
      changeAnimationDuration
    );

    var showSelectedDrawableAnimation = new AR.PropertyAnimation(
      marker.markerDrawableSelected,
      "opacity",
      null,
      1.0,
      changeAnimationDuration
    );

    marker.animationGroupSelected = new AR.AnimationGroup(
      AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
      [
        showSelectedDrawableAnimation,
        idleDrawableResizeAnimationX,
        idleDrawableResizeAnimationY,
      ]
    );
  }

  marker.markerDrawableIdle.onClick = null;
  marker.markerDrawableSelected.onClick =
    Marker.prototype.getOnClickTrigger(marker);
  marker.directionIndicatorDrawable.enabled = true;
  marker.animationGroupSelected.start();
};

Marker.prototype.setDeselected = function (marker) {
  marker.isSelected = false;

  if (marker.animationGroupIdle === null) {
    var easingCurve = new AR.EasingCurve(
      AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC,
      {
        amplitude: 2.0,
      }
    );

    var idleDrawableResizeAnimationX = new AR.PropertyAnimation(
      marker.markerDrawableIdle,
      "scale.x",
      null,
      1.0,
      changeAnimationDuration
    );

    var idleDrawableResizeAnimationY = new AR.PropertyAnimation(
      marker.markerDrawableIdle,
      "scale.y",
      null,
      1.0,
      changeAnimationDuration
    );

    var hideSelectedDrawableAnimation = new AR.PropertyAnimation(
      marker.markerDrawableSelected,
      "opacity",
      null,
      0,
      changeAnimationDuration
    );

    
    marker.animationGroupIdle = new AR.AnimationGroup(
      AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL,
      [
        hideSelectedDrawableAnimation,
        idleDrawableResizeAnimationX,
        idleDrawableResizeAnimationY,
      ]
    );
  }

  marker.markerDrawableIdle.onClick =
    Marker.prototype.getOnClickTrigger(marker);
  marker.markerDrawableSelected.onClick = null;
  marker.directionIndicatorDrawable.enabled = false;
  marker.animationGroupIdle.start();
};

Marker.prototype.isAnyAnimationRunning = function (marker) {
  if (
    marker.animationGroupIdle === null ||
    marker.animationGroupSelected === null
  ) {
    return false;
  } else {
    return (
      marker.animationGroupIdle.isRunning() === true ||
      marker.animationGroupSelected.isRunning() === true
    );
  }
};

String.prototype.trunc = function (n) {
  return this.substr(0, n - 1) + (this.length > n ? "..." : "");
};
