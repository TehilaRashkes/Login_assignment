import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
const HomePage = (props) => {
  const [cookies] = useCookies(["accessToken", "access-token", "_id"]);
  const [user, setUser] = useState();
  const history = useHistory();
  const getUser = async () => {
    try {
      if (props.location.user) {
        console.log(props.location.user);
        setUser(props.location.user);
      } else {
        const jwt = cookies.accessToken;
        const connectedUser = await api.validate(jwt);
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
            history.push({ pathname: "/" });
          }
        }
      }
    } catch {
      history.push({ pathname: "/" });
    }
  };
  useEffect(() => {
    getUser();
  });

  const logOut = () => {
    history.push({ pathname: "/" });
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
