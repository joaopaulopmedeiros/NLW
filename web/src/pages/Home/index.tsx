import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './style.css'
import logo from '../../assets/logo.svg'

const Home =  () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="logo da Ecoleta"/>
                </header>
                <main>
                    <h1>Sua marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre pontos de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home