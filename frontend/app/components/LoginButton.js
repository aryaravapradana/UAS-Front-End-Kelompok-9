'use client';

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogin}
      className="btn btn-info rounded-pill px-3 px-md-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
      style={{
        background: 'linear-gradient(135deg, #bebebeff 0%, #2a3134ff 100%)',
        border: 'none',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(128, 128, 128, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      <i className="fas fa-sign-in-alt"></i>
      <span>Login</span>
    </button>
  );
}