# jQueryLifx
A jQuery Library wrapping the LIFX REST API. Most of the JS projects I found wrapping the LIFX REST API were NodeJS libraries, which required several dependencies to work in the browser and I needed something quick, so I thought of the ajax functionality in jQuery and _voilà_. 

## Installation

Just download the [jQueryLifx.js](jQueryLifx.js) file from the repository and put the following either inside of the `<head></head>` tag or just before closing the `<body></body>` tag:

```html
<script type="text/javascript" src="jQueryLifx.js"></script>
```

## Usage example

```js
jQuery.noConflict();
jQuery(document).ready(function(){
    var lifx = new jQueryLifx( '<YOUR_LIFX_REST_API_TOKEN_HERE>' );
    
    lifx.listLights( 'all', function( data, textStatus, jqXHR, errorThrown ){
        console.log( 'listLights', jqXHR.status, textStatus, data, errorThrown );
        lifx.setState( 'all', {
            power: 'on',
        }, function( data, textStatus, jqXHR, errorThrown ){
            console.log( 'setState', jqXHR.status, textStatus, data, errorThrown );
            lifx.togglePower( 'all', 1, function( data, textStatus, jqXHR, errorThrown ){
                console.log( 'togglePower', jqXHR.status, textStatus, data, errorThrown );
            } );
        } );
    });
});
```
