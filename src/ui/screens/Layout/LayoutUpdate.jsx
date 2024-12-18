import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicHeader from "../../components/Header/DynamicHeader";
import StudentForm from "../../components/Forms/StudentForm";
import LocationForm from "../../components/Forms/LocationForm";
import CourseForm from "../../components/Forms/CourseForm";
import InitialStudentData from "../../../utils/InitialStudentData";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import {
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../../../services/apiService";
import { toast } from "react-toastify";
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

function LayoutUpdate() {
  const { id_student } = useParams();
  const [studentData, setStudentData] = useState(InitialStudentData);
  const [emailValid, setEmailValid] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const completeData = await getStudentById(id_student);

        if (completeData.student_birthdate) {
          const date = new Date(completeData.student_birthdate);
          completeData.student_birthdate = date.toISOString().split("T")[0]; // Extrai apenas a parte da data
        }

        completeData.Courses.forEach((course) => {
          if (course.StudentCourse.conclusion_date) {
            course.StudentCourse.conclusion_date = new Date(
              course.StudentCourse.conclusion_date
            )
              .toISOString()
              .split("T")[0];
          }
        });

        setStudentData(completeData);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao carregar os dados do aluno.");
      }
    };
    fetchData();
  }, [id_student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(studentData.student_email)) {
      toast.error("Por favor, insira um e-mail válido antes de enviar.");
      return;
    }

    try {
      await updateStudent(id_student, studentData);

      toast.success("Dados atualizados com sucesso! Retornando para a página inicial.", {
        autoClose: 2000,
        onClose: () => navigate("/"), // Executa o navigate após o toast fechar
      });
    } catch (error) {
      console.error("Erro ao criar dados: ", error);
      toast.error("Erro ao criar os dados");
    }
  };

  const handleDelete = async () => {
    if (!id_student) {
      toast.error("Nenhum aluno encontrado para deletar.");
      return;
    }

    try {
      await deleteStudent(id_student);
      setStudentData(InitialStudentData);

      toast.success("Dados deletados com sucesso! Retornando para a página inicial.", {
        autoClose: 2000,
        onClose: () => navigate("/"), // Executa o navigate após o toast fechar
      });
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
      toast.error("Erro ao deletar os dados!");
    }
    setShowModal(false);
  };

  return (
    <div>
      <DynamicHeader
        showLogo={false}
        backIcon={() => navigate("/")}
        studentName={
          studentData
            ? studentData.student_name + " " + studentData.student_lastname
            : ""
        }
        onDelete={() => setShowModal(true)}
      />
      <StudentForm
        studentData={studentData}
        setStudentData={setStudentData}
        setEmailValid={setEmailValid}
      />
      <LocationForm studentData={studentData} setStudentData={setStudentData} />
      {studentData.Courses.length === 0 ? (
        <CourseForm
          studentData={{
            ...studentData,
            Courses: [
              {
                id_course: "",
                course_name: "",
                StudentCourse: {
                  conclusion_date: "",
                },
              },
            ],
          }}
          setStudentData={setStudentData}
        />
      ) : (
        <CourseForm studentData={studentData} setStudentData={setStudentData} />
      )}
      <div className="d-flex justify-content-center mt-3">
        <CustomButton type="submit" onClick={handleSubmit} className="btn mt-3">
          Salvar
        </CustomButton>
      </div>
      <ConfirmationModal
        show={showModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir os dados do aluno?"
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default LayoutUpdate;
