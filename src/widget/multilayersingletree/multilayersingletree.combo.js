/**
 * 多层级下拉单选树
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-single-tree-combo",
            isDefaultInit: false,
            height: 24,
            text: "",
            itemsCreator: BI.emptyFn,
            items: [],
            value: "",
            attributes: {
                tabIndex: 0
            },
            allowEdit: false,
            allowSearchValue: false,
            allowInsertValue: false
        });
    },

    render: function () {
        var self = this, o = this.options;

        var combo = (o.itemsCreator === BI.emptyFn) ? this._getSyncConfig() : this._getAsyncConfig();

        return (!o.allowEdit && o.itemsCreator === BI.emptyFn) ? combo : {
            type: "bi.absolute",
            items: [{
                el: combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    cls: "trigger-icon-button",
                    ref: function (_ref) {
                        self.triggerBtn = _ref;
                    },
                    width: o.height,
                    height: o.height,
                    handler: function () {
                        if (self.combo.isViewVisible()) {
                            self.combo.hideView();
                        } else {
                            self.combo.showView();
                        }
                    }
                },
                right: 0,
                bottom: 0,
                top: 0
            }]
        };
    },

    _getBaseConfig: function () {
        var self = this, o = this.options;
        return {
            type: "bi.combo",
            container: o.container,
            destroyWhenHide: o.destroyWhenHide,
            adjustLength: 2,
            ref: function (_ref) {
                self.combo = _ref;
            },
            popup: {
                el: {
                    type: "bi.multilayer_single_tree_popup",
                    isDefaultInit: o.isDefaultInit,
                    itemsCreator: o.itemsCreator,
                    items: o.items,
                    ref: function (_ref) {
                        self.trigger && self.trigger.getSearcher().setAdapter(_ref);
                    },
                    listeners: [{
                        eventName: BI.MultiLayerSingleTreePopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(this.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
                        }
                    }],
                    onLoaded: function () {
                        BI.nextTick(function () {
                            self.combo.adjustWidth();
                            self.combo.adjustHeight();
                        });
                    }
                },
                value: o.value,
                maxHeight: 400,
                minHeight: 240
            }
        };
    },

    _getSearchConfig: function() {
        var self = this, o = this.options;
        return {
            el: {
                type: "bi.multilayer_single_tree_trigger",
                container: o.container,
                allowInsertValue: o.allowInsertValue,
                allowSearchValue: o.allowSearchValue,
                allowEdit: o.allowEdit,
                cls: "multilayer-single-tree-trigger",
                ref: function (_ref) {
                    self.trigger = _ref;
                },
                watermark: o.watermark,
                items: o.items,
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                height: o.height - 2,
                text: o.text,
                value: o.value,
                tipType: o.tipType,
                warningTitle: o.warningTitle,
                title: o.title,
                listeners: [{
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_CHANGE,
                    action: function () {
                        self.setValue(this.getValue());
                        self.combo.hideView();
                        self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
                    }
                }, {
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_FOCUS,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_FOCUS);
                    }
                }, {
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_BLUR,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_BLUR);
                    }
                }, {
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_SEARCHING,
                    action: function () {
                        self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_SEARCHING);
                    }
                }, {
                    eventName: BI.MultiLayerSingleTreeTrigger.EVENT_ADD_ITEM,
                    action: function () {
                        var value = self.trigger.getSearcher().getKeyword();
                        self.combo.setValue([value]);
                        self.combo.hideView();
                    }
                }]
            },
            toggle: !o.allowEdit,
            hideChecker: function (e) {
                // 新增传配置container后对应hideChecker的修改
                // IE11下，popover(position: fixed)下放置下拉控件(position: fixed), 滚动的时候会异常卡顿
                // 通过container参数将popup放置于popover之外解决此问题, 其他下拉控件由于元素少或者有分页，所以
                // 卡顿不明显, 先在此做尝试, 并在FineUI特殊处理待解决文档中标记跟踪
                return (o.container && self.trigger.getSearcher().isSearching() && self.trigger.getSearcher().getView().element.find(e.target).length > 0) ? false : self.triggerBtn.element.find(e.target).length === 0
            },
            listeners: [{
                eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                action: function () {
                    self.trigger.stopEditing();
                }
            }]
        }
    },

    _getSyncConfig: function () {
        var o = this.options;
        var baseConfig = this._getBaseConfig();
        return BI.extend(baseConfig, o.allowEdit ? this._getSearchConfig() : {
            el: {
                type: "bi.single_tree_trigger",
                text: o.text,
                height: o.height,
                items: o.items,
                value: o.value
            }
        });
    },

    _getAsyncConfig: function () {
        var config = this._getBaseConfig();
        return BI.extend(config, this._getSearchConfig());
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});

BI.MultiLayerSingleTreeCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiLayerSingleTreeCombo.EVENT_BLUR = "EVENT_BLUR";
BI.MultiLayerSingleTreeCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiLayerSingleTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);