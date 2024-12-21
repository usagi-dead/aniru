import React from 'react'
import '../Styles/Message.css'

export default function Message({ text, type, isVisible }) {
    if (!text) return null

    return (
        <p className={`message ${type} ${!isVisible ? 'fade-out' : ''}`}>
            {text}
        </p>
    )
}
