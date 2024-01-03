import { Outlet } from 'react-router-dom';
// import { Header } from './components/header/Header';
import { Header } from './components/header/Header';

export default function Layout(props) {
  const { setIsAuth, user, language, languages, setLanguage } = props;
  return (
    // <div className="py-4 px-8 flex flex-col min-h-screen max-w-4xl mx-auto">
    <div className="bg-gray-100 w-full overflow-hidden">
      <Header
        setIsAuth={setIsAuth}
        user={user}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
      <Outlet />
    </div>
  );
}
