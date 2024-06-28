import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/user/Layout.css'; // 스타일을 위해 CSS 파일을 추가합니다.

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Law&Good</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sex-crimes">성범죄</Link></li>
            <li><Link to="/drugs">마약</Link></li>
            <li><Link to="/divorce">이혼</Link></li>
            <li><Link to="/admin-lawsuit">행정소송</Link></li>
          </ul>
        </nav>
      </header>
      <div className="main">
        <aside className="sidebar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sex-crimes">성범죄</Link></li>
            <li><Link to="/drugs">마약</Link></li>
            <li><Link to="/divorce">이혼</Link></li>
            <li><Link to="/admin-lawsuit">행정소송</Link></li>
          </ul>
        </aside>
        <div className="content">
          {children}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Law&Good. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;