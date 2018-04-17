"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("utils/utils");
var image_swipe_common_1 = require("./image-swipe-common");
__export(require("./image-swipe-common"));
var ImageSwipe = (function (_super) {
    __extends(ImageSwipe, _super);
    function ImageSwipe() {
        var _this = _super.call(this) || this;
        _this.isScrollingIn = false;
        try {
            _this.isScrollingIn = false;
            _this.scrollView = UIScrollView.new();
            _this._ios = UIView.new();
            _this.pageControl = UIPageControl.new();
            _this._ios.clipsToBounds = true;
            _this.nativeView = _this._ios;
            _this._ios.addSubview(_this.scrollView);
            _this._delegate = UIScrollViewPagedDelegate.initWithOwner(new WeakRef(_this));
            _this._views = [];
            _this.scrollView.pagingEnabled = true;
            _this.scrollView.autoresizingMask = 2 | 16;
        }
        catch (e) {
            console.log(e);
        }
        return _this;
    }
    Object.defineProperty(ImageSwipe.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSwipe.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ImageSwipe.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.scrollView.delegate = this._delegate;
        this.pageControl.pageIndicatorTintColor = UIColor.lightGrayColor;
        this.pageControl.currentPageIndicatorTintColor = UIColor.whiteColor;
        this.pageControl.userInteractionEnabled = false;
        this._ios.addSubview(this.pageControl);
        this.pageControl.hidden = !this.showIndicator;
    };
    ImageSwipe.prototype.onUnloaded = function () {
        this.scrollView.delegate = null;
        this._purgeAllPages();
        _super.prototype.onUnloaded.call(this);
    };
    ImageSwipe.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        if (this.items && this.items.length > 0) {
            this._calcScrollViewContentSize();
            if (!this.isScrollingIn) {
                this.scrollView.setContentOffsetAnimated(CGPointMake(this.pageNumber * utils.layout.toDeviceIndependentPixels(this.getMeasuredWidth()), 0), false);
            }
            for (var loop = Math.max(0, this.pageNumber - 1); loop <= Math.min(this.pageNumber + 1, this.items.length - 1); loop++) {
                this._resizeNativeViews(loop);
                if (this._views[loop]) {
                    this._positionImageView(this._views[loop].imageView);
                }
            }
            this.pageControl.numberOfPages = this.items.length;
            this.pageControl.currentPage = this.pageNumber;
            var ar = this.indicatorOffset.split(",");
            var x = ar[0] ? Number(ar[0]) : 0;
            var y = ar[1] ? Number(ar[1]) : 0;
            var frame = new CGRect();
            frame.size = this.pageControl.sizeForNumberOfPages(this.items.length);
            frame.origin = CGPointMake(CGRectGetWidth(this.ios.bounds) / 2 - frame.size.width / 2 + x, CGRectGetHeight(this.ios.bounds) - frame.size.height + y);
            this.pageControl.frame = frame;
        }
    };
    ImageSwipe.prototype[image_swipe_common_1.allowZoomProperty.setNative] = function (value) {
        for (var _i = 0, _a = this._views; _i < _a.length; _i++) {
            var viewHolder = _a[_i];
            if (viewHolder) {
                this._positionImageView(viewHolder.imageView);
            }
        }
    };
    ImageSwipe.prototype[image_swipe_common_1.itemsProperty.setNative] = function (value) {
        this._purgeAllPages();
        this._calcScrollViewContentSize();
        if (value && value.length > 0) {
            this.pageControl.numberOfPages = value.length;
            this.pageControl.sizeForNumberOfPages(value.length);
            this.pageControl.currentPage = this.pageNumber;
            this._loadPage(this.pageNumber);
        }
        image_swipe_common_1.pageNumberProperty.coerce(this);
    };
    ImageSwipe.prototype[image_swipe_common_1.pageNumberProperty.setNative] = function (value) {
        if (value === null) {
            return;
        }
        var pageWidth = this.scrollView.frame.size.width;
        if (!this.isScrollingIn) {
            this.scrollView.contentOffset = CGPointMake(value * pageWidth, 0);
        }
        for (var loop = 0; loop < value - 1; loop++) {
            this._purgePage(loop);
        }
        this._loadPage(value);
        if (value - 1 >= 0) {
            this._loadPage(value - 1);
        }
        if (value + 1 < this.items.length) {
            this._loadPage(value + 1);
        }
        for (var loop = value + 2; loop < this.items.length; loop++) {
            this._purgePage(loop);
        }
        this.pageControl.currentPage = value;
        this.notify({
            eventName: image_swipe_common_1.ImageSwipeBase.pageChangedEvent,
            object: this,
            page: value
        });
    };
    ImageSwipe.prototype._centerImageView = function (imageView) {
        var boundSize = imageView.superview.bounds.size;
        var contentsFrame = imageView.frame;
        var newPosition = { x: 0, y: 0 };
        if (contentsFrame.size.width < boundSize.width) {
            newPosition.x = (boundSize.width - contentsFrame.size.width) / 2;
        }
        else {
            newPosition.x = 0;
        }
        if (contentsFrame.size.height < boundSize.height) {
            newPosition.y = (boundSize.height - contentsFrame.size.height) / 2;
        }
        else {
            newPosition.y = 0;
        }
        contentsFrame.origin = CGPointMake(newPosition.x, newPosition.y);
        imageView.frame = contentsFrame;
    };
    ImageSwipe.prototype._resizeNativeViews = function (page) {
        if (page < 0 || page >= this.items.length) {
            return;
        }
        if (!this._views[page]) {
            return;
        }
        var frame = this.scrollView.bounds;
        var view = this._views[page].view;
        frame.origin = CGPointMake(frame.size.width * page, 0);
        view.frame = frame;
        for (var loop = 0; loop < view.subviews.count; loop++) {
            var subview = view.subviews.objectAtIndex(loop);
            subview.frame = CGRectMake(0, 0, frame.size.width, frame.size.height);
        }
    };
    ImageSwipe.prototype._loadPage = function (page) {
        var _this = this;
        if (page < 0 || page >= this.items.length) {
            return;
        }
        if (this._views[page]) {
            return;
        }
        var imageUrl = this._getDataItem(page)[this.imageUrlProperty];
        var imageView;
        var activityIndicator;
        var view;
        var zoomScrollView;
        var image;
        view = UIView.alloc().init();
        view.autoresizingMask = 2
            | 16
            | 1
            | 4;
        view.backgroundColor = utils.ios.getter(UIColor, UIColor.blackColor);
        zoomScrollView = UIScrollView.alloc().init();
        zoomScrollView.maximumZoomScale = 1;
        zoomScrollView.autoresizingMask = 2 | 16;
        imageView = UIImageView.alloc().init();
        zoomScrollView.delegate = UIScrollViewZoomDelegateImpl.initWithOwnerAndZoomView(new WeakRef(this), new WeakRef(imageView));
        activityIndicator = UIActivityIndicatorView.alloc().init();
        activityIndicator.autoresizingMask = 2 | 16;
        activityIndicator.hidesWhenStopped = true;
        zoomScrollView.addSubview(imageView);
        view.addSubview(activityIndicator);
        view.addSubview(zoomScrollView);
        this.scrollView.addSubview(view);
        this._views[page] = {
            view: view,
            imageView: imageView,
            zoomDelegate: zoomScrollView.delegate
        };
        this._resizeNativeViews(page);
        activityIndicator.startAnimating();
        image = image_swipe_common_1.ImageSwipeBase._imageCache.get(imageUrl);
        if (image) {
            this._prepareImageView(image, imageView);
            activityIndicator.stopAnimating();
        }
        else {
            image_swipe_common_1.ImageSwipeBase._imageCache.push({
                key: imageUrl,
                url: imageUrl,
                completed: function (imageSource) {
                    _this._prepareImageView(imageSource, imageView);
                    activityIndicator.stopAnimating();
                }
            });
        }
    };
    ImageSwipe.prototype._prepareImageView = function (image, imageView) {
        imageView.image = image;
        imageView.frame = CGRectMake(0, 0, image.size.width, image.size.height);
        this._positionImageView(imageView);
    };
    ImageSwipe.prototype._positionImageView = function (imageView) {
        if (!imageView || !imageView.image) {
            return;
        }
        var zoomScrollView = imageView.superview;
        if (!zoomScrollView
            || zoomScrollView.frame.size.width === 0
            || zoomScrollView.frame.size.height === 0) {
            return;
        }
        var minimumScale = Math.min(zoomScrollView.frame.size.width / imageView.image.size.width, zoomScrollView.frame.size.height / imageView.image.size.height);
        zoomScrollView.contentSize = imageView.frame.size;
        zoomScrollView.minimumZoomScale = minimumScale;
        zoomScrollView.zoomScale = minimumScale;
        zoomScrollView.maximumZoomScale = this.allowZoom ? 1.0 : minimumScale;
        this._centerImageView(imageView);
    };
    ImageSwipe.prototype._purgePage = function (page) {
        if (page < 0 || page >= this.items.length) {
            return;
        }
        var pageView = this._views[page];
        if (pageView) {
            pageView.view.removeFromSuperview();
        }
        this._views[page] = null;
    };
    ImageSwipe.prototype._purgeAllPages = function () {
        if (!this._views) {
            return;
        }
        for (var loop = 0; loop < this.items.length; loop++) {
            this._purgePage(loop);
        }
    };
    ImageSwipe.prototype._calcScrollViewContentSize = function () {
        var width = utils.layout.toDeviceIndependentPixels(this.getMeasuredWidth());
        var height = utils.layout.toDeviceIndependentPixels(this.getMeasuredHeight());
        this.scrollView.contentSize = CGSizeMake(this.items.length * width, height);
    };
    return ImageSwipe;
}(image_swipe_common_1.ImageSwipeBase));
exports.ImageSwipe = ImageSwipe;
var UIScrollViewPagedDelegate = (function (_super) {
    __extends(UIScrollViewPagedDelegate, _super);
    function UIScrollViewPagedDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIScrollViewPagedDelegate_1 = UIScrollViewPagedDelegate;
    UIScrollViewPagedDelegate.initWithOwner = function (owner) {
        var delegate = UIScrollViewPagedDelegate_1.new();
        delegate._owner = owner;
        return delegate;
    };
    UIScrollViewPagedDelegate.prototype.scrollViewDidScroll = function (scrollView) {
        this._owner.get().isScrollingIn = true;
    };
    UIScrollViewPagedDelegate.prototype.scrollViewDidEndDecelerating = function (scrollView) {
        var pageWidth = scrollView.frame.size.width;
        var owner = this._owner.get();
        owner.isScrollingIn = false;
        owner.pageNumber = Math.floor(Math.abs(scrollView.contentOffset.x) / pageWidth);
    };
    UIScrollViewPagedDelegate = UIScrollViewPagedDelegate_1 = __decorate([
        ObjCClass(UIScrollViewDelegate)
    ], UIScrollViewPagedDelegate);
    return UIScrollViewPagedDelegate;
    var UIScrollViewPagedDelegate_1;
}(NSObject));
var UIScrollViewZoomDelegateImpl = (function (_super) {
    __extends(UIScrollViewZoomDelegateImpl, _super);
    function UIScrollViewZoomDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIScrollViewZoomDelegateImpl_1 = UIScrollViewZoomDelegateImpl;
    UIScrollViewZoomDelegateImpl.initWithOwnerAndZoomView = function (owner, zoomView) {
        var delegate = UIScrollViewZoomDelegateImpl_1.new();
        delegate._zoomView = zoomView;
        delegate._owner = owner;
        return delegate;
    };
    UIScrollViewZoomDelegateImpl.prototype.viewForZoomingInScrollView = function (scrollView) {
        return this._zoomView.get();
    };
    UIScrollViewZoomDelegateImpl.prototype.scrollViewDidZoom = function (scrollView) {
        this._owner.get()._centerImageView(this._zoomView.get());
    };
    UIScrollViewZoomDelegateImpl = UIScrollViewZoomDelegateImpl_1 = __decorate([
        ObjCClass(UIScrollViewDelegate)
    ], UIScrollViewZoomDelegateImpl);
    return UIScrollViewZoomDelegateImpl;
    var UIScrollViewZoomDelegateImpl_1;
}(NSObject));
