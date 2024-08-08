"use client";
import React, { useEffect } from "react";
import { RedirectType, redirect } from "next/navigation";
import dataStore from "./services/data_store";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = dataStore.getItem('user:token');
    const path = window.location.pathname;

    if (token && path === "/") {
      return redirect("/feed", RedirectType.replace);
    } else if (!token && path !== "/") {
      return redirect("/", RedirectType.replace);
    }
  }, [window]);

  return children;
}
