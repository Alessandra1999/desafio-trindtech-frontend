import { useState } from "react";
import styled from "styled-components";

const CustomForm = styled.form`
  margin-top: 62px;
`;

const Container = styled.div`
  max-width: 1098px;
  height: auto;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
`;

const CustomInput = styled.input`
  background-color: #f2f2f2;

  &:focus {
    background-color: #f2f2f2;
    outline: none;
    border-color: black;
    box-shadow: none;
  }
`;

const CustomSelect = styled.select`
  background-color: #f2f2f2;

  &:focus {
    background-color: #f2f2f2;
    outline: none;
    border-color: black;
    box-shadow: none;
  }
`;

const CustomLabel = styled.label`
  @media (max-width: 767px) {
    margin-top: 26px;
  }
`;

function StudentForm({ studentData, setStudentData }) {
  const [emailValid, setEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value) => {
    // Remove todos os caracteres não numéricos
    const cleanedValue = value.replace(/\D/g, "");
    // Adiciona a formatação de CPF
    if (cleanedValue.length <= 11) {
      const formattedValue = cleanedValue
        .replace(/(\d{3})(\d)/, "$1.$2") // adiciona o primeiro ponto
        .replace(/(\d{3})(\d)/, "$1.$2") // adiciona o segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // adiciona o traço
      return formattedValue;
    }
    return value; // Retorna o valor original se exceder 11 dígitos
  };

  const handleCpfChange = (e) => {
    const { value } = e.target;
    const formattedCpf = formatCPF(value);
    setStudentData((prev) => ({ ...prev, student_cpf: formattedCpf }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setStudentData((prev) => ({ ...prev, student_email: value }));

    if (emailTouched) {
      setEmailValid(validateEmail(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailValid(validateEmail(studentData.student_email));
  };

  return (
    <CustomForm>
      <Container className="container">
        <div className="row">
          <div className="form-group col-md-5">
            <label htmlFor="nameInput">Nome*</label>
            <CustomInput
              type="text"
              className="form-control"
              id="nameInput"
              name="student_name"
              value={studentData.student_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-7">
            <CustomLabel htmlFor="lastnameInput">Sobrenome</CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="lastnameInput"
              name="student_lastname"
              value={studentData.student_lastname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-3">
            <CustomLabel htmlFor="birthdateInput" style={{ marginTop: "26px" }}>
              Data de Nascimento*
            </CustomLabel>
            <CustomInput
              type="date"
              className="form-control"
              id="birthdateInput"
              name="student_birthdate"
              placeholder="dd/mm/aaaa"
              value={studentData.student_birthdate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3">
            <CustomLabel htmlFor="cpfInput" style={{ marginTop: "26px" }}>
              CPF
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="cpfInput"
              name="student_cpf"
              placeholder="000.000.000-00"
              maxLength="14"
              value={studentData.student_cpf}
              onChange={handleCpfChange}
            />
          </div>
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="genderInput" style={{ marginTop: "26px" }}>
              Gênero*
            </CustomLabel>
            <CustomSelect
              id="genderInput"
              name="student_gender"
              className="form-control"
              value={studentData.student_gender}
              onChange={handleChange}
            >
              <option value="">Escolher...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Não Binário">Não Binário</option>
              <option value="Outros">Outros</option>
              <option value="Prefiro Não Responder">
                Prefiro Não Responder
              </option>
            </CustomSelect>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="emailInput" style={{ marginTop: "26px" }}>
              Email*
            </CustomLabel>
            <CustomInput
              type="text"
              id="emailInput"
              name="student_email"
              placeholder="example@email.com"
              value={studentData.student_email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur} // Chama a função ao perder o foco
              className={`form-control ${
                !emailValid && emailTouched ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">
              Por favor, insira um e-mail válido.
            </div>
          </div>
        </div>
      </Container>
    </CustomForm>
  );
}

export default StudentForm;
