import { useState } from "react";
import styled from "styled-components";
import { RiSearchLine } from "react-icons/ri";
import { MdPersonAdd } from "react-icons/md";
import { getStudents } from "../../../services/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  margin-top: 59px;
  width: 1044px;
  height: auto;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
`;

const CustomInput = styled.input`
  background-color: #fff;

  &:focus {
    background-color: #fff;
    outline: none;
    border-color: black;
    box-shadow: none;
  }
`;

const CustomSpan = styled.span`
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: #f2f2f2;
  }
`;

const CustomButton = styled.button`
  background-color: #fff;
  border-color: #e6e6e6;
  font-weight: 600;

  &:hover {
    border-color: #e6e6e6;
    background-color: #f2f2f2;
  }
`;

function Search({ setSearchResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const allStudents = await getStudents();

      const filteredStudents = allStudents
      .filter((student) => {
        const fullName = `${student.student_name} ${student.student_lastname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
        .map((student) => {
          const location = student.Location
            ? student.Location.state
            : "Estado não encontrado";
          const courses =
            student.Courses &&
            Array.isArray(student.Courses) &&
            student.Courses.length > 0
              ? student.Courses.map((course) => course.course_name) // Retorna um array de nomes de cursos
              : ["Nenhum curso associado"];

          return {
            id_student: student.id_student, // ID
            register_date: student.student_register_date, // Data de registro
            firstName: student.student_name, // Nome
            lastName: student.student_lastname, // Sobrenome
            state: location, // Estado
            courses: courses, // Cursos
          };
        });

      setSearchResults(filteredStudents);

      if (filteredStudents.length === 0) {
        toast.error("Nenhum aluno encontrado.");
        console.error("Nenhum aluno encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast.error("Erro ao buscar alunos.");
    }
  };

  const handleAddStudent = () => {
    navigate("/form");
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Container>
        <div className="row align-items-center">
          <div className="col-md-10 d-flex">
            <div className="input-group">
              <CustomInput
                type="text"
                className="form-control"
                placeholder="Buscar por Aluno"
                aria-label="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CustomSpan className="input-group-text" onClick={handleSearch}>
                <RiSearchLine style={{ fontSize: "20px", cursor: "pointer" }} />
              </CustomSpan>
            </div>
          </div>
          <div className="col-md-2 text-start text-md-end">
            <CustomButton
              type="button"
              className="btn"
              onClick={handleAddStudent}
            >
              <MdPersonAdd
                style={{
                  color: "#EA394E",
                  marginRight: "10px",
                  fontSize: "20px",
                }}
              />
              Adicionar
            </CustomButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Search;
