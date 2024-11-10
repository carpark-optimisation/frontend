'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";

import subzone_random from '../data/subzone-random.json';
import subzone_poisson from '../data/subzone-poisson.json';
import subzone_centroids from '../data/subzone-centroids.json';

import { HStack } from "@chakra-ui/react"
import {
    RadioCardItem,
    RadioCardRoot,
    RadioCardLabel
} from "@/components/ui/radio-card"

import { createListCollection } from "@chakra-ui/react"
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select"

import { Heading } from "@chakra-ui/react"

export default function Home() {

    // Map stuff
    const defaultMapOptions = {
        zoomControl: true,
        tilt: 0,
        gestureHandling: 'auto',
        // mapTypeId: 'satellite',
    };
    const defaultMapZoom = 12
    const defaultMapCenter = {
        lat: 1.3464967,
        lng: 103.7996675,

    }
    const defaultMapContainerStyle = {
        width: '100%',
        height: '100vh',
        // borderRadius: '15px 0px 0px 15px',
    };

    const planningAreas = subzone_centroids.map(x => { return { "label": x.name, "value": x.name } })
    const planningAreasCollection = createListCollection({ items: planningAreas })

    const [markers, setMarkers] = useState([])
    const [filter, setFilter] = useState('')
    const [isLoading, setLoading] = useState(true)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    });

    // Handle map geojson layer
    const mapRef = useRef(null);
    const onLoad = (map) => {
        mapRef.current = map;

        // Load the GeoJSON data
        const geoJsonUrl = "https://raw.githubusercontent.com/carpark-optimisation/optimisation-model/refs/heads/main/Master%20Plan%202019%20Subzone%20Boundary%20(No%20Sea)%20(GEOJSON).geojson"
        map.data.loadGeoJson(geoJsonUrl);
        map.data.setStyle({
            fillColor: "blue",
            strokeColor: "blue",
            strokeWeight: 1,
        });

        // Add a click listener to show details
        map.data.addListener("click", (event) => {
            const feature = event.feature;
            console.log(feature)
        });
    };


    useEffect(() => {
        setMarkers(subzone_centroids)
        // // setData([])
        // // setLoading(false)
        // fetch('/api')
        //     .then((res) => res.json())
        //     .then((data) => {
        //         setMarkers(data)
        //         setLoading(false)
        //     })
    }, [])


    const handlePoints = (data) => {
        setMarkers(data)
    }


    const handleFilter = (data) => {
        if (data == "All") {
            setFilter("")
        } else {
            setFilter(data)
        }
    }



    if (isLoading && !isLoaded) return <p>Loading...</p>
    if (markers) {
        const filteredMarkers = markers.filter(v => {
            if (filter == "") {
                return true
            }
            return v.name.includes(filter)
        })
        return (
            <div style={{ "padding": "10px", width: "90%", margin: "0 auto" }}>
                <Heading as="h2">Generation Options:</Heading>
                <br />

                <RadioCardRoot defaultValue="subzoneCentroids">
                    <RadioCardLabel>
                        Point Generation Type
                    </RadioCardLabel>
                    <HStack align="stretch">
                        <RadioCardItem
                            label={"Fixed Single"}
                            description={"Fixed Single Point in the middle of the subzone"}
                            key={"subzoneCentroids"}
                            value={"subzoneCentroids"}
                            onClick={() => handlePoints(subzone_centroids)}
                        />
                        <RadioCardItem
                            label={"Random Points"}
                            description={"Random Points in the subzone"}
                            key={"subzoneRandom"}
                            value={"subzoneRandom"}
                            onClick={() => handlePoints(subzone_random)}
                        />
                        <RadioCardItem
                            label={"Random with Min Distance constraint"}
                            description={"Random Point with each point having distance constraint to another point within subzone"}
                            key={"subzonePoisson"}
                            value={"subzonePoisson"}
                            onClick={() => handlePoints(subzone_poisson)}
                        />
                    </HStack>
                </RadioCardRoot>

                <br />
                <SelectRoot
                    onValueChange={(e) => handleFilter(e.value)}
                    collection={planningAreasCollection}
                    size="sm"
                    width="320px"
                >
                    <SelectLabel>Select Planning Area</SelectLabel>
                    <SelectTrigger>
                        <SelectValueText placeholder="All" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem item={"All"} key={"All"}>
                            {"All"}
                        </SelectItem>
                        {planningAreasCollection.items.map((pa) => (
                            <SelectItem item={pa} key={pa.value}>
                                {pa.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>

                <br />
                <Heading as="h2">Generation Outcome:</Heading>
                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    center={defaultMapCenter}
                    zoom={defaultMapZoom}
                    options={defaultMapOptions}
                    onLoad={onLoad}
                >
                    {
                        filteredMarkers.length > 0 && filteredMarkers.map((x, i) =>
                            <MarkerF
                                position={{ lat: x.latitude, lng: x.longitude }}
                                key={i}
                            />)
                    }
                </GoogleMap>
                <br />
            </div>
        )
    }

}

