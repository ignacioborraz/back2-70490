import axios from 'axios'
import Title from './components/Title'
import { useEffect, useRef, useState } from 'react'
import Card from './components/Card'

function App() {

  const [products, setProducts] =useState([])
  const email = useRef("")
  const password = useRef("")
  const fetchApi = async()=> {
    const url = 'http://localhost:8080/api/products'
    const response = await axios(url)
    //console.log(response.data.response);
    setProducts(response.data.response)
  }
  const login = async()=> {
    try {
          //console.log({ email, password })
          const data = { email: email.current?.value, password: password.current?.value}
          const url = 'http://localhost:8080/api/auth/login'
          const response = await axios.post(url, data)
          console.log(response);
          alert(response.data.message)
    } catch (error) {
      console.log(error);
      alert(error.response.data.error)
    }
  }
  useEffect(()=>{ fetchApi()},[])

  return (<>
    <Title title="HOME" />
    <section className='flex flex-wrap justify-evenly'>
      {products.map(each=> <Card key={each._id} each={each} />)}
    </section>
    <Title title="LOG IN" />
    <section className='flex flex-col justify-center items-center'>
      <input ref={email} className='bg-red-300 w-[300px] text-center p-[5px] m-[5px] rounded-lg' type="email" name="email" id="email" placeholder='EMAIL' />
      <input ref={password} className='bg-red-300 w-[300px] text-center p-[5px] m-[5px] rounded-lg' type="password" name="password" id="password" placeholder='PASSWORD' />
      <input className='bg-red-300 w-[300px] text-center p-[5px] m-[5px] rounded-lg' type="button" value="Log in!" onClick={login} />
    </section>
  </>)
}

export default App
