import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Song } from "../types"

const SongListing = (props: Song) => {
    const [name, setSongName] = useState(props.name);
    const [path, setPath] = useState(props.path);
    const [id, setId] = useState(props.id);

    // source = odd numbers
    // destination = even numbers

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">ID: {id}</Card.Subtitle>
                {/* <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </Card.Text> */}
                <Button variant="success">Play</Button> {" "}
                <Button variant="danger">Delete</Button> {" "}
                <Button variant="secondary">Swap Directory</Button>
            </Card.Body>
        </Card>
    )
}

export default SongListing;