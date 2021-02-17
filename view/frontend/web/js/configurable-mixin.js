define([
    'jquery',
    'underscore',
    'jquery-ui-modules/widget'
], function ($, _) {
    'use strict';

    return function (widget) {
        $.widget('mage.configurable', widget, {
            // Load jsonConfig through AJAX call instead of in-line
            _create: function () {
                //save _super for the callback
                const originalInit = this._super.bind(this);

                if (!_.isNull(this.options.spConfig)) {
                    originalInit();
                    return;
                }

                var that = this;
                var productData = this._determineProductData();
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
                    that.options.spConfig = data;
                    originalInit();
                });
            },

            // Copied from swatch-renderer.js
            _determineProductData: function () {
                // Check if product is in a list of products.
                var productId,
                    isInProductView = false;

                productId = this.element.parents('.product-item-details')
                    .find('.price-box.price-final_price').attr('data-product-id');

                if (!productId) {
                    // Check individual product.
                    productId = $('[name=product]').val();
                    isInProductView = productId > 0;
                }

                return {
                    productId: productId,
                    isInProductView: isInProductView
                };
            },
        });

        return $.mage.configurable;
    }
});
