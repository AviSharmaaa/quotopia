"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/app/lib/utils";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Icons } from "@/app/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import auth from "../services/auth";
import dataStore from "../services/data_store";
import { toast } from "./ui/use-toast";
import { AxiosError } from "axios";

export const loginSchema = z.object({
  username: z.string().min(1, "Required"),
  otp: z.string().min(1, "Required"),
});

const LogInForm = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();

  const form = useForm<LogInSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      otp: "",
    },
  });

  const onSubmit = async (data: LogInSchema) => {
    const token = await auth.login(data);

    if (typeof token === "string") {
      dataStore.setItem("user:token", token);
      setTimeout(() => {
        router.replace("/feed");
      }, 500);
    } else {
      let error = "Some Error Occurred, Please Try Again Later";
      if (token instanceof AxiosError) {
        error = token.response?.data;
      }
      toast({
        title: "Some Error Occurred",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Username"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="OTP"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LogInForm;
