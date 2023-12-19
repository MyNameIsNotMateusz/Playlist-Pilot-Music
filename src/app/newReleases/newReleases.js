import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { useEffect, useState, useRef } from "react";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

const NewReleases = () => {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [position, setPosition] = useState([21, 52.25]);
    const [zoom] = useState(10);
    maptilersdk.config.apiKey = '0P0eWz8KlgWupzQkmazQ';

    const [countries, setCountries] = useState();

    useEffect(() => {
        if (map.current) {
            map.current.flyTo({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS.DARK,
                center: [position[0], position[1]],
                zoom: zoom
            });
        } else {
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS.DARK,
                center: [position[0], position[1]],
                zoom: zoom
            });
        }
    }, []);

    useEffect(() => {

        const getCountries = async () => {

            try {
                const response = await fetch('https://restcountries.com/v3.1/all');

                if (response.ok) {
                    const jsonResponse = await response.json();
                    const countriesArray = [];
                    jsonResponse.map((item) => {
                        const countryObject = {
                            code: item["altSpellings"][0],
                            name: item["name"]["common"],
                            capitalLatLang: item["capitalInfo"]
                            ["latlng"],
                            countryLatLang: item["latlng"],
                            trafficDirection: item["car"]["side"]
                        };
                        countriesArray.push(countryObject);
                    })
                    setCountries(countriesArray);
                }
            } catch (error) {
                console.log(error);
            }

        };

        getCountries();

    }, [])

    const changePosition = async (event) => {
        
        const code = event.target.id;

        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);

            if (response.ok) {
                const jsonResponse = await response.json();
                const capitalLatLang = await jsonResponse[0]["capitalInfo"]["latlng"];
                const countryLatLang = await jsonResponse[0]["latlng"]

                if (capitalLatLang == undefined) {
                    setPosition([countryLatLang[1], countryLatLang[0]]);
                } else {
                    setPosition([capitalLatLang[1], capitalLatLang[0]])
                }
            }
        } catch(error) {
            console.log(error);
        }

    };

    return (
        <>
            <Container className="main">
                <h2 className="header">
                    New Releases
                </h2>
                <Container className="releasesContainer">
                    <Container className="mapContainer">
                        <div className="mapwrap">
                            <div ref={mapContainer} className="map" />
                        </div>
                    </Container>
                    <Container className="countryContainer">
                        <Container>
                            <ListGroup as="ol" numbered className="countryGroup">
                                {
                                    countries != null && countries.map((item) => (
                                        <ListGroup.Item
                                            as="li"
                                            className="d-flex justify-content-between align-items-start groupItem"
                                            id={item["code"]}
                                            onClick={changePosition}
                                        >
                                            <div className="ms-2 me-auto"
                                            id={item["code"]}
                                            >
                                                <div className="fw-bold"
                                                id={item["code"]}
                                                >{item["name"]}</div>
                                                Traffic Direction: {item["trafficDirection"]}
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                }

                            </ListGroup>
                        </Container>
                    </Container>
                </Container>
            </Container>
            <Container>
                <Button onClick={() => {
                    console.log(countries)
                }}>TEST</Button>
            </Container>
        </>
    );
};

export default NewReleases;