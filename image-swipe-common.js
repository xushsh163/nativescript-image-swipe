"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var image_cache_1 = require("ui/image-cache");
var scroll_view_1 = require("ui/scroll-view");
__export(require("ui/scroll-view"));
var ImageSwipeBase = (function (_super) {
    __extends(ImageSwipeBase, _super);
    function ImageSwipeBase() {
        var _this = _super.call(this) || this;
        if (!ImageSwipeBase._imageCache) {
            ImageSwipeBase._imageCache = new image_cache_1.Cache();
            ImageSwipeBase._imageCache.maxRequests = 3;
        }
        return _this;
    }
    ImageSwipeBase.prototype._getDataItem = function (index) {
        return this.isItemsSourceIn ? this.items.getItem(index) : this.items[index];
    };
    ImageSwipeBase.pageChangedEvent = "pageChanged";
    return ImageSwipeBase;
}(scroll_view_1.ScrollView));
exports.ImageSwipeBase = ImageSwipeBase;
exports.pageNumberProperty = new view_1.CoercibleProperty({
    name: "pageNumber",
    defaultValue: 0,
    valueConverter: function (v) { return parseInt(v, 10); },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items && items.length !== 0) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = null;
        }
        return value;
    }
});
exports.pageNumberProperty.register(ImageSwipeBase);
exports.itemsProperty = new view_1.Property({
    name: "items",
    valueChanged: function (target, oldValue, newValue) {
        var getItem = newValue && newValue.getItem;
        target.isItemsSourceIn = typeof getItem === "function";
    }
});
exports.itemsProperty.register(ImageSwipeBase);
exports.imageUrlPropertyProperty = new view_1.Property({
    name: "imageUrlProperty",
    defaultValue: ""
});
exports.imageUrlPropertyProperty.register(ImageSwipeBase);
exports.allowZoomProperty = new view_1.Property({
    name: "allowZoom",
    defaultValue: true
});
exports.allowZoomProperty.register(ImageSwipeBase);
exports.showIndicatorProperty = new view_1.Property({
    name: "showIndicator",
    defaultValue: true
});
exports.showIndicatorProperty.register(ImageSwipeBase);
exports.indicatorOffsetProperty = new view_1.Property({
    name: "indicatorOffset",
    defaultValue: ""
});
exports.indicatorOffsetProperty.register(ImageSwipeBase);
exports.indicatorAlignmentProperty = new view_1.Property({
    name: "indicatorAlignment",
    defaultValue: ""
});
exports.indicatorAlignmentProperty.register(ImageSwipeBase);
