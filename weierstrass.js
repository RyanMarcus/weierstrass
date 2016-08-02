// { begin copyright } 
// Copyright Ryan Marcus 2016
// 
// This file is part of weierstrass.
// 
// weierstrass is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// weierstrass is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with weierstrass.  If not, see <http://www.gnu.org/licenses/>.
// 
// { end copyright } 
 
 
 
"use strict";
let bs = require("binarysearch");
let _ = require("lodash");


module.exports.linearInterpolate = linearInterpolate;
function linearInterpolate(points) {
    points.sort((a,b) => a[0] - b[0]);
    
    return function(x) {
        // binary search through points, find the closest value to x
        let leftIdx = bs.closest(points, x, (val, find) => val[0] - find);

        
        if (points[leftIdx][0] == x || leftIdx == points.length - 1)
            return points[leftIdx][1];

        let leftDist = x - points[leftIdx][0];
        let rightDist = points[leftIdx+1][0] - x;
        let totalDist = leftDist + rightDist;

        
        leftDist /= totalDist;
        rightDist /= totalDist;

        leftDist = 1.0 - leftDist;
        rightDist = 1.0 - rightDist;
        
        return leftDist*(points[leftIdx][1]) + rightDist*(points[leftIdx+1][1]);
    };
}

function simpsonsRule(func, a, b) {
    return (b - a)/6 * (func(a) + 4 * func((a + b)/2) + func(b));
}

function verifyPoints(points) {
    if (points.length < 2)
        throw "You must pass at least two points to take a Weierstrass transform";

    for (let x of points) {
        if (!_.isArray(x) || x.length != 2)
            throw ("Each element of the input array must be a list with two items," +
                   "but saw: " + JSON.stringify(x));
    }

    if (Math.abs(0.0 - _.first(points)[1]) > 0.001)
        throw ("The Y coordinate of the point with the minimal X coordinate must be zero.");

    if (Math.abs(0.0 - _.last(points)[1]) > 0.001)
        throw ("The Y coordinate of the point with the maximal X coordinate must be zero.");
}

module.exports.weierstrass = weierstrass;
function weierstrass(points, t=1, step=0.01) {
    points.sort((a,b) => a[0] - b[0]);
    verifyPoints(points);
    
    let linfunc = linearInterpolate(points);
    let minX = points[0][0];
    let maxX = _.last(points)[0];
    
    return function (x) {
        let kernel = (y) => {
            return linfunc(y) * Math.pow(Math.E, -Math.pow((x - y), 2)/(4*t));
        };

        return (1.0/Math.sqrt(4 * Math.PI * t)) *
            _.range(minX, maxX, step)
            .map(v => simpsonsRule(kernel, v, v + step))
            .reduce((accum, curr) => accum + curr);

    };    
}


