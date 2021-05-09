import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
const HomePage = (props) => {
  const [cookies] = useCookies(["accessToken", "refreshToken", "_id"]);
  const [user, setUser] = useState();
  const history = useHistory();
  const getUser = async () => {
    if (props.location.user) {
      console.log(props.location.user);
      setUser(props.location.user);
    } else {
      let accessToken = await cookies.accessToken;
      const connectedUser = await api.validate(accessToken);
      if (connectedUser) {
        setUser(connectedUser);
      } else {
        const jwt = await api.refreshToken({
          _id: cookies._id,
          refreshToken: cookies.refreshToken,
        });
        const connectedUser = await api.validate(jwt);
        if (connectedUser) {
          setUser(connectedUser);
        } else {
          history.push({ pathname: "/login" });
        }
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const logOut = () => {
    history.push({ pathname: "/login" });
  };
  return (
    <div>
      <p>
        שלום {user?.firstName} {user?.lastName}
      </p>
      <button className="btn btn-primary" onClick={logOut}>
        log out
      </button>
    </div>
  );
};

export default HomePage;
