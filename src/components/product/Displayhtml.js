import React, { useEffect, useState } from 'react'
const parser = new DOMParser();

const DisplayHtml = (props) => {

    const replaceText = () => {
        let returnText = props.text;
        returnText = returnText.replace(/&quot;/g, '"')
        returnText = returnText.replace(/&apos;/g, '\'')
        return returnText
    }

    return (
        <div>
            {replaceText()}
        </div>
    )
}

export default DisplayHtml