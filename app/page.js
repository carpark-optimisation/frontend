'use client'

import {
    GoogleMap,
    MarkerF,
    Circle,
    InfoWindow,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";

import { HStack } from "@chakra-ui/react"
import {
    RadioCardItem,
    RadioCardRoot,
    RadioCardLabel
} from "@/components/ui/radio-card"

import { Card } from "@chakra-ui/react"

import { createListCollection } from "@chakra-ui/react"
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select"
import { Input } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { Heading } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"

import subzone_random from '../data/subzone-random.json';
import subzone_poisson from '../data/subzone-poisson.json';
import subzone_centroids from '../data/subzone-centroids.json';

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
    const [markerType, setMarkerType] = useState(0)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [carparks, setCarkparks] = useState([])
    const [filter, setFilter] = useState('')
    const [distance, setDistance] = useState(5)
    const [isLoading, setLoading] = useState(true)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    });

    // Handle map geojson layer
    const mapRef = useRef(null);
    const onLoad = (map) => {
        mapRef.current = map;

        // Load the GeoJSON data
        const geoJsonUrl = "/planning_area.geojson"
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
        // map.data.addListener("mouseover", (event) => {
        //     const feature = event.feature;
        //     console.log(feature)
        // });
    };


    useEffect(() => {
        setMarkers(subzone_centroids)
    }, [])

    useEffect(() => {
        switch (markerType) {
            case 0:
                setMarkers(subzone_centroids)
                break;

            case 1:
                setMarkers(subzone_random)
                break;

            default:
                setMarkers(subzone_poisson)
                break;
        }
    }, [markerType])


    const handlePoints = (data) => {
        setMarkerType(data)
    }



    const handleFilter = (data) => {
        if (data == "All") {
            setFilter("")
        } else {
            setFilter(data)
        }
    }

    const handleDistance = (e) => {
        setDistance(e.target.value)
    }

    const handleGenerateCarkparks = async (e) => {
        // make api call
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ d_max: distance, marker_type: markerType }), // Replace with actual data
        });

        const data = await response.json();
        console.log(data.data);
        if (!data.data) {
            return
        }
        const dataWithDistance = data.data.map((x) => {
            x.distance = distance
            return x
        })
        console.log(dataWithDistance);
        setCarkparks(dataWithDistance)

    }


    if (isLoading && !isLoaded) return <p>Loading...</p>
    if (markers) {
        const filteredMarkers = markers.filter(v => {
            if (filter == "") {
                return true
            }
            return v.name.includes(filter)
        })
        const filteredCarparks = carparks.filter(v => {
            if (filter == "") {
                return true
            }
            return v.planning_area_name.includes(filter)
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
                            onClick={() => handlePoints(0)}
                        />
                        <RadioCardItem
                            label={"Random Points"}
                            description={"Random Points in the subzone"}
                            key={"subzoneRandom"}
                            value={"subzoneRandom"}
                            onClick={() => handlePoints(1)}
                        />
                        <RadioCardItem
                            label={"Poisson Points"}
                            description={"Poisson Points in the subzone"}
                            key={"subzonePoisson"}
                            value={"subzonePoisson"}
                            onClick={() => handlePoints(2)}
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


                <Field label="Distance (d) in km">
                    <Input type="number" defaultValue={5} placeholder="5" onChange={(e) => handleDistance(e)} />
                    <Button onClick={(e) => handleGenerateCarkparks()}>Generate Carkparks</Button>
                </Field>

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
                        filteredCarparks.length > 0 && filteredCarparks.map((x, i) => <Circle
                            center={{ lat: x.latitude, lng: x.longitude }}
                            radius={x.distance * 1000}
                            key={i + "circle"}
                        ></Circle>
                        )
                    }
                    {
                        filteredMarkers.length > 0 && filteredMarkers.map((x, i) =>
                            <MarkerF
                                position={{ lat: x.latitude, lng: x.longitude }}
                                key={i}
                                onClick={() => setSelectedMarker(x)}
                            />)
                    }
                    {selectedMarker && (
                        <InfoWindow
                            position={{
                                lat: selectedMarker.latitude,
                                lng: selectedMarker.longitude,
                            }}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ color: "black" }}>
                                {selectedMarker.name}
                            </div>

                        </InfoWindow>
                    )}
                </GoogleMap>
                <br />
            </div>
        )
    }

}

