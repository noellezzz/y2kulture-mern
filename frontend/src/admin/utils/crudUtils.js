import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchData = async (object) => {
  try {
      const response = await axios.get(`http://localhost:8000/api/${object}`);
      return response.data.data; // Adjust based on your API structure
  } catch (error) {
      console.error(`Error fetching ${object} data`, error);
      throw error; // Propagate the error to handle it in the calling code
  }
};


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

