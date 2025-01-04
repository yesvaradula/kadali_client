import React, { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader"
import ScaleLoader from "react-spinners/ScaleLoader"

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = (props) => {
    return (
        <div style={{
            margin: 'auto',
            padding: '10px',
            textAlign: 'center',
            fontWeight: '650'
        }}>
            <ScaleLoader color={props.color} size={160} />
        </div>

        // <ClockLoader color={props.color} size={45} aria-label="Loading..." data-testid="loader" />
        // <BeatLoader
        //     color={props.color}
        //     loading={true}
        //     cssOverride={override}
        //     size={props.size}
        //     aria-label="Loading..."
        //     data-testid="loader"
        // />
    )
}

export default Loader;