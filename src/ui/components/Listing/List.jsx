import { useState, useEffect } from "react";
import styled from "styled-components";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { FaArrowLeft, FaArrowRight, FaTrash, FaEdit } from "react-icons/fa";
import {
  getStudents,
  getStudentById,
  deleteStudent,
} from "../../../services/apiService";
import { useNavigate } from "react-router-dom";
import LoadingGif from "../../../assets/gifs/loading-gif-red.gif";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 52px;
`;

const CustomTable = styled.table`
  width: 1098px;
  height: auto;

  @media (max-width: 1200px) {
    width: 600px;
  }

  @media (max-width: 767px) {
    width: 500px;
  }

  @media (max-width: 505px) {
    width: 300px;
  }
`;

const CourseBadge = styled.span`
  background-color: #eff8ff;
  color: #1faeff;
  padding: 5px 10px;
  border-radius: 15px;
  border: 2px solid #ceeaff;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
`;

const MoreCourseBadge = styled.span`
  background-color: #f2f4f7;
  color: #5f6368;
  padding: 5px 10px;
  border-radius: 15px;
  border: 2px solid #dfdfdf;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
`;

const ContainerNav = styled.div`
  margin-top: 22px;
`;

const CustomNav = styled.nav`
  width: 720px;
  height: auto;
  text-align: center;
  padding: 16px;
`;

const CustomButton = styled.button`
  border: none;
  background-color: none;
  color: #5f6368;

  &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;

const PageButton = styled.button`
  border: none;
  background-color: none;
  color: #5f6368;

  &:focus {
    background-color: #bce7ff;
    font-weight: 600;
  }
`;

function List({ searchResults }) {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const navigate = useNavigate();
  // Estado para controle da página atual e número de alunos por página
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca inicial de alunos se `searchResults` estiver vazio
        if (searchResults.length === 0) {
          const students = await getStudents();
          const completeData = students.map((student) => ({
            id_student: student.id_student,
            register_date: student.student_register_date,
            firstName: student.student_name,
            lastName: student.student_lastname,
            state: student.Location?.state || "N/A",
            courses: student.Courses?.map((course) => course.course_name) || [],
          }));
          setStudentData(completeData);
        } else {
          // Define `searchResults` como `studentData`
          setStudentData(searchResults);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os dados dos alunos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchResults]);

  // Função para alternar a ordem de classificação
  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Ordenar os alunos com base na data de cadastro e ordem de classificação
  const sortedStudents = [...studentData].sort((a, b) => {
    const dateA = new Date(a.register_date);
    const dateB = new Date(b.register_date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Mostra os resultados da pesquisa, se houver.
  const studentsToDisplay =
    searchResults && searchResults.length > 0 ? searchResults : sortedStudents;

  // Paginação
  const totalPages = Math.ceil(studentsToDisplay.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentsToDisplay.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Função para renderizar a navegação entre páginas
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(
          1,
          2,
          3,
          "...",
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(
          1,
          2,
          3,
          "...",
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(1, 2, 3, "...");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push("...", totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return pageNumbers;
  };

  // Função para enviar os dados ao formulário para atualização
  const handleStudentClick = async (id_student) => {
    try {
      const completeStudentData = await getStudentById(id_student);
      navigate(`/update/${id_student}`, { state: completeStudentData });
    } catch (error) {
      console.error("Erro ao carregar dados do aluno: ", error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <img src={LoadingGif} alt="Carregando..." />
      </div>
    );
  }

  const handleDeleteClick = (studentId) => {
    const student = studentData.find((s) => s.id_student === studentId);
    setStudentToDelete(student);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.id_student);
        setStudentData((prev) =>
          prev.filter((s) => s.id_student !== studentToDelete.id_student)
        );
        setShowModal(false);
        toast.success("Dados deletados com sucesso!", {
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        toast.error("Erro ao deletar os dados!");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStudentToDelete(null);
  };

  return (
    <div>
      <Container className="container">
        <div className="table-responsive">
          <CustomTable className="table">
            <thead>
              <tr>
                <th
                  scope="col"
                  onClick={handleSortByDate}
                  style={{ cursor: "pointer" }}
                >
                  Data de Cadastro <HiOutlineSwitchVertical />
                </th>
                <th scope="col">Nome</th>
                <th scope="col">Estado</th>
                <th scope="col">Cursos</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => {
                const registrationDate = new Date(student.register_date);
                const formattedDate = `${String(
                  registrationDate.getDate()
                ).padStart(2, "0")}/${String(
                  registrationDate.getMonth() + 1
                ).padStart(2, "0")}/${registrationDate.getFullYear()}`;

                const coursesArray = Array.isArray(student.courses)
                  ? student.courses
                  : [];

                const maxCoursesToShow = 3;
                const displayedCourses = coursesArray.slice(
                  0,
                  maxCoursesToShow
                );
                const remainingCoursesCount =
                  coursesArray.length - maxCoursesToShow;

                return (
                  <tr>
                    <td>{formattedDate}</td>
                    <td
                      key={student.id_student}
                      onClick={() => handleStudentClick(student.id_student)}
                      style={{ cursor: "pointer" }}
                    >
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.state}</td>
                    <td>
                      {displayedCourses.map((course, index) => (
                        <CourseBadge key={index}>{course}</CourseBadge>
                      ))}
                      {remainingCoursesCount > 0 && (
                        <MoreCourseBadge>
                          +{remainingCoursesCount}
                        </MoreCourseBadge>
                      )}
                    </td>
                    <td>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                        onClick={() => handleStudentClick(student.id_student)}
                      >
                        <FaEdit size={15} color="#404244" />
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteClick(student.id_student)}
                      >
                        <FaTrash size={15} color="#404244" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <ConfirmationModal
              show={showModal}
              title="Confirmar Exclusão"
              message="Tem certeza que deseja excluir os dados do aluno?"
              onConfirm={confirmDelete}
              onCancel={closeModal}
              confirmText="Excluir"
              cancelText="Cancelar"
            />
          </CustomTable>
        </div>
      </Container>
      <ContainerNav className="d-flex justify-content-center align">
        <CustomNav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage == 1 ? "disabled" : ""}`}>
              <CustomButton
                style={{ marginRight: "84px" }}
                className="btn btn-custom"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage == 1}
              >
                <FaArrowLeft /> Anterior
              </CustomButton>
            </li>
            {renderPageNumbers().map((number, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === number ? "active" : ""
                }`}
              >
                {number === "..." ? (
                  <span className="page-link">...</span>
                ) : (
                  <PageButton
                    onClick={() => setCurrentPage(number)}
                    className="btn btn-custom"
                  >
                    {number}
                  </PageButton>
                )}
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <CustomButton
                style={{ marginLeft: "84px" }}
                className="btn btn-custom"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Próximo <FaArrowRight />
              </CustomButton>
            </li>
          </ul>
        </CustomNav>
      </ContainerNav>
    </div>
  );
}

export default List;
