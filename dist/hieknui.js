/**
     * @author: 
     *    jiangrun002
     * @version: 
     *    v0.1.0
     * @license:
     *    Copyright 2017, hiknowledge. All rights reserved.
     */

var huConfig = {
    namespace: 'hu-'
};

var huBackTop = (function () {
    function huBackTop() {
        this.attrName = '';
        this.cls = '';
        this.clsName = '';
        this.namespace = '';
        this.namespace = huConfig.namespace;
        this.attrName = this.namespace + 'data-pos';
        this.clsName = this.namespace + 'backtop';
        this.cls = '.' + this.clsName;
        this.init();
    }
    huBackTop.prototype.init = function () {
        var _this = this;
        $(window).scroll(function (event) {
            var height = document.body.scrollTop || document.documentElement.scrollTop;
            $(_this.cls).toggleClass('on', height > 500);
        });
        $('body').on('click', this.cls, function (event) {
            var pos = $(event.currentTarget).attr(_this.attrName) || 0;
            $("html,body").animate({ scrollTop: pos }, 300);
        });
    };
    return huBackTop;
}());

var huDropdown = (function () {
    function huDropdown() {
        this.attrName = '';
        this.cls = '';
        this.clsName = '';
        this.itemsCls = '';
        this.namespace = '';
        this.valueName = '';
        this.namespace = huConfig.namespace;
        this.clsName = this.namespace + 'dropdown';
        this.cls = '.' + this.clsName;
        this.attrName = this.namespace + 'data-id';
        this.valueName = this.namespace + 'data-value';
        this.itemsCls = '.' + this.namespace + 'dropdown-items';
        this.init();
    }
    huDropdown.prototype.init = function () {
        var _this = this;
        $('body').on('click', this.cls + '>span', function (event) {
            var $item = $(event.currentTarget);
            var id = $item.attr(_this.attrName);
            if (!id) {
                id = _this.namespace + huUtils.randomId();
                $item.attr(_this.attrName, id);
                $item.siblings(_this.itemsCls).attr(_this.attrName, id).appendTo('body');
            }
            var offset = $item.offset();
            var left = offset.left;
            var top = offset.top + $item.outerHeight() + 4;
            $(_this.itemsCls + '[' + _this.attrName + '="' + id + '"]').css({
                top: top,
                left: left,
                width: $item.outerWidth()
            }).toggleClass('on');
        }).on('click', this.itemsCls + '>li', function (event) {
            var $item = $(event.currentTarget);
            $item.addClass('active').siblings('.active').removeClass('active');
        }).on('click', function (event) {
            if (!$(event.target).closest(_this.cls).length) {
                $('.on' + _this.itemsCls).removeClass('on');
            }
        });
    };
    return huDropdown;
}());

$(function () {
    new huTabs();
    new huDropdown();
    new huSelect();
    new huTag();
    new huBackTop();
});

var huPagination = (function () {
    function huPagination(config) {
        this.attrName = '';
        this.cls = '';
        this.clsName = '';
        this.defaultConfig = {
            callback: $.noop,
            current: 1,
            // jumpEnable: false,
            prevNextEnable: false,
            prevNextMultiEnable: false,
            selector: '',
            showNum: 9,
            startEndEnable: true,
            total: 0,
        };
        this.namespace = '';
        this.config = $.extend(true, {}, this.defaultConfig, config);
        if (!this.config.selector) {
            console.error('selector不能为空');
        }
        else {
            this.namespace = huConfig.namespace;
            this.clsName = this.namespace + 'pagination';
            this.attrName = this.namespace + 'page';
            this.cls = '.' + this.clsName;
            this.$container = $(this.config.selector);
            if (this.$container.is('ul')) {
                if (!this.$container.hasClass(this.clsName)) {
                    this.$container.addClass(this.clsName);
                }
            }
            else {
                var container = "<ul class=\"" + this.clsName + "\"></ul>";
                this.$container.html(container);
                this.$container = this.$container.find(this.cls);
            }
            this.init();
        }
    }
    huPagination.prototype.init = function () {
        this.buildHTML();
        this.bindEvent();
    };
    huPagination.prototype.buildHTML = function () {
        var total = this.config.total;
        var all = this.config.showNum;
        var half = (this.config.showNum - 1) / 2;
        var first = 1;
        var last = total;
        var center = Math.floor(this.config.current);
        var cur = center;
        var prevNextEnable = this.config.prevNextEnable;
        var prevNextMultiEnable = this.config.prevNextMultiEnable;
        var startEndEnable = this.config.startEndEnable;
        if (last > all) {
            if (center - half > 1) {
                first = Math.ceil(center - half);
            }
            if (last - center < half) {
                first = last - all + 1;
            }
            else {
                last = first + all - 1;
            }
        }
        var html = '';
        if (this.config.total == 0) {
            html = '';
        }
        else {
            var firstEnable = cur != 1;
            var firstEnableCls = firstEnable ? '' : 'disabled';
            var lastEnable = cur != total;
            var lastEnableCls = lastEnable ? '' : 'disabled';
            startEndEnable && (html += "<li class=\"page-first " + firstEnableCls + "\" " + this.attrName + "=\"1\" title=\"\u9996\u9875\"></li>");
            prevNextMultiEnable && (html += "<li class=\"page-prev-multi " + firstEnableCls + "\" " + this.attrName + "=\"" + ((cur - all) < 1 ? 1 : (cur - all)) + "\" title=\"\u5F80\u524D\u7FFB" + all + "\u9875\"></li>");
            prevNextEnable && (html += "<li class=\"page-prev " + firstEnableCls + "\" " + this.attrName + "=\"" + ((cur - 1) < 1 ? 1 : (cur - 1)) + "\" title=\"\u4E0A\u4E00\u9875\"></li>");
            for (var i = first; i <= last; i++) {
                html += "<li class=\"" + (i == cur ? 'active' : '') + "\" " + this.attrName + "=\"" + i + "\">" + i + "</li>";
            }
            prevNextEnable && (html += "<li class=\"page-next " + lastEnableCls + "\" " + this.attrName + "=\"" + ((cur + 1) > total ? total : (cur + 1)) + "\" title=\"\u4E0B\u4E00\u9875\"></li>");
            prevNextMultiEnable && (html += "<li class=\"page-next-multi " + lastEnableCls + "\" " + this.attrName + "=\"" + ((cur + all) > total ? total : (cur + all)) + "\" title=\"\u5F80\u540E\u7FFB" + all + "\u9875\"></li>");
            startEndEnable && (html += "<li class=\"page-last " + lastEnableCls + "\" " + this.attrName + "=\"" + total + "\" title=\"\u672B\u9875\"></li>");
        }
        this.$container.html(html);
    };
    huPagination.prototype.bindEvent = function () {
        var _this = this;
        this.$container.on('click', 'li:not(.disabled)', { eventData: this.config.data }, function (event) {
            var eventData = event.data.eventData;
            var pageNo = $(event.currentTarget).attr(_this.attrName);
            _this.config.callback(event, pageNo, eventData);
        });
    };
    return huPagination;
}());

