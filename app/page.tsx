import SignInForm from "@/app/components/login_form";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[100vh]">
      <div className="relative h-full items-center justify-center grid lg:grid-cols-2">
        <div className="relative items-center justify-center h-full flex-col p-10 bg-[#fff] lg:text-white lg:flex lg:bg-[#000]">
          <div className="relative flex items-center text-4xl font-bold">
            <Image
              src="/logo_light.svg"
              alt="Quotopia"
              width={35}
              height={35}
              className="block lg:hidden"
            />
            <Image
              src="/logo_dark.svg"
              alt="Quotopia"
              width={35}
              height={35}
              className="hidden lg:block"
            />
            Quotopia
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to Sign In
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
