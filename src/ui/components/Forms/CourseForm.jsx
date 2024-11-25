import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAddCircleOutline } from "react-icons/md";
import { getCourses } from "../../../services/apiService";

const CustomForm = styled.form`
  margin-top: 62px;
`;

const Container = styled.div`
  max-width: 1098px;
  height: auto;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  margin-bottom: 50px;
`;

const Title = styled.h4`
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: 500;
`;

const CourseRow = styled.div`
  display: flex;
  margin-top: ${(props) =>
    props.index > 0
      ? "26px"
      : "0px"}; /* Condicional para adicionar margin-top somente nas novas linhas */
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

const CustomSelect = styled.select`
  background-color: #fff;

  &:focus {
    background-color: #f2f2f2;
    outline: none;
    border-color: black;
    box-shadow: none;
  }
`;

const CustomButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 24px;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const CustomLabel = styled.label`
  @media (max-width: 767px) {
    margin-top: 26px;
  }
`;

function CourseForm({ studentData, setStudentData }) {
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        setAvailableCourses(courses);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };
    fetchCourses();
  }, []);

  // Função para adicionar novos campos de input
  const handleAddCourse = () => {
    setStudentData((prevData) => ({
      ...prevData,
      Courses: [
        ...(prevData.Courses || []),
        {
          id_course: "",
          course_name: "",
          StudentCourse: { conclusion_date: "" },
        },
      ],
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...studentData.Courses];
    if (field === "StudentCourse") {
      updatedCourses[index].StudentCourse.conclusion_date =
        value.conclusion_date || "";
    } else {
      updatedCourses[index][field] = value;
    }
    setStudentData({ ...studentData, Courses: updatedCourses });
  };

  const handleCourseSelect = (index, selectedOption) => {
    console.log("Selected course ID: ", selectedOption);
    const selectedCourse = availableCourses.find((course) => {
      return course.id_course == Number(selectedOption);
    });

    if (selectedCourse) {
      console.log("Selected course data: ", selectedCourse);
      handleInputChange(index, "id_course", selectedCourse.id_course);
      handleInputChange(index, "course_name", selectedCourse.course_name);
    } else {
      console.error("Nenhum curso encontrado para o ID selecionado");
    }
  };

  return (
    <CustomForm>
      <Container className="container">
        <Title>Cursos</Title>
        {(studentData.Courses || []).map((course, index) => (
          <CourseRow className="row" key={index} index={index}>
            <div className="form-group col-md-8">
              <label htmlFor={`courseSelect${index}`}>Nome do Curso</label>
              <CustomSelect
                className="form-control"
                id={`courseSelect${index}`}
                name="course_name"
                value={course.id_course || ""}
                onChange={(e) => handleCourseSelect(index, e.target.value)}
              >
                <option value="">Selecione um curso</option>
                {availableCourses.length > 0 ? (
                  availableCourses.map((course) => (
                    <option key={course.id_course} value={course.id_course}>
                      {course.course_name}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhum curso disponível</option>
                )}
              </CustomSelect>
            </div>
            <div className="form-group col-md-4 d-flex align-items-center">
              <div className="w-100">
                <CustomLabel htmlFor={`conclusionInput${index}`}>
                  Data de Conclusão*
                </CustomLabel>
                <div className="d-flex">
                  <CustomInput
                    type="date"
                    className="form-control"
                    id={`conclusionInput${index}`}
                    name="conclusion_date"
                    value={course.StudentCourse.conclusion_date || ""}
                    onChange={(e) =>
                      handleInputChange(index, "StudentCourse", {
                        conclusion_date: e.target.value,
                      })
                    }
                  />
                  <CustomButton type="button" onClick={handleAddCourse}>
                    <MdAddCircleOutline />
                  </CustomButton>
                </div>
              </div>
            </div>
          </CourseRow>
        ))}
      </Container>
    </CustomForm>
  );
}

export default CourseForm;
