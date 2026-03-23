import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Dashboard />
    </div>
  );
}
