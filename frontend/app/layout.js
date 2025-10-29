import "./globals.css";

export const metadata = {
  title: "UAS Frontend",
  description: "UAS Frontend with Next.js and Laravel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}