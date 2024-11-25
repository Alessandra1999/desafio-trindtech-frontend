import axios from "axios";

// Define a URL base
const API_URL = "https://desafio-trindtech-backend-production.up.railway.app";

// Funções para Alunos
export const getStudents = async () => {
  const response = await axios.get(`${API_URL}/api/students`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(`${API_URL}/api/students`, studentData);
  return response.data;
};

export const getStudentById = async (id_student) => {
  const response = await axios.get(`${API_URL}/api/students/${id_student}`);
  return response.data;
};

export const updateStudent = async (id_student, studentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/students/${id_student}`,
      studentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id_student) => {
  await axios.delete(`${API_URL}/api/students/${id_student}`);
};

// Funções para Cursos
export const getCourses = async () => {
  const response = await axios.get(`${API_URL}/api/courses`);
  return response.data;
};

// VIA CEP
export const fetchAddress = async (cep, setStudentData) => {
  // passar pro apiService
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

    if (!data.erro) {
      // Garante que o CEP é válido
      setStudentData((prevData) => ({
        ...prevData,
        Location: {
          ...prevData.Location,
          street: data.logradouro || "",
          district: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        },
      }));
    } else {
      console.error("CEP não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
  }
};
