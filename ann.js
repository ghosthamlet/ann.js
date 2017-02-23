var is_arr = function(x) {
        return Array.isArray(x);
    },
    copy = function (src, dst) {
        if (!src) return src;
        dst = dst || [];
        for(var p in src) {
            if(is_arr(src[p])) {
                dst[p] = [];
                copy(src[p], dst[p]);
            }
            else dst[p] = src[p];
        }
        return dst;
    },
    // all x, y will be [[]] or int
    dot = function(x, y) {
        var r = [];
        for(var yj = 0; yj<y[0].length; yj++)
            _w(x.length, x[0].length, function(i, j) {
                if (!r[i]) r[i] = [];
                var y0 = r[i][yj];
                if (!y0) y0 = 0;
                r[i][yj] = y0 + x[i][j] * y[j][yj];
            });
        return r;
    },
    _add = function(x, y) {
        return x + y;
    },
    _sub = function(x, y) {
        return x - y;
    },
    _mul = function(x, y) {
        return x * y;
    },
    _div = function(x, y) {
        return x / y;
    },
    _w = function(x, y, f) {
        for(var i = 0; i < x; i++) {
            for(var j = 0; j < y; j++) {
                f(i, j);
            }
        }
    },
    _v = function(x, y, f) {
        var _x = is_arr(x);
        var _y = is_arr(y);
        // XXX: will inline edit destruct x or y, if x or y is array
        // var r = _x ? x : (_y ? y : null);
        var r = copy(_x ? x : (_y ? y : null));
        var l = _x ? y : x;
        var _l = is_arr(l);
        if (r) {
            _w(r.length, r[0].length, function(i, j) {
                var c = r[i][j], d = _l ? l[i][j] : l, e;
                if (!_x) {
                    e = c;
                    c = d;
                    d = e;
                }
                r[i][j] = f(c, d);
            });
            return r;
        } else return f(x, y);
    },
    _l = function(x, y, f) {
        var r = [];
        _w(x.length, y.length, function(i, j) {
            if (!r[i]) r[i] = [];
            r[i][j] = f(x[i][j]);
        });
        return r;
    },
    T = function(x) {
        var r = [];
        _w(x.length, x[0].length, function(i, j) {
            if (!r[j]) r[j] = [];
            r[j][i] = x[i][j];
        });
        return r;
    },
    add = function(x, y) {
        return _v(x, y, _add);
    },
    sub = function(x, y) {
        return _v(x, y, _sub);
    },
    mul = function(x, y) {
        return _v(x, y, _mul);
    },
    div = function(x, y) {
        return _v(x, y, _div);
    },
    exp = function(x) {
        return is_arr(x) ? _l(x, x[0], Math.exp) : Math.exp(x);
    },
    rnd = function(x, y) {
        var r = [];
        _w(x, y, function(i, j) {
            if (!r[i]) r[i] = [];
            r[i][j] = Math.random();
        });
        return r;
    },
    nonlin = function(x, deriv) {
        if (deriv) return mul(x, sub(1, x));
        return div(1, add(1, exp(sub(0, x))));
    },

    l0 = [[0,0,1],
    [0,1,1],
    [1,0,1],
    [1,1,1]],
    l1,
    y = T([[0,0,1,1]]),
    syn0 = sub(mul(2, rnd(3, 1)), 1),
    i = 0;

    while(i++<10000) {
        l1 = nonlin(dot(l0, syn0));
        var l1_err = sub(y, l1);
        var l1_delta = mul(l1_err, nonlin(l1, true));
        syn0 = add(syn0, dot(T(l0), l1_delta));

        i % 1000 == 0 && console.log(l1);
    }

    console.log(l1);