var huSelect = (function () {
    function huSelect() {
        this.attrName = '';
        this.cls = '';
        this.clsName = '';
        this.itemsCls = '';
        this.namespace = '';
        this.valueName = '';
        this.namespace = huConfig.namespace;
        this.clsName = this.namespace + 'select';
        this.cls = '.' + this.clsName;
        this.attrName = this.namespace + 'data-id';
        this.valueName = this.namespace + 'data-value';
        this.itemsCls = '.' + this.namespace + 'select-items';
        this.init();
    }
    huSelect.prototype.init = function () {
        var _this = this;
        $('body').on('click', this.cls + '>span', function (event) {
            var $item = $(event.currentTarget);
            var id = $item.attr(_this.attrName);
            if (!id) {
                id = _this.namespace + huUtils.randomId();
                $item.attr(_this.attrName, id);
                $item.siblings(_this.itemsCls).attr(_this.attrName, id).appendTo('body');
            }
            var offset = $item.offset();
            var left = offset.left;
            var top = offset.top + $item.outerHeight() + 4;
            $(_this.itemsCls + '[' + _this.attrName + '="' + id + '"]').css({
                top: top,
                left: left,
                width: $item.outerWidth()
            }).toggleClass('on');
        }).on('click', this.itemsCls + '>li', function (event) {
            var $item = $(event.currentTarget);
            $item.addClass('active').siblings('.active').removeClass('active');
            var id = $item.parent().attr(_this.attrName);
            var value = $item.attr(_this.valueName);
            var text = $item.text();
            $(_this.cls + ' span[' + _this.attrName + '="' + id + '"]').text(text).attr(_this.valueName, value);
        }).on('click', function (event) {
            if (!$(event.target).closest(_this.cls).length) {
                $('.on' + _this.itemsCls).removeClass('on');
            }
        });
    };
    return huSelect;
}());

var huTabs = (function () {
    function huTabs() {
        this.cls = '';
        this.clsName = '';
        this.namespace = '';
        this.namespace = huConfig.namespace;
        this.clsName = this.namespace + 'tabs';
        this.cls = '.' + this.clsName;
        this.init();
    }
    huTabs.prototype.init = function () {
        $('body').on('click', this.cls + '>li', function (event) {
            var $tab = $(event.currentTarget);
            var $tabOld = $tab.siblings('.active');
            var selector = $tab.find('a').attr('href');
            var selectorOld = $tabOld.find('a').attr('href');
            var $page = $(selector);
            var $pageOld = $(selectorOld);
            $tab.addClass('active');
            $page.addClass('active');
            $tabOld.removeClass('active');
            $pageOld.removeClass('active');
        });
    };
    return huTabs;
}());

var huTag = (function () {
    function huTag() {
        this.cls = '';
        this.clsName = '';
        this.namespace = '';
        this.namespace = huConfig.namespace;
        this.clsName = this.namespace + 'tag';
        this.cls = '.' + this.clsName;
        this.init();
    }
    huTag.prototype.init = function () {
        var _this = this;
        $('body').on('click', this.cls + ' .close', function (event) {
            $(event.currentTarget).closest(_this.cls).remove();
        });
    };
    return huTag;
}());

var huUtils = (function () {
    function huUtils() {
    }
    huUtils.randomId = function (prefix, postfix) {
        if (prefix === void 0) { prefix = ''; }
        if (postfix === void 0) { postfix = ''; }
        return prefix + new Date().getTime() + Math.ceil(Math.random() * 1000) + postfix;
    };
    return huUtils;
}());
