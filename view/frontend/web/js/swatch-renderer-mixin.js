define([
    'jquery',
    'underscore',
    'jquery-ui-modules/widget'
], function ($, _) {
    'use strict';

    return function (widget) {
        $.widget('mage.SwatchRenderer', widget, {
            // Load jsonConfig through AJAX call instead of in-line
            _init: function () {
                //save _super for the callback
                const originalInit = this._super.bind(this);

                if (!_.isNull(this.options.jsonConfig)) {
                    originalInit();
                    return;
                }
                let that = this,
                    productData = this._determineProductData();

                $.ajax({
                    url: this.options.baseUrl + 'lcp/fetch/productOptions',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        productId: productData.productId
                    },
                    cache: true
                }).done(function (data) {
                    $('#product-options-spinner').remove();
                    $('#product-options-wrapper > .fieldset').show();
                    that.options.jsonConfig = data;
                    originalInit();

                    // Preselect option if only 1 option exists
                    var selectBoxes = $('select.swatch-select'), updatedSelectBoxes = [];
                    selectBoxes.each(function (index, selectBox) {
                        var $selectBox = $(selectBox);

                        var options = $selectBox.find('option[value!="0"]');
                        if (options.length <= 1) {
                            $selectBox.val(options.first().val());
                            updatedSelectBoxes.push(selectBox);
                        }
                    });

                    $(updatedSelectBoxes).change();

                    // Preselect swatch if only 1 swatch exists
                    const selectSwatch = $('.swatch-option');
                    if(selectSwatch.length === 1) {
                        selectSwatch.trigger("click");
                    }
                });
            },

        });

        return $.mage.SwatchRenderer;
    };
});
