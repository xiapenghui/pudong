const mapConfig= {
    ak : "E2WQuWG7zBiKurwocnNPakPYWkHebRnX",
    center : {
        x : 121.506377, 
        y : 31.245105
    },
    zoom : 12,
    minZoom : 10,
    maxZoom : 21,
    style :  [
        {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
                'color': '#021019',
            },
        },
        {
            'featureType': 'highway',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'highway',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#147a92',
            },
        },
        {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'arterial',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#0b3d51',
            },
        },
        {
            'featureType': 'local',
            'elementType': 'geometry',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
                'color': '#08304b',
            },
        },
        {
            'featureType': 'railway',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'railway',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#08304b',
            },
        },
        {
            'featureType': 'subway',
            'elementType': 'geometry',
            'stylers': {
                'lightness': -70,
            },
        },
        {
            'featureType': 'building',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'all',
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#857f7f',
            },
        },
        {
            'featureType': 'all',
            'elementType': 'labels.text.stroke',
            'stylers': {
                'color': '#000000',
            },
        },
        {
            'featureType': 'building',
            'elementType': 'geometry',
            'stylers': {
                'color': '#022338',
            },
        },
        {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
                'color': '#062032',
            },
        },
        {
            'featureType': 'boundary',
            'elementType': 'all',
            'stylers': {
                'color': '#1e1c1c',
            },
        },
        {
            'featureType': 'manmade',
            'elementType': 'geometry',
            'stylers': {
                'color': '#022338',
            },
        },
        {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off',
            },
        },
        {
            'featureType': 'all',
            'elementType': 'labels.icon',
            'stylers': {
                'visibility': 'off',
            },
        },
        {
            'featureType': 'all',
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#2da0c6',
                'visibility': 'on',
            },
        },
    ]
};

export default {
    ak : mapConfig.ak,
    zoom : mapConfig.zoom,
    minZoom : mapConfig.minZoom,
    maxZoom : mapConfig.maxZoom,
    center : mapConfig.center,
    style : mapConfig.style,
	enableMapClick:false
};