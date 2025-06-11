import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/patients/';

export function usePatients(token) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setPatients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [token]);

  return { patients, loading, error };
}

export function useAddPatient(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPatient = async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(API_URL, patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { addPatient, loading, error };
}
