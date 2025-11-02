// Correct MainLayout.jsx example
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div>
      <header>
        {/* Your header content */}
      </header>
      <main>
        <Outlet /> {/* This is where nested routes (like Dashboard) will render */}
      </main>
      <footer>
        {/* Your footer content */}
      </footer>
    </div>
  );
}
export default MainLayout;