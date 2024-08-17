"use client";

import React, { useState } from 'react';

function Input({ placeholder }) {
    const [inputValue, setInputValue] = useState('');

    return (
        <input
            id="textInput"
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            style={{width:'90%',backgroundColor:'transparent',border:"2px solid gray",padding:'7px'}}
        />
    );
}

export default Input;
