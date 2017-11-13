!function () {
    var SVGPie3D = {};

    function pieTop(d, rx, ry, ir) {
        if (d.endAngle - d.startAngle == 0) return "M 0 0";
        var sx = rx * Math.cos(d.startAngle),
            sy = ry * Math.sin(d.startAngle),
            ex = rx * Math.cos(d.endAngle),
            ey = ry * Math.sin(d.endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
        ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
        return ret.join(" ");
    }

    function pieOuter(d, rx, ry, h) {
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

        var sx = rx * Math.cos(startAngle),
            sy = ry * Math.sin(startAngle),
            ex = rx * Math.cos(endAngle),
            ey = ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
        return ret.join(" ");
    }

    function pieInner(d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        var sx = ir * rx * Math.cos(startAngle),
            sy = ir * ry * Math.sin(startAngle),
            ex = ir * rx * Math.cos(endAngle),
            ey = ir * ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
        return ret.join(" ");
    }

    function pieSide(d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        var sx = ir * rx * Math.cos(startAngle),
            sx1 = rx * Math.cos(startAngle),
            sy = ir * ry * Math.sin(startAngle),
            sy1 = ry * Math.sin(startAngle),
            ex = ir * rx * Math.cos(endAngle),
            ex1 = rx * Math.cos(endAngle),
            ey = ir * ry * Math.sin(endAngle);
        ey1 = ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, sy, "L", sx, sy + h, "L", sx1, sy1 + h, "L", sx1, sy1, "z");
        ret.push("M", ex, ey, "L", ex, ey + h, "L", ex1, ey1 + h, "L", ex1, ey1, "z");
        return ret.join(" ");
    }

    function getPercent(d, rx) {
        var M = [],
            x = 1.5 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));

        M.push("<tspan class='number' x=" + x + ">" + d.data.label.number + "</tspan>");
        M.push("<tspan class='sub' x=" + x + " dy='10'>" + d.data.label.sub + "</tspan>");
        return M.join("");
    }

    function getOverrideX(d) {
        return typeof d.data.override !== "undefined" && typeof d.data.override.x !== "undefined" ? d.data.override.x : 0;
    }

    function getOverrideY(d) {
        return typeof d.data.override !== "undefined" && typeof d.data.override.y !== "undefined" ? d.data.override.y : 0;
    }

    function isExpanded(d) {
        return typeof d.data.expand !== "undefined" && d.data.expand === true;
    }

    SVGPie3D.transition = function (id, data, rx, ry, h, ir) {
        function arcTweenInner(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir); };
        }
        function arcTweenTop(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return pieTop(i(t), rx, ry, ir); };
        }
        function arcTweenOuter(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return pieOuter(i(t), rx - .5, ry - .5, h); };
        }
        function textTweenX(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle)); };
        }
        function textTweenY(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle)); };
        }

        var _data = d3.layout.pie().sort(null).value(function (d) { return d.value; })(data);

        d3.select("#" + id).selectAll(".innerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenInner);

        d3.select("#" + id).selectAll(".topSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenTop);

        d3.select("#" + id).selectAll(".outerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenOuter);

        d3.select("#" + id).selectAll(".percent").data(_data).transition().duration(750)
            .attrTween("x", textTweenX).attrTween("y", textTweenY).text(getPercent);
    }

    SVGPie3D.draw = function (id, data, x /*center x*/, y/*center y*/,
        rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/) {

        var _data = d3.pie().sort(null).value(function (d) { return d.value; })(data);

        var slices = d3.select("#" + id).append("g").attr("transform", "translate(" + x + "," + y + ")")
            .attr("class", "slices");

        slices.selectAll(".sideSlice").data(_data).enter().append("path")
            .attr("class", function (d) { return isExpanded(d) ? "sideSlice expanded" : "sideSlice"; })
            .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("d", function (d) { return pieSide(d, rx + 0.5, ry + 0.5, h, ir); })
            .each(function (d) { this._current = d; });

        slices.selectAll(".innerSlice").data(_data).enter().append("path")
            .attr("class", function (d) { return isExpanded(d) ? "innerSlice expanded" : "innerSlice"; })
            .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("d", function (d) { return pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
            .each(function (d) { this._current = d; });

        slices.selectAll(".topSlice").data(_data).enter().append("path")
            .attr("class", function (d) { return isExpanded(d) ? "topSlice expanded" : "topSlice"; })
            .style("fill", function (d) { return d.data.color; })
            .style("stroke", function (d) { return d.data.color; })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("d", function (d) { return pieTop(d, rx, ry, ir); })
            .each(function (d) { this._current = d; });



        slices.selectAll(".outerSlice").data(_data).enter().append("path")
            .attr("class", function (d) { return isExpanded(d) ? "outerSlice expanded" : "outerSlice"; })
            .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("d", function (d) { return pieOuter(d, rx - .5, ry - .5, h); })
            .each(function (d) { this._current = d; });

        slices.selectAll(".percent").data(_data).enter().append("text")
            .attr("class", function (d) { return isExpanded(d) ? "sub expanded" : "sub"; })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("x", function (d) { return 1.5 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)) + getOverrideX(d); })
            .attr("y", function (d) { return 1.5 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)) + 20 + getOverrideY(d); })
            .html(function (d) { return d.data.label.sub; }).each(function (d) { this._current = d; });

        slices.selectAll(".percent").data(_data).enter().append("text")
            .attr("class", function (d) { return isExpanded(d) ? "number expanded" : "number"; })
            .style("transform", function (d) { return typeof d.data.expand !== "undefined" && d.data.expand === true ? "translate(-40px,-20px)" : "" })
            .attr("x", function (d) { return 1.5 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)) + getOverrideX(d); })
            .attr("y", function (d) { return 1.5 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)) + getOverrideY(d); })
            .html(function (d) { return d.data.label.number; }).each(function (d) { this._current = d; });
    }

    SVGPie3D.init = function (options) {

        var svg = d3.select(options.el)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            // .attr("width", options.width)
            // .attr("height", options.height)
            .attr('viewBox','0 0 ' + options.width + ' ' + options.height )
            .attr('preserveAspectRatio','xMinYMin')
            //.append("g")
           // .attr("transform", "translate(" + options.width + "," + options.height + ")");;

        svg.append("g").attr("id", options.id);

        SVGPie3D.draw(
            options.id,
            options.data,
            options.chart.centerX,
            options.chart.centerY,
            options.chart.radiusX,
            options.chart.radiusY,
            options.chart.height,
            options.chart.innerRadius
        );
    }

    this.SVGPie3D = SVGPie3D;
}();