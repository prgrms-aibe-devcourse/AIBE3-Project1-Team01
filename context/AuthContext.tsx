"use client";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
//타입 정의
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser(); //로그인 유지
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    //인증 상태 변경 감지하는 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 클린업 함수 - 이벤트 중복 호출 방지
    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error }; // 객체로 반환
  };

  const handleLogIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.reload(); // 로그아웃 시 바로 윈도우 리로딩
    setIsLoading(false);
  };

  const value = {
    user,
    isLoading,
    handleSignUp,
    handleLogIn,
    handleLogout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
