import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchData = async (object, setForm) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/${object}`)
        setForm(response.data.data)
        // console.log(`Working ${object}`, response.data.data)
      } catch (error) {
        console.log("Error while fetching User Data", error)
      }
}

export const fetchDataN = async (object, id) => {
    try {
        const data = await axios.get(`http://localhost:8000/api/${object}/${id}`)
        return data
      } catch(error) {
        console.log("Error",  error)
      }
}

export const createFunc = async (object, formState) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/${object}`, formState);
        console.log(`${object} created successfully.`, response);
        toast.success(response.data.message, { position: "top-right" })
        return response
  
      } catch (error) {
        console.log(`Error creating ${object}:`, error);
      }
}

export const addToTable = async (setForm, newEntry) => {
    setForm((prevData) => [newEntry, ...prevData]);

    setTimeout(() => {
        setForm(prevData => 
            prevData.map(data => 
                data._id === newEntry._id ? { ...data, newData: false } : data
          )
      );
    }, 800);
}

export const updateFunc = async (object, id, formState) => {
    try {
        const response = await axios.put(`http://localhost:8000/api/${object}/${id}`, formState)
        toast.success(response.data.message, { position: "top-right" })
        return response
      } catch(error) {
        console.log("Error", error)
      }
}

export const addAndRemoveToTable = async (setForm, newEntry) => {
    setForm((prevData) => [newEntry, ...prevData]);

    setTimeout(() => {
        setForm(prevData => {
            const updatedEntry = prevData.filter(data => data._id !== newEntry._id);
            return [{ ...newEntry, newData: false }, ...updatedEntry];
        });
    }, 800);
}

export const deleteFunc = async (object, id, setForm) => {
    await axios.delete(`http://localhost:8000/api/${object}/${id}`)
    .then((response) => {
      setForm((prevData) => prevData.filter((data) => data._id !== id));
      toast.success(response.data.message, {position:"top-right"})
    })
    .catch((error) => {
      console.log("Error in User Delete", error)
    })
}