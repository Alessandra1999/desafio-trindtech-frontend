import styled from 'styled-components';
import { FaTrash, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../../../assets/images/logo.png';

const CustomHeader = styled.header`
    width: 100%;
    height: 67px;
    background-color: #EA394E;
    display: flex; 
    align-items: center; 
    color: #fff;
`;

const Logo = styled.a`
    margin-left: 42px;
`;

const TextContainer = styled.div`
    display: flex;
    align-items: center; 
    margin-left: 25px;
    margin-right: 25px; 
`;

const Text = styled.p`
    font-family: "Montserrat", sans-serif;
    font-weight: 800;
    margin-left: 25px;
    margin-right: 20px;
    margin-top: 18px;
`;

const StudentName = styled.span`
    font-family: "Montserrat", sans-serif;
    font-weight: normal; 
    margin-left: 20px;
`;

const IconButton = styled.div`
    margin-left: 25px;
    cursor: pointer;
`;

function DynamicHeader({ showLogo = true, backIcon, studentName, onDelete }) {

    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/');
    }

    return (
        <CustomHeader className='sticky-top'>
            {/* Ícone de Voltar */}
            {backIcon && (
                <IconButton onClick={handleReturn}>
                    <FaChevronLeft size={24} />
                </IconButton>
            )}

            {/* Logo e Texto */}
            <div className='d-flex align-items-center'>
                {showLogo && (
                    <Logo className='navbar-brand' href='/'>
                        <img src={LogoImg}></img>
                    </Logo>
                )}
                <TextContainer>
                    <Text>Gerenciador de alunos</Text>
                    {studentName && (
                        <>
                            <span>|</span>
                            <StudentName>{studentName}</StudentName>
                        </>
                    )} {/* Exibe o nome do aluno com font-weight normal */}
                </TextContainer>
            </div>

            {/* Ícone de Lixeira */}
            {onDelete && (
                <IconButton onClick={onDelete} style={{ marginLeft: 'auto', marginRight: '25px' }}>
                    <FaTrash size={24} />
                </IconButton>
            )}
        </CustomHeader>
    );
}

export default DynamicHeader;
