import './App.css';

const checks = [
  ['Backend', 'Java 21 + Spring Boot'],
  ['Frontend', 'React + Vite + TypeScript'],
  ['검증', 'Vitest smoke test']
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="status-panel" aria-labelledby="app-title">
        <h1 id="app-title">Boundary</h1>
        <p>KTD-9 개발환경 기준선 scaffold가 준비되었습니다.</p>
        <ul className="status-list" aria-label="기준선 상태">
          {checks.map(([label, value]) => (
            <li key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
