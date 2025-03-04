export default function Card({children}) {
  return(
    <div className="p-2 m-1 rounded flex w-fit bg-secondary shadow text-black">
      {children}
    </div>
  )
}
