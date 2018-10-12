var jQueryLifx = function( token, fast/*, protectRateLimit*/ ){
    if ( typeof jQuery === 'undefined' ) {
        throw 'ERROR: jQueryLifx: jQuery is required';
    } else {
        this.token = token;
        this.fast = !!fast;
        //this.protectRateLimit = typeof protectRateLimit === 'undefined' ? true : !! protectRateLimit;
        this.rateLimit = {};
        this._baseApiUrl = 'https://api.lifx.com/v1/';
    }
};
jQueryLifx.prototype._getLifxRateLimit = function( jqXHR ){
    var result = {};
    
    result.limit = jqXHR.getResponseHeader('x-ratelimit-limit');
    result.remaining = jqXHR.getResponseHeader('x-ratelimit-remaining');
    result.reset = jqXHR.getResponseHeader('x-ratelimit-reset');
    
    return result;
};
/*jQueryLifx.prototype._protectRateLimit = function( rateLimit ){
    var result = false;
    
    if ( this.protectRateLimit ){
        var currentUnixTime = Math.round( ( new Date() ).getTime() / 1000 );

        if ( rateLimit.remaining <= 0 ){
            result = true;
            
            if ( currentUnixTime > ( typeof rateLimit.reset !== 'undefined' ? rateLimit.reset : currentUnixTime ) ) {
                result = false;
            }    
        }
        
        if ( result === true ){
            console.error( 'ERROR: jQueryLifx: No more requests are allowed by the LIFX API' + ( typeof rateLimit.reset !== 'undefined' ? ', try again in ' + ( currentUnixTime - rateLimit.reset ) + ' seconds' : '' ) );
        }
    }
    
    return result;
}*/
jQueryLifx.prototype._makeRequest = function( settings, callback ){
    var that = this;
    
    jQuery.ajax( settings ).done(function( data, textStatus, jqXHR ){
        callback( data, textStatus, jqXHR );
    }).fail(function( jqXHR, textStatus, errorThrown ){
        callback( jqXHR.responseJSON || jqXHR.responseText || undefined, textStatus, jqXHR, errorThrown );
    });
}
jQueryLifx.prototype.listLights = function( selector, callback ){
    selector = selector || 'all';
    
    this._makeRequest( {
        url: this._baseApiUrl + 'lights/' + selector,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + this.token
        }
    }, callback );
}
jQueryLifx.prototype.setState = function( selector, state, callback ){
    selector = selector || 'all';
    
    var that = this;
    
    this._makeRequest( {
        url: this._baseApiUrl + 'lights/' + selector + '/state',
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + this.token
        },
        data: jQuery.extend({ fast: that.fast }, state)
    }, callback );
}
jQueryLifx.prototype.togglePower = function( selector, duration, callback ){
    selector = selector || 'all';
    duration = duration || 1;
    
    this._makeRequest( {
        url: this._baseApiUrl + 'lights/' + selector + '/toggle',
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + this.token
        },
        data: {
            duration: duration
        }
    }, callback );
}
