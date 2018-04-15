"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var gestures_1 = require("ui/gestures");
var grid_layout_1 = require("ui/layouts/grid-layout");
var image_swipe_common_1 = require("./image-swipe-common");
var MODE_NONE = 0;
var MODE_DRAG = 1;
var MODE_ZOOM = 2;
var ALL_GESTURE_TYPES = [
    gestures_1.GestureTypes.doubleTap,
    gestures_1.GestureTypes.longPress,
    gestures_1.GestureTypes.pan,
    gestures_1.GestureTypes.pinch,
    gestures_1.GestureTypes.rotation,
    gestures_1.GestureTypes.swipe,
    gestures_1.GestureTypes.tap,
    gestures_1.GestureTypes.touch
];
__export(require("./image-swipe-common"));
var ImageSwipe = (function (_super) {
    __extends(ImageSwipe, _super);
    function ImageSwipe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageSwipe.prototype.createNativeView = function () {
        var stateViewPager = new StateViewPager(this._context);
        this.pageIndicatorView = new com.rd.PageIndicatorView(this._context);
        this.pagerIndicatorLayoutParams = new org.nativescript.widgets.CommonLayoutParams();
        stateViewPager.setOffscreenPageLimit(1);
        var adapter = new ImageSwipePageAdapter(new WeakRef(this));
        stateViewPager.adapter = adapter;
        stateViewPager.setAdapter(adapter);
        var imageSwipePageListener = new ImageSwipePageChangeListener(new WeakRef(this));
        stateViewPager.imageSwipePageListener = imageSwipePageListener;
        stateViewPager.setOnPageChangeListener(imageSwipePageListener);
        if (this.pageNumber !== null && this.pageNumber !== undefined) {
            stateViewPager.setCurrentItem(this.pageNumber);
        }
        return stateViewPager;
    };
    ImageSwipe.prototype.onLoaded = function () {
        if (this.showIndicator !== false) {
            this.pagerIndicatorLayoutParams.height = android.support.v4.view.ViewPager.LayoutParams.WRAP_CONTENT;
            this.pagerIndicatorLayoutParams.width = android.support.v4.view.ViewPager.LayoutParams.MATCH_PARENT;
            var ar = this.indicatorOffset.split(",");
            var x = ar[0] ? Number(ar[0]) : 0;
            var y = ar[1] ? Number(ar[1]) : 0;
            var defaultVerticalMargin = 50;
            var verticalOffset = defaultVerticalMargin + ((y < 0) ? Math.abs(y) : -Math.abs(y));
            var horizontalOffset = x;
            if (this.indicatorAlignment === "TOP") {
                this.pagerIndicatorLayoutParams.setMargins(horizontalOffset, verticalOffset, 0, 0);
                this.pagerIndicatorLayoutParams.gravity = android.view.Gravity.TOP | android.view.Gravity.CENTER;
            }
            else {
                this.pagerIndicatorLayoutParams.setMargins(horizontalOffset, 0, 0, verticalOffset);
                this.pagerIndicatorLayoutParams.gravity = android.view.Gravity.BOTTOM | android.view.Gravity.CENTER;
            }
            if (this.pageIndicatorView.getParent()) {
                this.parent.android.removeView(this.pageIndicatorView);
            }
            if (this.parent instanceof grid_layout_1.GridLayout) {
                this.parent.android.addView(this.pageIndicatorView, this.pagerIndicatorLayoutParams);
            }
            else {
                this.parent.android.addView(this.pageIndicatorView);
            }
            this.pageIndicatorView.setViewPager(this.nativeView);
            this.pageIndicatorView.setCount(this.items ? this.items.length : 0);
            if (this.pageNumber !== null && this.pageNumber !== undefined) {
                this.pageIndicatorView.setSelection(this.pageNumber);
            }
        }
        _super.prototype.onLoaded.call(this);
    };
    ImageSwipe.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.adapter.owner = new WeakRef(this);
        nativeView.imageSwipePageListener.owner = new WeakRef(this);
    };
    Object.defineProperty(ImageSwipe.prototype, "android", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    ImageSwipe.prototype[image_swipe_common_1.allowZoomProperty.setNative] = function (value) {
        var currentImage = this.nativeView.findViewWithTag("Item" + this.pageNumber);
        if (currentImage) {
            currentImage.reset();
        }
    };
    ImageSwipe.prototype[image_swipe_common_1.pageNumberProperty.setNative] = function (value) {
        this.nativeView.setCurrentItem(value);
        this.pageIndicatorView.setSelection(this.pageNumber);
    };
    ImageSwipe.prototype[image_swipe_common_1.itemsProperty.setNative] = function (value) {
        this.nativeView.getAdapter().notifyDataSetChanged();
        image_swipe_common_1.pageNumberProperty.coerce(this);
        this.pageIndicatorView.setCount(value instanceof Array ? value.length : 0);
        this.pageIndicatorView.setSelection(this.pageNumber ? this.pageNumber : 0);
    };
    return ImageSwipe;
}(image_swipe_common_1.ImageSwipeBase));
exports.ImageSwipe = ImageSwipe;
var ImageSwipePageChangeListener = (function (_super) {
    __extends(ImageSwipePageChangeListener, _super);
    function ImageSwipePageChangeListener(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ImageSwipePageChangeListener.prototype.onPageSelected = function (index) {
        var owner = this.owner.get();
        owner.pageNumber = index;
        owner.notify({
            eventName: ImageSwipe.pageChangedEvent,
            object: owner,
            page: index
        });
        if (!owner.android) {
            return;
        }
        var preloadedImageView;
        preloadedImageView = owner.android.findViewWithTag("Item" + (index - 1).toString());
        if (preloadedImageView) {
            preloadedImageView.reset();
        }
        preloadedImageView = owner.android.findViewWithTag("Item" + (index + 1).toString());
        if (preloadedImageView) {
            preloadedImageView.reset();
        }
    };
    ImageSwipePageChangeListener.prototype.onPageScrolled = function () {
    };
    ImageSwipePageChangeListener.prototype.onPageScrollStateChanged = function () {
    };
    ImageSwipePageChangeListener = __decorate([
        Interfaces([android.support.v4.view.ViewPager.OnPageChangeListener])
    ], ImageSwipePageChangeListener);
    return ImageSwipePageChangeListener;
}(java.lang.Object));
var StateViewPager = (function (_super) {
    __extends(StateViewPager, _super);
    function StateViewPager(context) {
        var _this = _super.call(this, context) || this;
        _this._allowScrollIn = true;
        return __native(_this);
    }
    StateViewPager.prototype.onInterceptTouchEvent = function (event) {
        if (this._allowScrollIn) {
            return _super.prototype.onInterceptTouchEvent.call(this, event);
        }
        return false;
    };
    StateViewPager.prototype.setAllowScrollIn = function (allowScrollIn) {
        this._allowScrollIn = allowScrollIn;
    };
    return StateViewPager;
}(android.support.v4.view.ViewPager));
var ImageSwipePageAdapter = (function (_super) {
    __extends(ImageSwipePageAdapter, _super);
    function ImageSwipePageAdapter(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ImageSwipePageAdapter.prototype.instantiateItem = function (container, position) {
        var owner = this.owner.get();
        var imageUrl = owner._getDataItem(position)[owner.imageUrlProperty];
        var params = new android.support.v4.view.ViewPager.LayoutParams();
        params.height = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
        params.width = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
        var imageView = new ZoomImageView(this.owner);
        imageView.setLayoutParams(params);
        imageView.setTag("Item" + position.toString());
        var that = new WeakRef(owner);
        imageView.setOnCanScrollChangeListener(new OnCanScrollChangeListener({
            onCanScrollChanged: function (canScroll) {
                that.get().android.setAllowScrollIn(canScroll);
            }
        }));
        var progressBar = new android.widget.ProgressBar(owner._context);
        progressBar.setLayoutParams(params);
        progressBar.setVisibility(android.view.View.GONE);
        progressBar.setIndeterminate(true);
        var layout = new android.widget.LinearLayout(owner._context);
        layout.setLayoutParams(params);
        layout.setOrientation(android.widget.LinearLayout.VERTICAL);
        layout.addView(progressBar);
        layout.addView(imageView);
        container.addView(layout);
        progressBar.setVisibility(android.view.View.VISIBLE);
        var image = image_swipe_common_1.ImageSwipeBase._imageCache.get(imageUrl);
        if (image) {
            imageView.setImageBitmap(image);
            progressBar.setVisibility(android.view.View.GONE);
        }
        else {
            image_swipe_common_1.ImageSwipeBase._imageCache.push({
                key: imageUrl,
                url: imageUrl,
                completed: function (bitmap) {
                    imageView.setImageBitmap(bitmap);
                    progressBar.setVisibility(android.view.View.GONE);
                }
            });
        }
        return layout;
    };
    ImageSwipePageAdapter.prototype.destroyItem = function (container, position, object) {
        container.removeView(object);
    };
    ImageSwipePageAdapter.prototype.getCount = function () {
        var owner = this.owner.get();
        return owner && owner.items ? owner.items.length : 0;
    };
    ImageSwipePageAdapter.prototype.isViewFromObject = function (view, object) {
        return view === object;
    };
    return ImageSwipePageAdapter;
}(android.support.v4.view.PagerAdapter));
var ZoomImageView = (function (_super) {
    __extends(ZoomImageView, _super);
    function ZoomImageView(_owner) {
        var _this = _super.call(this, _owner.get()._context) || this;
        _this._owner = _owner;
        _this._scaleFactor = [1];
        _this._minScaleFactor = [1];
        _this._mode = 0;
        _this._dragged = false;
        _this._startX = 0;
        _this._startY = 0;
        _this._translateX = [0];
        _this._translateY = [0];
        _this._totalTranslateX = [0];
        _this._totalTranslateY = [0];
        var context = _owner.get()._context;
        var that = new WeakRef(_this);
        _this._detector = new android.view.ScaleGestureDetector(context, new android.view.ScaleGestureDetector.OnScaleGestureListener({
            onScale: function (detector) {
                var owner = that.get();
                owner.setScaleFactor(owner.getScaleFactor() * detector.getScaleFactor());
                return true;
            },
            onScaleBegin: function () { return true; },
            onScaleEnd: function () { }
        }));
        _this._orientationChangeListener = new OrientationListener(context, that);
        _this._orientationChangeListener.enable();
        return __native(_this);
    }
    ZoomImageView.prototype.setImageBitmap = function (image) {
        this._image = image;
        this.reset();
    };
    ZoomImageView.prototype.onTouchEvent = function (event) {
        var owner = this._owner.get();
        if (owner.allowZoom) {
            switch (event.getActionMasked()) {
                case android.view.MotionEvent.ACTION_DOWN:
                    this._mode = MODE_DRAG;
                    this._startX = event.getX();
                    this._startY = event.getY();
                    break;
                case android.view.MotionEvent.ACTION_MOVE:
                    var scaleFactor = this.getScaleFactor();
                    var translateX = this._startX - event.getX();
                    var translateY = this._startY - event.getY();
                    var totalTranslateX = this.getTotalTranslateX();
                    var totalTranslateY = this.getTotalTranslateY();
                    var height = this.getHeight();
                    var width = this.getWidth();
                    var imageHeight = this._image.getHeight();
                    var imageWidth = this._image.getWidth();
                    var canScroll = false;
                    if (Math.max(0, (width - (imageWidth * scaleFactor)) / 2) !== 0) {
                        translateX = 0;
                        canScroll = true;
                    }
                    else if (totalTranslateX + translateX < 0) {
                        translateX = -totalTranslateX;
                        canScroll = true;
                    }
                    else if (totalTranslateX + translateX + width > imageWidth * scaleFactor) {
                        translateX = (imageWidth * scaleFactor) - width - totalTranslateX;
                        canScroll = true;
                    }
                    if (this._onCanScrollChangeListener) {
                        this._onCanScrollChangeListener.onCanScrollChanged(canScroll);
                    }
                    if (Math.max(0, (height - (imageHeight * scaleFactor)) / 2) !== 0) {
                        translateY = 0;
                    }
                    else if (totalTranslateY + translateY < 0) {
                        translateY = -totalTranslateY;
                    }
                    else if (totalTranslateY + translateY + height > imageHeight * scaleFactor) {
                        translateY = (imageHeight * scaleFactor) - height - totalTranslateY;
                    }
                    if (translateX !== 0 || translateY !== 0) {
                        this._dragged = true;
                    }
                    this.setTranslateX(translateX);
                    this.setTranslateY(translateY);
                    break;
                case android.view.MotionEvent.ACTION_POINTER_DOWN:
                    this._mode = MODE_ZOOM;
                    break;
                case android.view.MotionEvent.ACTION_UP:
                    this._mode = MODE_NONE;
                    this._dragged = false;
                    this.setTotalTranslateX(this.getTotalTranslateX() + this.getTranslateX());
                    this.setTotalTranslateY(this.getTotalTranslateY() + this.getTranslateY());
                    this.setTranslateX(0);
                    this.setTranslateY(0);
                    break;
                case android.view.MotionEvent.ACTION_POINTER_UP:
                    this._mode = MODE_DRAG;
                    this.setTotalTranslateX(this.getTotalTranslateX() + this.getTranslateX());
                    this.setTotalTranslateY(this.getTotalTranslateY() + this.getTranslateY());
                    this.setTranslateX(0);
                    this.setTranslateY(0);
                    break;
            }
            this._detector.onTouchEvent(event);
            if ((this._mode === MODE_DRAG && this._dragged)
                || this._mode === MODE_ZOOM) {
                this.invalidate();
            }
        }
        for (var _i = 0, ALL_GESTURE_TYPES_1 = ALL_GESTURE_TYPES; _i < ALL_GESTURE_TYPES_1.length; _i++) {
            var gestureType = ALL_GESTURE_TYPES_1[_i];
            for (var _a = 0, _b = owner.getGestureObservers(gestureType) || []; _a < _b.length; _a++) {
                var observer = _b[_a];
                observer.androidOnTouchEvent(event);
            }
        }
        return true;
    };
    ZoomImageView.prototype.onDraw = function (canvas) {
        canvas.save();
        var scaleFactor = this.getScaleFactor();
        canvas.scale(scaleFactor, scaleFactor);
        canvas.translate(-(this.getTotalTranslateX() + this.getTranslateX()) / scaleFactor, -(this.getTotalTranslateY() + this.getTranslateY()) / scaleFactor);
        if (this._image) {
            canvas.drawBitmap(this._image, Math.max(0, (this.getWidth() - (this._image.getWidth() * scaleFactor)) / 2) / scaleFactor, Math.max(0, (this.getHeight() - (this._image.getHeight() * scaleFactor)) / 2) / scaleFactor, new android.graphics.Paint());
        }
        canvas.restore();
    };
    ZoomImageView.prototype.setOnCanScrollChangeListener = function (listener) {
        this._onCanScrollChangeListener = listener;
    };
    ZoomImageView.prototype.setMinScaleFactor = function (scaleFactor) {
        this._minScaleFactor[0] = scaleFactor;
    };
    ZoomImageView.prototype.getMinScaleFactor = function () {
        return this._minScaleFactor[0];
    };
    ZoomImageView.prototype.setScaleFactor = function (scaleFactor) {
        this._scaleFactor[0] = Math.max(this.getMinScaleFactor(), scaleFactor);
    };
    ZoomImageView.prototype.getScaleFactor = function () {
        return this._scaleFactor[0];
    };
    ZoomImageView.prototype.setTranslateX = function (translate) {
        this._translateX[0] = translate;
    };
    ZoomImageView.prototype.getTranslateX = function () {
        return this._translateX[0];
    };
    ZoomImageView.prototype.setTranslateY = function (translate) {
        this._translateY[0] = translate;
    };
    ZoomImageView.prototype.getTranslateY = function () {
        return this._translateY[0];
    };
    ZoomImageView.prototype.setTotalTranslateX = function (translate) {
        this._totalTranslateX[0] = translate;
    };
    ZoomImageView.prototype.getTotalTranslateX = function () {
        return this._totalTranslateX[0];
    };
    ZoomImageView.prototype.setTotalTranslateY = function (translate) {
        this._totalTranslateY[0] = translate;
    };
    ZoomImageView.prototype.getTotalTranslateY = function () {
        return this._totalTranslateY[0];
    };
    ZoomImageView.prototype.reset = function (isDelayIn) {
        var _this = this;
        setTimeout(function () {
            if (_this && _this._image) {
                try {
                    _this.setTotalTranslateX(0);
                    _this.setTotalTranslateY(0);
                    _this.setTranslateX(0);
                    _this.setTranslateY(0);
                    _this.setMinScaleFactor(Math.min(_this.getHeight() / _this._image.getHeight(), _this.getWidth() / _this._image.getWidth()));
                    _this.setScaleFactor(_this.getMinScaleFactor());
                    _this.invalidate();
                }
                catch (e) {
                }
            }
        }, (isDelayIn ? 750 : 10));
    };
    return ZoomImageView;
}(android.widget.ImageView));
var OrientationListener = (function (_super) {
    __extends(OrientationListener, _super);
    function OrientationListener(context, zoomImageView) {
        var _this = _super.call(this, context) || this;
        _this._zoomImageView = zoomImageView;
        return __native(_this);
    }
    OrientationListener.prototype.onOrientationChanged = function (orientation) {
        var zoomImageView = this._zoomImageView.get();
        if (zoomImageView) {
            zoomImageView.reset(true);
        }
    };
    return OrientationListener;
}(android.view.OrientationEventListener));
var OnCanScrollChangeListener = (function (_super) {
    __extends(OnCanScrollChangeListener, _super);
    function OnCanScrollChangeListener(implementation) {
        var _this = _super.call(this) || this;
        _this._implementation = implementation;
        return __native(_this);
    }
    OnCanScrollChangeListener.prototype.onCanScrollChanged = function (canScroll) {
        this._implementation.onCanScrollChanged(canScroll);
    };
    return OnCanScrollChangeListener;
}(java.lang.Object));
