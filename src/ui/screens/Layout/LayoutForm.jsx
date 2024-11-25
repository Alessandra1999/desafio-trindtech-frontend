import { useState } from "react";
import DynamicHeader from "../../components/Header/DynamicHeader";
import StudentForm from "../../components/Forms/StudentForm";
import LocationForm from "../../components/Forms/LocationForm";
import CourseForm from "../../components/Forms/CourseForm";
import InitialStudentData from "../../../utils/InitialStudentData";
import { createStudent, deleteStudent } from "../../../services/apiService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

const CustomButton = styled.button`
  background-color: #ea394e;
  color: #f2f2f2;
  font-weight: 700;
  margin-bottom: 30px;

  &:hover {
    background-color: #c7293c;
    color: #f2f2f2;
  }
`;

function LayoutForm() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(InitialStudentData);

  const [studentId, setStudentId] = useState(null);
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(studentData.student_email)) {
      toast.error("Por favor, insira um e-mail válido antes de enviar."); // Mensagem de erro
      return; // Impede o envio se o e-mail for inválido
    }

    // Registrar a data atual no formato ISO
    const currentDate = new Date().toISOString();

    // Atualizar o estado com a data de registro do aluno
    const updatedStudentData = {
      ...studentData,
      student_register_date: currentDate,
    };

    try {
      console.log(
        "Dados do aluno que estão sendo enviados: ",
        updatedStudentData
      );

      const newStudent = {
        ...updatedStudentData,
        courses: updatedStudentData.Courses.map((course) => ({
          ...course,
          conclusion_date: course.StudentCourse.conclusion_date,
        })),
        location: updatedStudentData.Location,
      };

      const student = await createStudent(newStudent);
      setStudentId(student.id_student);

      toast.success("Dados criados com sucesso!");
    } catch (error) {
      console.error("Erro ao criar dados: ", error);
      toast.error("Erro ao criar os dados");
    }
  };

  const handleDelete = async () => {
    if (!studentId) {
      toast.error("Nenhum aluno encontrado para deletar.");
      return;
    }

    try {
      await deleteStudent(studentId);
      setStudentData(InitialStudentData);

      setStudentId(null); // Resetar o ID do aluno
      toast.success("Dados deletados com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
      toast.error("Erro ao deletar os dados!");
    }
  };

  return (
    <div>
      <DynamicHeader
        showLogo={false}
        backIcon={() => navigate("/")}
        studentName=""
        onDelete={handleDelete}
      />
      <StudentForm
        studentData={studentData}
        setStudentData={setStudentData}
        setEmailValid={setEmailValid}
      />
      <LocationForm studentData={studentData} setStudentData={setStudentData} />
      <CourseForm studentData={studentData} setStudentData={setStudentData} />
      <div className="d-flex justify-content-center mt-3">
        <CustomButton type="submit" onClick={handleSubmit} className="btn mt-3">
          Salvar
        </CustomButton>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LayoutForm;
