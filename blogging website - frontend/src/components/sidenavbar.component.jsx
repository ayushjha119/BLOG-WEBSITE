import { Outlet } from "react-router-dom";

const SideNav = () => {
  return (
    <>
      <h1>this is side navbar from compinent</h1>
      <Outlet />
    </>
  );
};

export default SideNav;
