import React from 'react'

export default function Card({ each }) {
  return (
    <article className='bg-red-300 w-[300px] flex flex-col justify-center items-center p-[5px] m-[10px] rounded-lg'>
        <h3>{each.title}</h3>
        <p>{each.price}USD {each.stock}u</p>
        <button className="p-[5px] my-[5px] bg-white rounded-md" type="button">+info</button>
      </article>
  )
}
