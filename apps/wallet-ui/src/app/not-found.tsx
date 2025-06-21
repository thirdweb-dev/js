/* eslint-disable @next/next/no-img-element */

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <img alt="thirdweb" className="h-64 w-auto" src="./thirdweb.png" />
      <div>
        <h1 className="mb-1 font-bold text-7xl">404</h1>
        <h3 className="text-lg opacity-50">Page Not Found</h3>
      </div>
    </div>
  );
}
