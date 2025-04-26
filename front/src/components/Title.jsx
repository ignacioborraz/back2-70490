export default function Title({ title }) {
  const titleClass = 'text-[20px] md:text-[30px] lg:text-[40px] text-red-500 lg:text-red-900 bg-pink-200 lg:bg-white h-[50px] md:h-[75px] lg:h-[100px] flex justify-center items-center'
  return (
    <h1 className={titleClass}>{title}</h1>
  )
}
