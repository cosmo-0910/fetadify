const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        © 2026 <span className="text-foreground font-semibold">Fetadify</span>. AI-Powered Digital Solutions.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#services" className="hover:text-foreground transition-colors">Services</a>
        <a href="#why" className="hover:text-foreground transition-colors">About</a>
        <a href="#booking" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
