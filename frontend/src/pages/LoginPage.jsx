// ARQUIVO COMPLETO E FINAL: src/pages/LoginPage.jsx (CONECTADO COM A API LARAVEL)

import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
import api, { ensureCsrfCookie } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const gradientDrift = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at top, #395b6a 0%, #1b3037 45%, #102027 100%);
    background-size: 160% 160%;
    animation: ${gradientDrift} 24s ease alternate infinite;
`;

const boxReveal = keyframes`
    0% {
        opacity: 0;
        transform: translateY(18px) scale(0.96);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const orbFloat = keyframes`
    0% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.28;
    }
    50% {
        transform: translate3d(38px, -42px, 0) scale(1.08);
        opacity: 0.42;
    }
    100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.28;
    }
`;

const logoPulse = keyframes`
    0% {
        transform: translateY(0) scale(1);
        filter: drop-shadow(0 6px 18px rgba(157, 217, 210, 0.22));
    }
    50% {
        transform: translateY(-6px) scale(1.03);
        filter: drop-shadow(0 10px 26px rgba(157, 217, 210, 0.32));
    }
    100% {
        transform: translateY(0) scale(1);
        filter: drop-shadow(0 6px 18px rgba(157, 217, 210, 0.22));
    }
`;

const formFade = keyframes`
    0% {
        opacity: 0;
        transform: translateY(14px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const fieldReveal = keyframes`
    0% {
        opacity: 0;
        transform: translateY(18px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const sheenSlide = keyframes`
    0% {
        transform: translateX(-140%) rotate(16deg);
        opacity: 0;
    }
    48% {
        opacity: 0.35;
    }
    100% {
        transform: translateX(160%) rotate(16deg);
        opacity: 0;
    }
`;

const buttonGlow = keyframes`
    0%, 100% {
        box-shadow: 0 14px 28px rgba(39, 77, 86, 0.48), 0 0 0 0 rgba(157, 217, 210, 0.36);
    }
    50% {
        box-shadow: 0 16px 38px rgba(39, 77, 86, 0.62), 0 0 22px 6px rgba(157, 217, 210, 0.45);
    }
`;

const buttonSheen = keyframes`
    0% {
        transform: translate3d(-140%, 0, 0) rotate(18deg);
        opacity: 0;
    }
    46% {
        opacity: 0;
    }
    58% {
        opacity: 0.5;
    }
    100% {
        transform: translate3d(220%, 0, 0) rotate(18deg);
        opacity: 0;
    }
`;

const LoginBox = styled.div`
    width: 480px;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(54,73,78,0.82) 0%, rgba(26,49,55,0.82) 100%);
    border-radius: 20px;
    padding: 40px 50px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.55);
    backdrop-filter: blur(12px);
    text-align: center;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(157, 217, 210, 0.12);
    z-index: 1;
    opacity: 0;
    animation: ${boxReveal} 0.7s ease forwards;
    &::before {
        content: '';
        position: absolute;
        top: -35%;
        left: -60%;
        width: 80%;
        height: 170%;
        background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(180,231,226,0.18) 45%, rgba(255,255,255,0) 90%);
        opacity: 0;
        animation: ${sheenSlide} 5.6s ease-in-out infinite 1.4s;
    }
`;

const LogoImage = styled.img`
    width: 300px;
    max-width: 80%;
    margin-bottom: 20px;
    animation: ${logoPulse} 6.8s ease-in-out infinite;
`;

const Description = styled.p`
    margin: 12px 0 24px 0;
    font-size: 18px;
    color: rgba(224,224,224,0.94);
    font-weight: 500;
    letter-spacing: 0.25px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
    opacity: 0;
    animation: ${formFade} 0.75s ease forwards 0.2s;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    opacity: 0;
    animation: ${fieldReveal} 0.6s ease forwards;
    &:nth-of-type(1) {
        animation-delay: 0.28s;
    }
    &:nth-of-type(2) {
        animation-delay: 0.38s;
    }
`;

const Label = styled.label`
    font-size: 16px;
    color: rgba(230,230,230,0.8);
    margin-bottom: 12px;
    text-align: left;
    font-weight: 600;
`;

const Input = styled.input`
    width: 100%;
    height: 50px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255,255,255,0.06);
    color: #fff;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    &::placeholder {
        color: rgba(200,200,200,0.5);
    }
    &:focus {
        background: rgba(255,255,255,0.10);
        box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.5);
        border: 1px solid rgba(157, 217, 210, 0.5);
    }
`;

const Button = styled.button`
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 12px;
    background: #9dd9d2;
    color: #000;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: ${fieldReveal} 0.6s ease forwards 0.48s, ${buttonGlow} 4.2s ease-in-out infinite 1.4s;
    &:hover {
        background: #86c7bf;
        transform: translateY(-2px);
    }
    &:disabled {
        background: #555;
        cursor: not-allowed;
        box-shadow: none;
        animation: none;
    }
    &::after {
        content: '';
        position: absolute;
        top: -120%;
        left: -60%;
        width: 65%;
        height: 260%;
        background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%);
        opacity: 0;
        transform: translate3d(-140%, 0, 0) rotate(18deg);
        animation: ${buttonSheen} 5s ease-in-out infinite 1.6s;
        pointer-events: none;
    }
`;

const Message = styled.p`
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
    color: ${props => (props.type === 'error' ? '#ff8a80' : '#b9f6ca')};
    letter-spacing: 0.2px;
    opacity: 0;
    animation: ${fieldReveal} 0.6s ease forwards 0.62s;
`;

const AmbientLayer = styled.div`
    position: absolute;
    inset: -18%;
    pointer-events: none;
    z-index: 0;
    filter: saturate(120%);
`;

const AmbientOrb = styled.span`
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(157, 217, 210, 0.38) 0%, rgba(54, 73, 78, 0) 70%);
    mix-blend-mode: screen;
    animation: ${orbFloat} 22s ease-in-out infinite;
    filter: blur(10px);
    &:nth-of-type(1) {
        top: -6%;
        left: -4%;
        animation-delay: 0s;
    }
    &:nth-of-type(2) {
        bottom: -14%;
        right: -8%;
        width: 280px;
        height: 280px;
        animation-delay: 2s;
        background: radial-gradient(circle, rgba(157, 217, 210, 0.32) 0%, rgba(26, 49, 55, 0) 68%);
    }
    &:nth-of-type(3) {
        top: 38%;
        left: 66%;
        width: 220px;
        height: 220px;
        animation-delay: 4s;
        background: radial-gradient(circle, rgba(150, 209, 255, 0.28) 0%, rgba(26, 49, 55, 0) 70%);
    }
`;

const overlayFade = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const spinnerTurn = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const successPop = keyframes`
    0% {
        transform: scale(0.6);
        opacity: 0;
    }
    60% {
        transform: scale(1.08);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const LoadingOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(7, 19, 25, 0.78);
    backdrop-filter: blur(6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 2;
    animation: ${overlayFade} 0.25s ease forwards;
    pointer-events: all;
`;

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid rgba(157, 217, 210, 0.24);
    border-top-color: #9dd9d2;
    animation: ${spinnerTurn} 0.8s linear infinite;
`;

const OverlayText = styled.span`
    font-size: 15px;
    color: #e8fffb;
    letter-spacing: 0.3px;
    font-weight: 500;
`;

const SuccessWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: #9dd9d2;
    font-weight: 600;
    font-size: 20px;
    animation: ${successPop} 0.45s ease forwards;
    svg {
        font-size: 44px;
    }
`;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [successAnimation, setSuccessAnimation] = useState(false);
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) {
            window.location.replace('/dashboard');
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSuccessAnimation(false);

        try {
            await ensureCsrfCookie();
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            const userResp = response?.data?.data;
            const token = response?.data?.token;

            if (userResp && token) {
                setSuccessAnimation(true);
                setTimeout(() => {
                    login(userResp, token);
                }, 900);
            } else {
                setMessage('Erro: Resposta da API inválida.');
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'Credenciais inválidas.');
            } else {
                setMessage('Erro de conexão. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <LoginContainer>
            <AmbientLayer>
                <AmbientOrb />
                <AmbientOrb />
                <AmbientOrb />
            </AmbientLayer>
            <LoginBox>
                {loading && (
                    <LoadingOverlay>
                        {successAnimation ? (
                            <SuccessWrapper>
                                <FiCheckCircle />
                                <span>Bem-vindo(a)!</span>
                            </SuccessWrapper>
                        ) : (
                            <>
                                <Spinner />
                                <OverlayText>Validando credenciais...</OverlayText>
                            </>
                        )}
                    </LoadingOverlay>
                )}
                <LogoImage src={logo} alt="Logo da Empresa" />
                <Description>
                    Acesse seu painel com segurança. Por favor, insira seu e-mail e senha.
                </Description>
                <LoginForm onSubmit={handleLogin}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" autoComplete="email" placeholder="seu@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Senha</Label>
                        <div style={{ position: 'relative' }}>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="********"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '44px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#ccc',
                                    cursor: 'pointer',
                                    fontSize: 22,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </FormGroup>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </LoginForm>
                {message && <Message type={message.toLowerCase().includes('inválid') || message.toLowerCase().includes('erro') ? 'error' : 'success'}>{message}</Message>}
            </LoginBox>
        </LoginContainer>
    );
};

export default LoginPage;
