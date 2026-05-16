// Profil.jsx

import { useSelector } from "react-redux";
import EdituserProfil from "./EdituserProfil";

const Profil = () => {

  const user = useSelector((store) => store.user?.user);

  return (
    <div>
      <EdituserProfil user={user} />
    </div>
  );
};

export default Profil;