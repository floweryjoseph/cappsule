import './App.css'
import Results from './components/Results'
import { useState } from 'react';
import axios from 'axios';
import { LoaderCircleIcon, Search } from 'lucide-react';


function App() {

  const [searchInput, setSearchInput] = useState("")
  const [error, setError] = useState("")
  const [medicineData, setMedicineData] = useState()
  const [loading, setLoading] = useState(false)

  const fetchData = async (e) => {
    e?.preventDefault()
    setError(false)
    if (searchInput == "") {
      setError("Please enter a medicine name")
      return;
    }
    try {
      setLoading(true)
      const res = await axios.get(`https://backend.cappsule.co.in/api/v1/new_search?q=${searchInput}&pharmacyIds=1,2,3`)
      setMedicineData(res?.data?.data?.saltSuggestions)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      fetchData()
    }
  }

  return (



    <div className='w-full flex flex-col items-center m-16 gap-10'>
      <form onSubmit={(e)=>fetchData(e)} className='w-[900px] h-[50px] flex items-center justify-between border-2 p-5 rounded-[25px] gap-5 shadow-md'>
        <Search className='text-gray-500' />
        <input onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setSearchInput(e.target.value)} className='w-[90%] border-none focus:outline-none' type="text" value={searchInput} placeholder="Type your medicine name here...." />
        <button type='submit' disabled={loading} className={`${loading && "cursor-not-allowed text-blue-800/40"} text-blue-800 font-bold`}>Search</button>
      </form>
      <hr className='w-[900px]  shadow-sm' />
      <p className='text-red-500 text-sm'>{error && "*" + error}</p>
      {medicineData && !loading ? medicineData.map(medicine => <Results key={medicine.id} medicine={medicine} />)
        :
        <h1 className='text-2xl font-bold text-black/50 mt-36'>{loading ? <LoaderCircleIcon className='h-10 w-10 animate-spin' /> : '" Find medicines with amazing discount "'}</h1>
      }


    </div>



  )
}

export default App