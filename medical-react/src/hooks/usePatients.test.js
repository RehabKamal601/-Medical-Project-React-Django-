import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { usePatients, useAddPatient } from './usePatients';

const API_URL = 'http://127.0.0.1:8000/api/patients/';
const token = 'test-token';

describe('usePatients', () => {
  it('fetches patients successfully', async () => {
    const mock = new MockAdapter(axios);
    const patientsData = [{ id: 1, name: 'Test Patient' }];
    mock.onGet(API_URL).reply(200, patientsData);

    const { result, waitForNextUpdate } = renderHook(() => usePatients(token));
    await waitForNextUpdate();
    expect(result.current.patients).toEqual(patientsData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    mock.restore();
  });

  it('handles error', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(API_URL).reply(500);
    const { result, waitForNextUpdate } = renderHook(() => usePatients(token));
    await waitForNextUpdate();
    expect(result.current.error).not.toBe(null);
    mock.restore();
  });
});

describe('useAddPatient', () => {
  it('adds a patient successfully', async () => {
    const mock = new MockAdapter(axios);
    const patientData = { name: 'New Patient' };
    const responseData = { id: 2, ...patientData };
    mock.onPost(API_URL).reply(201, responseData);

    const { result } = renderHook(() => useAddPatient(token));
    let data;
    await act(async () => {
      data = await result.current.addPatient(patientData);
    });
    expect(data).toEqual(responseData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    mock.restore();
  });

  it('handles add patient error', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(API_URL).reply(500);
    const { result } = renderHook(() => useAddPatient(token));
    await act(async () => {
      try {
        await result.current.addPatient({ name: 'Error' });
      } catch (e) {}
    });
    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
    mock.restore();
  });
});
