import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import api from '../../services/api'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import './style.css'

import logo from '../../assets/logo.svg'

//manualmente informar tipo de variável/array/ objeto

interface Item {
    id: number,
    title: string,
    image_url: string,
}

interface IBGEUFResponse {
    sigla: string,
}

interface IBGECityResponse {
    nome: string,
}

const CreatePoint = () => {
    
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState("0")
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState("0")
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    const history = useHistory()

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
          const UFInitials = response.data.map(uf => uf.sigla) 
          setUfs(UFInitials)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
          const cities = response.data.map(city => city.nome) 
          setCities(cities)
        })
    }, [selectedUf])

    useEffect(() => {

    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
    }

    function handleInputsChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData( { ...formData, [name]:value } )//event.target.value
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id)
        
        if(alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([ ...selectedItems, id])
        }
    
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems
        
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        api.post('points', data)
            .then(response => {
                console.log(response)
                alert('cadastro bem-sucedido!')
            })
            .catch(error => 
                console.log(error)
            )
        history.push('/')
    }

    return (
       <div id="page-create-point">
           <header>
               <img src={logo} alt="Ecoleta"/>
               <Link to="/">
                   <FiArrowLeft />
                   Voltar para home
               </Link>
           </header>
           <form onSubmit={handleSubmit}>
               <h1>Cadastro do <br/> ponto de coleta</h1>

               <fieldset>
                   <legend>
                       <h2>Dados</h2>
                   </legend>

                   <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputsChange}
                            />
                        </div>
                   </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputsChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputsChange}
                            />
                        </div>
                    </div>

               </fieldset>

               <fieldset>
                   <legend>
                       <h2>Endereço</h2>
                       <span>Selecione um endereço do mapa</span>
                   </legend>
                    
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>
                   
                   <div className="field-group">
                       <div className="field">
                           <label htmlFor="uf">Estado (UF)</label>
                           <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}> {uf} </option>
                                ))}
                           </select>
                       </div>
                       <div className="field">
                           <label htmlFor="city">Cidade</label>
                           <select onChange={handleSelectCity} value={selectedCity} name="city" id="city">
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map((city) => (
                                     <option key={city} value={city}>{city}</option>
                                ))}
                           </select>
                       </div>
                   </div>
               </fieldset>

               <fieldset>
                   <legend>
                       <h2>Ítens de coleta</h2>
                       <span>Selecione um ou mais itens abaixo</span>
                   </legend>
                   <ul className="items-grid">
                       {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)} 
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >

                                <img src={item.image_url} alt={item.title}/>
                                <span> {item.title} </span>
                            </li>
                       ))}
                   </ul>
               </fieldset>

               <button type="submit">Cadastrar ponto de coleta</button>
           </form>
       </div>
    )
}

export default CreatePoint