import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCtx } from "./userCtx";

const useCheckPermission = ({
  permission,
}: {
  permission: "admins" | "commands" | "guests";
}) => {
  const navigate = useNavigate();
  const { userData } = useContext(UserCtx);

  const { command_name } = userData;
  const first_reload = useRef(true);

  useEffect(() => {
    const wrapper = () => {
      switch (permission) {
        case "admins":
          if (command_name == "מנהלים") return;
          if (command_name) return navigate("/neededInventory");
          return navigate("/login");
          break;
        case "commands":
          if (command_name) return;
          return navigate("/login");
          break;
        case "guests":
          if (!command_name) return;
          return navigate("/neededInventory");
          break;
        default:
          return navigate("/login");
      }
    };
    if (first_reload.current) {
      first_reload.current = false;
    } else {
      wrapper();
    }
  }, [navigate, command_name]);

  return 1;
};

export default useCheckPermission;
