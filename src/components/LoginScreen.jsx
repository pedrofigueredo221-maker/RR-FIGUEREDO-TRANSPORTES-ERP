export default function LoginScreen({ onLogin, error, busy }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '');

    if (!username || !password) {
      return;
    }

    onLogin(username, password);
  };

  return (
    <main className="login-shell">
      <div className="login-box">
        <h2>Login</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Usuário</label>
            <input id="username" name="username" autoComplete="username" placeholder="Digite seu usuário" />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" name="password" autoComplete="current-password" placeholder="Digite sua senha" />
          </div>

          <button type="submit" className="primary-button" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
