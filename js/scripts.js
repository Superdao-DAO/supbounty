(function () {

    "use strict";

    var chartData = [
        {
            label: {
                number: "3%",
                sub: "Early Bakers"
            },
            color: "#c74641",
            value: "3",
            override: {
                x: -30,
                y: 20
            }
        },
        {
            label: {
                number: "45%",
                sub: "SUP mining reward"
            },
            color: "#866ecc",
            value: "45",
            override: {
                x: -10,
                y: 30
            }
        },
        {
            label: {
                number: "5%",
                sub: "Dapp Partners"
            },
            color: "#f6981a",
            value: "5"
        },
        {
            label: {
                number: "15%",
                sub: "Bounty Pool"
            },
            color: "#fdf818",
            value: "15",
            expand: true
        },
        {
            label: {
                number: "10%",
                sub: "Marketing Budget"
            },
            color: "#d4649f",
            value: "10"
        },
        {
            label: {
                number: "10%",
                sub: "Endowment Fund"
            },
            color: "#5574e9",
            value: "10"
        },
        {
            label: {
                number: "12%",
                sub: "Core Team Allocation"
            },
            color: "#b7c3ff",
            value: "12",
            override: {
                x: -50,
                y: -20
            }
        },
    ];

    var options = {
        el: ".top-chart-area",
        id: "chartDonut",
        width: 1000,
        height: 600,
        responsive: {

        },
        chart: {
            centerX: 450,
            centerY: 300,
            radiusX: 250,
            radiusY: 120,
            height: 30,
            innerRadius: 0.5
        },
        data: chartData
    };

    SVGPie3D.init(options);
           
    if ($('.ourTeamMembers').length) {
        
        $(".ourTeamMembers").owlCarousel({
        loop: true,
        margin: 15,
        nav: false,
        dots: false,
        singleItem: true,
        autoplay: true,
        autoplayTimeout: 1000,
        scrollbarType: "progress",
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    })
    }

})();


jQuery(function () {
    jQuery(".price-updater").syncCryptoCurrency();
});


(function ($) {
    var API_URL = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";

    $.fn.syncCryptoCurrency = function () {

        var $this = $(this),
            base = $this.data("base-price") || 0;

        base = parseFloat(base);

        function lookup() {
            $.getJSON(API_URL, function (data) {
                if (typeof data["USD"] !== "undefined") {
                    var usd = parseFloat(data["USD"]) * base;
                    $this.text(usd.toFixed(2));
                }
            });
        }

        setInterval(lookup, 1000);

        return this;
    };

}(jQuery));


$(document).ready(function() {
      var date = 'Dec 15 2017 09:00:00';
      date = new Date(date);

      $('#bounty_date').text(
        date
        //date.toDateString()
      );

      $('button.generalBtn').tooltipster({
        animation: 'fade',
        theme: 'tooltipster-punk',
        trigger: 'click',
        interactive:true,
      });
  });
