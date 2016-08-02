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
let assert = require("assert");
let ws = require("../weierstrass");

describe("linearInterpolate", function() {
    it("should properly interpolate a simple cone", function() {
        let f = ws.linearInterpolate([[0,0], [4, 8], [8, 0]]);
        assert.equal(f(0), 0);
        assert.equal(f(2), 4);
        assert.equal(f(4), 8);
        assert.equal(f(6), 4);
        assert.equal(f(8), 0);
    });
});

describe("weierstrass transform", function() {
    it("should match the 1st deriv of a simple cone", function() {
        let f = ws.weierstrass([[0,0], [4, 8], [8, 0]]);
        let values = [0, 2, 4, 6, 8].map(f);
        
        assert(values[0] < values[1]);
        assert(values[1] < values[2]);
        assert(values[2] > values[3]);
        assert(values[3] > values[4]);
    });
});


