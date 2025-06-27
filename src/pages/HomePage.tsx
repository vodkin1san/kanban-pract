import { Link } from "react-router";
import RoutesEnum from "../enums/routes";

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the HomePage form. (To be implemented)</p>
      <p>
        Перейти на страницу входа: <Link to={RoutesEnum.LOGIN}>Login</Link>
      </p>
      <p>
        Перейти на страницу регистрации: <Link to={RoutesEnum.SIGNUP}>SignUp</Link>
      </p>
    </div>
  );
};

export { HomePage };
