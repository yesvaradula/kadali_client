import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import moment from 'moment'
require('dotenv').config()
import logo from '../../../src/assets/images/logop.png'
var converter = require('number-to-words');
import PrintImagesScreen from './PrintImagesScreen'

const ImagePrint = (props) => {
    const [id, setId] = useState(props.match.params.id);
    console.log(props.match.params)
    const iType = props.match.params.type !== undefined ? props.match.params.type : 'invoice'
    const [entity, setEntities] = useState([])
    const [loaded, isLoaded] = useState(false)

    const thisPage = {
        width: '1100px',
        margin: 'auto',
        // marginTop: '200px'
    }
    const logoSize = {
        height: 120,
        width: 350,
    }

    const styles = {
        margin: 'auto'
    }

    const getDetails = async id => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/images/${iType}`)
            .then(response => {
                setEntities(response.data)
            })
    }

    console.log(entity)

    useEffect(async () => {
        await getDetails(id)
        setTimeout(() => {
            window.print()
        }, 3000);
    }, [id])

    return (
        <>
            <div className="printdiv mragin-auto" style={thisPage}>
                <div className="row">
                    {/* <div className="col-3 logo-color"></div> */}
                    <div className="col-6 logo-color" style={styles}>
                        <img src={logo} style={logoSize} />
                    </div>
                    <div className="col-6 logo-color"></div>
                </div>
                <div>
                    {entity.length ? <PrintImagesScreen id={id} records={entity} /> : <></>}
                </div>
            </div>

        </>
    )
}


export default ImagePrint;