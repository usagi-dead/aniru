import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const usePageTransition = () => {
    const [isClosing, setIsClosing] = useState(false)
    const [isScrolling, setIsScrolling] = useState(false)
    const navigate = useNavigate()

    const handleSwitch = (url, scroll = false) => {
        setIsClosing(true)

        setTimeout(() => {
            if (scroll) setIsScrolling(true)
        }, 600)

        setTimeout(() => {
            setIsClosing(false)
            setIsScrolling(false)
            navigate(url)
        }, 700)
    }

    useEffect(() => {
        if (isClosing) document.body.classList.add('closing')
        else document.body.classList.remove('closing')
    }, [isClosing])

    useEffect(() => {
        if (isScrolling) document.body.classList.add('scroll')
        else document.body.classList.remove('scroll')
    }, [isScrolling])

    return { handleSwitch, isClosing }
}

export default usePageTransition
