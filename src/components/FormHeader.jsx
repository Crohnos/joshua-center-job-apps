import ThemeToggle from './ThemeToggle';

function FormHeader() {
  return (
    <header className="app-header">
      <div className="theme-toggle-container">
        <ThemeToggle fixed={true} />
      </div>
      <h1 className="app-title">The Joshua Center</h1>
      <p className="app-subtitle">Job Application Portal</p>
    </header>
  );
}

export default FormHeader;