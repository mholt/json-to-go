/*
 * JSON-to-GO UI, editon 1.0, 23-JUL-2014
 * contributed by CSSIAN.com
 */
$().ready( function() {
    // Show
    $( '.page' ).fadeIn( 501 );

    // Cache essential selectors
    var tabs = $( '.tab' );
    var regions = {
        json: $( '.json' ),
        golang: $( '.golang' )
    };
    // Cache essential elements
    var convert = $( '#buttonConvert' );
    var golangCode = $( '#golangcode' );
    var goTypeNameIn = $( '#inputGoType' );
    var jsonCode = $( '#jsoncode' );
    var loadDemoJson = $( '#buttonLoadDemo' );
    var loadMoreDemoJson = $( '#buttonLoadDemo2' );
    var reset = $( '#buttonReset' );

    var selectTab = function( tabs, regions, idString ) {
        tabs.removeClass( 'selected' );
        $( idString ).addClass( 'selected' );

        // Handle tab region UI
        if ( idString == "#json" ) {
            showJson( regions )
        } else {
            showGolang( regions )
        };
    };

    var showGolang = function( regions ) {
        regions.json.hide();
        regions.golang.fadeIn( 500 );
    };

    var showJson = function( regions ) {
        regions.golang.hide();
        regions.json.fadeIn( 500 );
    };

    // Arm UI events
    tabs.on( 'click', function( e ) {
        // Handle tab UI
        selectTab( tabs, regions, ( '#' + this.id ) );
    } );

    convert.on( 'click', function( e ) {
        // Convert only when both GoType name and Json source are present,
        // a state that is proxied by the 'convert' class
        var result;
        if ( $( this ).hasClass( 'convert' ) ) {

            // Call translator function
            result = jsonToGo( jsonCode.val(), goTypeNameIn.val() );
            golangCode.val( result.error ? "ERROR: " + result.error : result.go );
            // Show Golang tab
            selectTab( tabs, regions, '#golang' );
        };
    } );

    loadDemoJson.on( 'click', function( e ) {
        // Load some sample JSON from disk.
        $.get( "json/sample.json", function( data ) {
            jsonCode.val( JSON.stringify( data, null, 4 ) );
            selectTab( tabs, regions, '#json' );
        } );
    } );

    loadMoreDemoJson.on( 'click', function( e ) {
        // Load some sample JSON from disk.
        $.get( "json/addresses.json", function( data ) {
            jsonCode.val( JSON.stringify( data, null, 4 ) );
            selectTab( tabs, regions, '#json' );
        } );
    } );

    reset.on( 'click', function( e ) {
        // Start afresh
        goTypeNameIn.val( "" );
        jsonCode.val( "" );
        golangCode.val( "" );
        selectTab( tabs, regions, '#json' );
    } );
} );