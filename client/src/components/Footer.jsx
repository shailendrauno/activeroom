const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-sm">
          © {new Date().getFullYear()} ActiveRoom. All rights reserved.
        </p>
        <p className="text-sm text-gray-400">
          Built with ❤️ codewithshailendra
        </p>
      </div>
    </footer>
  );
};

export default Footer;
