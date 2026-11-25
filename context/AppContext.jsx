import { createContext, useContext, useEffect, useReducer } from "react";
import { fetchFitnessQuotes } from "../services/api";

const AppContext = createContext(null);
const ADMIN_SESSION_KEY = "fitness-admin-session-v1";
export const ADMIN_DEFAULT_PIN = "admin123";

function readAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";
  } catch {
    return false;
  }
}

const initialState = {
  themeMode: "light",
  adminAuthenticated: readAdminSession(),
  toast: {
    open: false,
    message: "",
    severity: "success",
  },
  quotes: [],
  quotesSource: "loading",
  quotesLoading: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        themeMode: state.themeMode === "light" ? "dark" : "light",
      };
    case "SET_ADMIN_AUTH":
      return {
        ...state,
        adminAuthenticated: action.payload,
      };
    case "SHOW_TOAST":
      return {
        ...state,
        toast: {
          open: true,
          message: action.payload.message,
          severity: action.payload.severity || "success",
        },
      };
    case "HIDE_TOAST":
      return {
        ...state,
        toast: {
          ...state.toast,
          open: false,
        },
      };
    case "SET_QUOTES":
      return {
        ...state,
        quotes: action.payload.items,
        quotesSource: action.payload.source,
        quotesLoading: false,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let active = true;
    fetchFitnessQuotes().then((res) => {
      if (active) {
        dispatch({
          type: "SET_QUOTES",
          payload: { items: res.items, source: res.source },
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function showToast(message, severity = "success") {
    if (!message) return;
    dispatch({
      type: "SHOW_TOAST",
      payload: { message, severity },
    });
  }

  function closeToast() {
    dispatch({ type: "HIDE_TOAST" });
  }

  function toggleTheme() {
    dispatch({ type: "TOGGLE_THEME" });
  }

  function loginAdmin(pin) {
    if ((pin || "").trim() !== ADMIN_DEFAULT_PIN) {
      return {
        ok: false,
        message: "Mật khẩu / PIN quản trị chưa đúng (mặc định: admin123).",
      };
    }
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
    } catch {
      // ignore storage error
    }
    dispatch({ type: "SET_ADMIN_AUTH", payload: true });
    showToast("Đăng nhập cổng quản trị Admin thành công.", "success");
    return { ok: true };
  }

  function logoutAdmin() {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore storage error
    }
    dispatch({ type: "SET_ADMIN_AUTH", payload: false });
    showToast("Đã đăng xuất khỏi trang quản trị.", "info");
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        showToast,
        closeToast,
        toggleTheme,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext phải được dùng bên trong AppProvider");
  }
  return ctx;
}
