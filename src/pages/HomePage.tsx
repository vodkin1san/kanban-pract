import { Link } from "react-router";

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the HomePage form. (To be implemented)</p>
      <p>
        Перейти на страницу входа: <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export { HomePage };
