function extractQueryParam(query, param) {
    var params = {};
    query.split("&").forEach(function (kv) {
        kv = kv.split("=");
        params[kv[0]] = kv[1];
    });

    return params[param];
}

function parseMediaLink(url) {
    if (typeof url != "string") {
        return {
            id: null,
            type: null
        };
    }
    url = url.trim();
    url = url.replace("feature=player_embedded&", "");

    if (url.indexOf("rtmp://") == 0) {
        return {
            id: url,
            type: "rt"
        };
    }

    var m;
    if ((m = url.match(/youtube\.com\/watch\?([^#]+)/))) {
        return {
            id: extractQueryParam(m[1], "v"),
            type: "yt"
        };
    }

    if ((m = url.match(/youtu\.be\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "yt"
        };
    }

    if ((m = url.match(/youtube\.com\/playlist\?([^#]+)/))) {
        return {
            id: extractQueryParam(m[1], "list"),
            type: "yp"
        };
    }

    if ((m = url.match(/clips\.twitch\.tv\/([A-Za-z]+)/))) {
        return {
            id: m[1],
            type: "tc"
        };
    }

    // #790
    if ((m = url.match(/twitch\.tv\/(?:.*?)\/clip\/([A-Za-z]+)/))) {
        return {
            id: m[1],
            type: "tc"
        }
    }

    if ((m = url.match(/twitch\.tv\/(?:.*?)\/([cv])\/(\d+)/))) {
        return {
            id: m[1] + m[2],
            type: "tv"
        };
    }

    /**
     * 2017-02-23
     * Twitch changed their URL pattern for recorded videos, apparently.
     * https://github.com/calzoneman/sync/issues/646
     */
    if ((m = url.match(/twitch\.tv\/videos\/(\d+)/))) {
        return {
            id: "v" + m[1],
            type: "tv"
        };
    }

    if ((m = url.match(/twitch\.tv\/([\w-]+)/))) {
        return {
            id: m[1],
            type: "tw"
        };
    }

    if ((m = url.match(/livestream\.com\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "li"
        };
    }

    if ((m = url.match(/ustream\.tv\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "us"
        };
    }

    if ((m = url.match(/(?:hitbox|smashcast)\.tv\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "hb"
        };
    }

    if ((m = url.match(/vimeo\.com\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "vi"
        };
    }

    if ((m = url.match(/dailymotion\.com\/video\/([^\?&#_]+)/))) {
        return {
            id: m[1],
            type: "dm"
        };
    }

    if ((m = url.match(/imgur\.com\/a\/([^\?&#]+)/))) {
        return {
            id: m[1],
            type: "im"
        };
    }

    if ((m = url.match(/soundcloud\.com\/([^\?&#]+)/))) {
        return {
            id: url,
            type: "sc"
        };
    }

    if ((m = url.match(/(?:docs|drive)\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)) ||
        (m = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/))) {
        return {
            id: m[1],
            type: "gd"
        };
    }

    if ((m = url.match(/vid\.me\/embedded\/([\w-]+)/)) ||
        (m = url.match(/vid\.me\/([\w-]+)/))) {
        return {
            id: m[1],
            type: "vm"
        };
    }

    if ((m = url.match(/(.*\.m3u8)/))) {
        return {
            id: url,
            type: "hl"
        };
    }

    if ((m = url.match(/streamable\.com\/([\w-]+)/))) {
        return {
            id: m[1],
            type: "sb"
        };
    }

    if ((m = url.match(/\bmixer\.com\/([\w-]+)/))) {
        return {
            id: m[1],
            type: "mx"
        };
    }

    /*  Shorthand URIs  */
    // So we still trim DailyMotion URLs
    if ((m = url.match(/^dm:([^\?&#_]+)/))) {
        return {
            id: m[1],
            type: "dm"
        };
    }
    // Raw files need to keep the query string
    if ((m = url.match(/^fi:(.*)/))) {
        return {
            id: m[1],
            type: "fi"
        };
    }
    if ((m = url.match(/^cm:(.*)/))) {
        return {
            id: m[1],
            type: "cm"
        };
    }
    // Generic for the rest.
    if ((m = url.match(/^([a-z]{2}):([^\?&#]+)/))) {
        return {
            id: m[2],
            type: m[1]
        };
    }

    /* Raw file */
    var tmp = url.split("?")[0];
    if (tmp.match(/^https?:\/\//)) {
        if (tmp.match(/\.json$/)) {
            // Custom media manifest format
            return {
                id: url,
                type: "cm"
            };
        } else {
            // Assume raw file (server will check)
            return {
                id: url,
                type: "fi"
            };
        }
    }

    throw new Error(
        'Could not determine video type.  Check https://git.io/fjtOK for a list ' +
        'of supported media providers.'
    );
}

/**
 * 指定範囲内の乱数発生
 * 精度に関しては適当
 */
function rand(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function log(msg) {
    console.log(`${new Date().toLocaleString()} - ${msg}`);
}

module.exports = {
    parseMediaLink,
    rand,
    log
};