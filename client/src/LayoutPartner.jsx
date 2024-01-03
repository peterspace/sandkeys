import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function LayoutPartner() {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  const location = useLocation();
  // return (
  //   <div className="bg-gray-100 w-full overflow-hidden">
  //     {user?.role === 'Partner' ? (
  //       <Outlet />
  //     ) : (
  //       <Navigate to="/auth" state={{ from: location }} replace />
  //     )}
  //   </div>
  // );
  return (
    <>
      {user?.role === 'Partner' ? (
        <Outlet />
      ) : (
        <Navigate to="/auth" state={{ from: location }} replace />
      )}
    </>
  );
}
