import styled from "styled-components";
import { fetchAddress } from "../../../services/apiService";

const CustomForm = styled.form`
  margin-top: 62px;
`;

const Container = styled.div`
  max-width: 1098px;
  height: auto;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
`;

const Title = styled.h4`
  margin-bottom: 32px;
  font-size: 22px;
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

const CustomLabel = styled.label`
  @media (max-width: 767px) {
    margin-top: 26px;
  }
`;

function LocationForm({ studentData, setStudentData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cep") {
      let formattedValue = value.replace(/\D/g, "");

      if (formattedValue.length > 5) {
        formattedValue = formattedValue.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
      }

      if (formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9);
      }

      setStudentData((prev) => ({
        ...prev,
        Location: { ...prev.Location, [name]: formattedValue },
      }));

      // Faz a requisição se o CEP estiver completo (00000-000)
      if (formattedValue.length === 9) {
        fetchAddress(formattedValue, setStudentData);
      }
    } else {
      setStudentData((prev) => ({
        ...prev,
        Location: { ...prev.Location, [name]: value },
      }));
    }
  };

  return (
    <CustomForm>
      <Container className="container">
        <Title>Localização</Title>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="zipCodeInput">CEP*</label>
            <CustomInput
              type="text"
              className="form-control"
              id="zipCodeInput"
              name="cep"
              placeholder="00000-000"
              value={studentData.Location.cep}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="countryInput">País</CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="countryInput"
              name="country"
              value={studentData.Location.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="streetInput" style={{ marginTop: "26px" }}>
              Rua
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="streetInput"
              name="street"
              value={studentData.Location.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="district" style={{ marginTop: "26px" }}>
              Bairro
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="districtInput"
              name="district"
              value={studentData.Location.district}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="numberInput" style={{ marginTop: "26px" }}>
              Número*
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="numberInput"
              name="number"
              value={studentData.Location.number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <CustomLabel
              htmlFor="complementInput"
              style={{ marginTop: "26px" }}
            >
              Complemento
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="complementInput"
              name="complement"
              value={studentData.Location.complement}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="cityInput" style={{ marginTop: "26px" }}>
              Cidade
            </CustomLabel>
            <CustomInput
              type="text"
              className="form-control"
              id="cityInput"
              name="city"
              value={studentData.Location.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <CustomLabel htmlFor="stateInput" style={{ marginTop: "26px" }}>
              Estado
            </CustomLabel>
            <CustomInput
              type="text"
              id="stateInput"
              name="state"
              className="form-control"
              value={studentData.Location.state}
              onChange={handleChange}
            />
          </div>
        </div>
      </Container>
    </CustomForm>
  );
}

export default LocationForm;
