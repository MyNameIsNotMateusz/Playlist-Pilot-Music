import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, Form, Button, InputGroup, Row, Col, Badge, Card, Spinner, Alert } from 'react-bootstrap';
import './styles.css';
import { useEffect, useState } from 'react';
import NewReleases from './newReleases/newReleases';
import About from './about/about';

const CLIENT_ID = "337be670400741cc9308edd31aae2db6";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-read-email", "user-read-private", "playlist-modify-public", "playlist-modify-private", "playlist-read-collaborative", "playlist-read-private"]
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const MainApp = () => {


    const [login, setLogin] = useState(() => {
        let link = window.location.href;
        if (link.length > 30) {
            return true;
        } else {
            return false;
        }
    });
    const [inputSong, setInputSong] = useState("");
    const [songList, setSongList] = useState([]);
    const [playlist, setPlaylist] = useState([]);

    //Obtains an access token to perform the rest of the operations.
    const [accessToken, setAccessToken] = useState("");

    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    }

    useState(() => {

        let link = window.location.href;

        if (link.length > 30) {
            const link = window.location.href;
            const searchItem = "&";
            const index = link.indexOf(searchItem);
            const token = link.slice(36, index);
            setAccessToken(token);
        }

    }, []);


    //The entire function searches for songs and displays them
    const searchSong = async () => {

        const songName = inputSong;

        const authParameters = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        try {
            const response = await fetch('https://api.spotify.com/v1/search?q=' + songName + '&type=track', authParameters);
            if (response.ok) {
                const jsonResponse = await response.json();
                setSongList(jsonResponse.tracks.items);
            }
        } catch (error) {
            console.log(error)
        }

        const songInput = document.querySelector(".songInput");
        songInput.value = "";
    }

    //This function is used to add a song to a playlist
    const addToPlaylist = (event) => {
        const indexSong = event.target.id;
        setPlaylist((prev) => {
            return [...prev, songList[indexSong]]
        });
    }

    //This function remove the element from playlist
    const removeItem = (event) => {
        const arrayPlaylist = document.querySelector(".playlistContainer").children;
        const itemToRemove = event.target.id;
        let index;

        for (let i = 0; i < arrayPlaylist.length; i++) {
            if (arrayPlaylist[i].id == itemToRemove) {
                index = i - 1;
            }
        }

        setPlaylist((prev) => {
            return [
                ...prev.filter((item, idx) => {
                    return idx !== index;
                })
            ]
        })

    };

    const createPlaylist = async () => {

        //checking whether we have added a playlist name
        const playlistName = document.querySelector(".inputName");
        const alert = document.querySelector(".alertContainer");

        if (!playlistName.value) {
            alert.style.display = "block"
        } else {
            alert.style.display = "none"

            //This code it will be for get the user's id.
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                    },
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    var userID = jsonResponse["id"];
                } else {
                    console.error("Błąd podczas pobierania informacji o użytkowniku:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Wystąpił błąd:", error);
            }

            //create the playlist
            const name = playlistName.value;

            try {
                const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'name': name,
                        'public': true
                    }),
                });


                if (response.ok) {
                    const jsonResponse = response.json();
                }
            } catch (error) {
                console.error("Wystąpił błąd:", error);
            }

            playlistName.value = "";
        };

        //I get the id of the created playlist

        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                var playlistID = await jsonResponse["items"][0]["id"]
                console.log(jsonResponse);
            }
        } catch (error) {
            console.log(error);
        }

        //adds songs to the playlist
        const arraySong = [];

        playlist.map((item) => {
            arraySong.push(item["uri"]);
        });

        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "uris": arraySong,
                    "position": 0,
                }),
            });

            if (response.ok) {
                const jsonResponse = await response.json();
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            {!login
                ?
                <div className="loading">
                    <Button onClick={handleLogin}>Log In To Your Spotify</Button>
                </div>
                :
                <div className="main">
                    <Navbar bg="primary" data-bs-theme="dark" className="nav">
                        <Container>
                            <Navbar.Brand href="#">Playlist Pilot Music</Navbar.Brand>
                            <Nav className="me-auto">
                                <Nav.Link href="#createButton">Create A Playlist
                                </Nav.Link>
                                <Nav.Link href="#newReleases">New Releases</Nav.Link>
                                <Nav.Link href="#about">About Me</Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>
                    <Container className="search">
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter A Song Title"
                                onChange={(event) => {
                                    setInputSong(event.target.value)
                                }}
                                onKeyDown={event => {
                                    if (event.key == "Enter") {
                                        searchSong()
                                    }
                                }}
                                className="songInput"
                            />
                            <Button
                                onClick={() => {
                                    searchSong()
                                }}
                                variant="primary">Search</Button>
                        </InputGroup>
                    </Container>
                    <Container>
                        <Row>
                            <Col md={8}>
                                <Row className="songContainer">
                                    <h2>
                                        Results<Badge bg="secondary">{songList.length}</Badge>
                                    </h2>
                                    {songList.map((item, index) => {
                                        return (
                                            <Card key={item["id"]} style={{ width: '18rem' }}>
                                                <Card.Img variant="top" src={item["album"]["images"][0]["url"]} />
                                                <Card.Body>
                                                    <Card.Title>{item["artists"][0]["name"]}</Card.Title>
                                                    <Card.Text>
                                                        {item["name"]}
                                                    </Card.Text>
                                                    <Button id={index} onClick={addToPlaylist} variant="primary"
                                                    >Add</Button>
                                                </Card.Body>
                                            </Card>
                                        )
                                    })}
                                </Row>
                            </Col>
                            <Col md={4}>
                                <Row className="songContainer playlistContainer">
                                    <h2>
                                        New Playlist<Badge bg="secondary">{playlist.length}</Badge>
                                    </h2>
                                    {playlist.map((item) => {
                                        return (
                                            <Card id={item["id"]} key={item["id"]} style={{ width: '18rem' }}>
                                                <Card.Img variant="top" src={item["album"]["images"][0]["url"]} />
                                                <Card.Body>
                                                    <Card.Title>{item["artists"][0]["name"]}</Card.Title>
                                                    <Card.Text>
                                                        {item["name"]}
                                                    </Card.Text>
                                                    <Button onClick={removeItem} id={item["id"]} variant="primary"
                                                    >Remove</Button>
                                                </Card.Body>
                                            </Card>
                                        )
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="alertContainer">
                        <Alert variant="danger">
                            <Alert.Heading>Oops! You didn't enter the playlist name.</Alert.Heading>
                            <p>
                                Unfortunately, you haven't entered the playlist name, so we can't proceed to the next stage.
                            </p>
                        </Alert>
                    </Container>
                    <Container className="createButton" id="createButton">
                        <div className="d-grid gap-2">
                            <InputGroup size="lg">
                                <Form.Control
                                    className="inputName"
                                    aria-label="Large"
                                    aria-describedby="inputGroup-sizing-sm"
                                    placeholder='Enter A Name For The playlist'
                                />
                            </InputGroup>
                            <Button onClick={createPlaylist} variant="primary" size="lg">
                                Create A Playlist
                            </Button>
                        </div>
                    </Container>
                    <Container id="newReleases">
                        <NewReleases token={accessToken} />
                    </Container>
                    <Container id="about">
                        <About />
                    </Container>
                </div>
            }
        </>
    );
};

export default MainApp;