export default function Card({children}) {
  return(
    <div className="bg-white/75 rounded-xl shadow p-3 backdrop-filter backdrop-blur-md text-black">
      {children}
    </div>
  )
}
